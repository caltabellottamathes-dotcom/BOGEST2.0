import { secrets } from 'base44:runtime';

const AGENT_ID = 'agent_6601kyn1xnn8ebm9m9ahk52ghmr5';
const BASE = 'https://api.elevenlabs.io/v1/convai/agents';
const APP_ID = '6a62118af65a96c8b1eb8e17';
const BASE44_API_URL = 'https://bogest-20-copy.base44.app';
const PROXY_URL = `${BASE44_API_URL}/api/apps/${APP_ID}/functions/elevenLabsLLMProxy`;

function authHeaders() {
  const key = secrets.get('ELEVENLABS_API_KEY');
  if (!key) throw new Error('ELEVENLABS_API_KEY not set');
  return { 'xi-api-key': key, 'Content-Type': 'application/json' };
}

const SYS = `You are Vraag het aan Bogèst, the digital host of a Belgian grill restaurant (Hasselt, Borgloon, Heusden-Zolder). For EVERY response where you mention, recommend or describe a specific dish, location, page or topic, you MUST call the client tool "websiteAction" the INSTANT you name that item with { "action": "navigate", "target": "<the item in your own words, in Dutch>" }. Keep your spoken reply short, warm, in Dutch, using the polite "u/uw" form. Never narrate that you are navigating or calling a tool — just call it and keep talking about the topic.`;

const TOOLS = [
  {
    type: 'function',
    function: {
      name: 'websiteAction',
      description: 'Drive the website in real time: navigate to / scroll to / highlight a specific item, close a panel, or show a beeldbank photo.',
      parameters: {
        type: 'object',
        properties: {
          action: { type: 'string', enum: ['navigate', 'close', 'showBeeldbankPhoto'] },
          target: { type: 'string', description: 'The specific item, in your own words and the visitor language.' },
          data: { type: 'object' },
        },
        required: ['action'],
      },
    },
  },
];

const DEFAULT_TEST_MSG = 'Wat is jullie specialiteit?';

async function ping(key, url) {
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + key },
      body: JSON.stringify({ ping: true }),
    });
    const txt = await res.text().catch(() => '');
    let j = null; try { j = JSON.parse(txt); } catch {}
    return { url, ok: res.ok, status: res.status, pong: j, raw: j ? undefined : txt.slice(0, 200) };
  } catch (e) {
    return { url, ok: false, error: String(e) };
  }
}

// Fetch the agent's REAL system prompt — the one ElevenLabs sends in a live
// call — so tests exercise the actual pushed instructions (incl. the
// anticipatory-navigation rules) through the proxy + websiteAction tool.
async function getRealSystemPrompt() {
  const g = await fetch(`${BASE}/${AGENT_ID}`, { headers: authHeaders() });
  if (!g.ok) return SYS;
  const a = await g.json();
  const p = a.conversation_config && a.conversation_config.agent && a.conversation_config.agent.prompt && a.conversation_config.agent.prompt.prompt;
  return (typeof p === 'string' && p.length) ? p : SYS;
}

async function chatTest(key, url, message) {
  const t0 = Date.now();
  try {
    const systemPrompt = await getRealSystemPrompt();
    const messages = [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: message || DEFAULT_TEST_MSG },
    ];
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + key },
      body: JSON.stringify({ model: 'bogest-via-base44', messages, tools: TOOLS, stream: false, debug: true }),
    });
    const ms = Date.now() - t0;
    const txt = await res.text().catch(() => '');
    let j = null; try { j = JSON.parse(txt); } catch {}
    if (!res.ok) return { ok: false, status: res.status, totalMs: ms, raw: txt.slice(0, 400) };
    const choice = j && j.choices && j.choices[0];
    const msg = choice && choice.message;
    return {
      ok: true,
      status: res.status,
      totalMs: ms,
      llmMs: j && j._llm_ms,
      finish_reason: choice && choice.finish_reason,
      content: msg && msg.content,
      tool_calls: (msg && msg.tool_calls) || [],
      raw: j && j._raw,
    };
  } catch (e) {
    return { ok: false, totalMs: Date.now() - t0, error: String(e) };
  }
}

// The LIVE ElevenLabs path uses stream:true. Verify tool_calls actually appear
// in the SSE delta stream (not just the bulk JSON) in the exact OpenAI chunk
// shape, because that's what the widget parses to execute the client tool.
async function streamingTest(key, url, message) {
  const t0 = Date.now();
  try {
    const systemPrompt = await getRealSystemPrompt();
    const messages = [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: message || DEFAULT_TEST_MSG },
    ];
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + key },
      body: JSON.stringify({ model: 'bogest-via-base44', messages, tools: TOOLS, stream: true }),
    });
    if (!res.ok || !res.body) return { ok: false, status: res.status, totalMs: Date.now() - t0 };
    const reader = res.body.getReader();
    const dec = new TextDecoder();
    let buf = '';
    let content = '';
    let frames = 0;
    let finishReason = null;
    const tcs = {};
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      buf += dec.decode(value, { stream: true });
      let idx;
      while ((idx = buf.indexOf('\n\n')) !== -1) {
        const block = buf.slice(0, idx); buf = buf.slice(idx + 2);
        for (const line of block.split('\n')) {
          if (!line.startsWith('data: ')) continue;
          const payload = line.slice(6);
          if (payload === '[DONE]') continue;
          frames++;
          try {
            const obj = JSON.parse(payload);
            const ch = obj.choices && obj.choices[0];
            if (!ch) continue;
            if (ch.delta && typeof ch.delta.content === 'string') content += ch.delta.content;
            if (ch.delta && Array.isArray(ch.delta.tool_calls)) {
              for (const tc of ch.delta.tool_calls) {
                const i = tc.index ?? 0;
                if (!tcs[i]) tcs[i] = { id: tc.id || '', name: '', arguments: '' };
                if (tc.id) tcs[i].id = tc.id;
                if (tc.function && tc.function.name) tcs[i].name = tc.function.name;
                if (tc.function && typeof tc.function.arguments === 'string') tcs[i].arguments += tc.function.arguments;
              }
            }
            if (ch.finish_reason) finishReason = ch.finish_reason;
          } catch { /* partial frame */ }
        }
      }
    }
    const tool_calls = Object.values(tcs).map((t) => ({ id: t.id, function: { name: t.name, arguments: t.arguments } }));
    return {
      ok: true,
      totalMs: Date.now() - t0,
      frames,
      finishReason,
      content,
      tool_calls,
      hasToolCall: tool_calls.length > 0,
    };
  } catch (e) {
    return { ok: false, totalMs: Date.now() - t0, error: String(e) };
  }
}

export default async function(req) {
  try {
    const key = secrets.get('ELEVENLABS_API_KEY');
    if (!key) return Response.json({ error: 'no_key' }, { status: 500 });

    const payload = await req.json().catch(() => ({}));
    const doPatch = !!(payload && payload.patch);
    const patchOnly = !!(payload && payload.patchOnly);
    const inspectOnly = !!(payload && payload.inspect);
    const quiet = inspectOnly || patchOnly;

    // 1) Confirm the proxy is reachable on its public URL.
    const probe = quiet ? null : await ping(key, PROXY_URL);

    // 2) Real chat test through the proxy (bulk) + the live STREAMING path.
    let chat = null;
    let stream = null;
    if (!quiet && probe && probe.ok) {
      chat = await chatTest(key, PROXY_URL, payload?.message);
      stream = await streamingTest(key, PROXY_URL, payload?.message);
    }

    // 3) Inspect the agent's prompt object (where the LLM config lives).
    const getRes = await fetch(`${BASE}/${AGENT_ID}`, { headers: authHeaders() });
    let agentOk = getRes.ok;
    let promptSummary = null;
    let agentKeys = null;
    if (agentOk) {
      const agent = await getRes.json();
      const prompt = agent.conversation_config && agent.conversation_config.agent && agent.conversation_config.agent.prompt;
      agentKeys = Object.keys(agent.conversation_config.agent);
      if (prompt) {
        const promptKeys = Object.keys(prompt);
        const llmFields = {};
        for (const k of promptKeys) {
          if (k !== 'prompt' && /llm|custom|provider|server|model|api|url|endpoint|secret|temperature|knowledge/i.test(k)) {
            const v = prompt[k];
            llmFields[k] = Array.isArray(v) ? `[${v.length}]` : (typeof v === 'string' ? v.slice(0, 200) : v);
          }
        }
        promptSummary = { promptKeys, llm: prompt.llm, llmFields, custom_llm: prompt.custom_llm };
      }
    } else {
      promptSummary = { error: String(getRes.status) };
    }

    let patchResult = null;
    let verify = null;
    if (payload && payload.revert) {
      const r = await fetch(`${BASE}/${AGENT_ID}`, {
        method: 'PATCH', headers: authHeaders(),
        body: JSON.stringify({ conversation_config: { agent: { prompt: { llm: 'gpt-4o-mini', custom_llm: null } } } }),
      });
      const t = await r.text();
      patchResult = { reverted: r.ok, status: r.status, body: t.slice(0, 600) };
    } else if (doPatch || patchOnly) {
      // ElevenLabs custom_llm.api_key must reference a stored workspace secret
      // (ConvAISecretLocator), not an inline string. The proxy authenticates
      // with `Authorization: Bearer <ELEVENLABS_API_KEY>`, so we store that key
      // as a secret named OPENAI_API_KEY and point the locator at its id.
      const SECRETS = 'https://api.elevenlabs.io/v1/convai/secrets';
      let secretId = null;
      let secretInfo = null;
      const listRes = await fetch(SECRETS, { headers: authHeaders() });
      if (listRes.ok) {
        const list = await listRes.json();
        const arr = Array.isArray(list) ? list : (list && list.secrets) || [];
        const found = arr.find((s) => s && s.name === 'OPENAI_API_KEY');
        if (found) { secretId = found.secret_id; secretInfo = { reused: true, name: found.name }; }
      } else {
        secretInfo = { listError: listRes.status };
      }
      if (!secretId) {
        const cRes = await fetch(SECRETS, {
          method: 'POST', headers: authHeaders(),
          body: JSON.stringify({ type: 'new', name: 'OPENAI_API_KEY', value: key }),
        });
        const cTxt = await cRes.text();
        if (cRes.ok) {
          const cj = JSON.parse(cTxt);
          secretId = cj.secret_id;
          secretInfo = { created: true, name: cj.name };
        } else {
          secretInfo = { createError: cRes.status, body: cTxt.slice(0, 400) };
        }
      }
      if (!secretId) {
        patchResult = { ok: false, error: 'no_secret_id', secretInfo };
      } else {
        const custom_llm = { url: PROXY_URL, model_id: 'bogest-via-base44', api_key: { secret_id: secretId } };
        const r = await fetch(`${BASE}/${AGENT_ID}`, {
          method: 'PATCH', headers: authHeaders(),
          body: JSON.stringify({ conversation_config: { agent: { prompt: { llm: 'custom-llm', custom_llm } } } }),
        });
        const t = await r.text();
        patchResult = {
          ok: r.ok, status: r.status, body: t.slice(0, 1000),
          secretInfo,
          locator: { url: custom_llm.url, model_id: custom_llm.model_id, api_key: custom_llm.api_key },
        };
        if (r.ok) {
          const g = await fetch(`${BASE}/${AGENT_ID}`, { headers: authHeaders() });
          if (g.ok) {
            const a = await g.json();
            const p = a.conversation_config && a.conversation_config.agent && a.conversation_config.agent.prompt;
            verify = { llm: p && p.llm, custom_llm: p && p.custom_llm };
          }
        }
      }
    }

    return Response.json({
      doPatch,
      proxyUrl: PROXY_URL,
      probe,
      chatTest: chat,
      streamingTest: stream,
      agent: { ok: agentOk, agentKeys, prompt: promptSummary },
      patchResult,
      verify,
    });
  } catch (e) {
    return Response.json({ error: e.message }, { status: 500 });
  }
}