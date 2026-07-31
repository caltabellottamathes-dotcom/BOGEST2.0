import { createClientFromRequest } from 'npm:@base44/sdk@0.8.41';
import { secrets } from 'base44:runtime';

// OpenAI-compatible Chat Completions endpoint that runs the model through
// Base44's own LLM integration (InvokeLLM) instead of ElevenLabs' LLM billing.
//
// ElevenLabs Conversational AI "Custom LLM" posts here with the standard
// { model, messages, tools, tool_choice, stream } shape. We translate the
// conversation + tool list into a single InvokeLLM prompt, ask the model to
// return structured JSON (a spoken reply and/or tool calls), and re-package
// the result back into OpenAI's exact chat-completion / streaming-chunk format
// so ElevenLabs can drive the website navigation tools exactly as before.
//
// Auth: the request must carry Authorization: Bearer <ELEVENLABS_API_KEY>.
// We reuse the stored ElevenLabs key as the shared secret so the same value
// is set as the Custom LLM "API key" on the agent — no extra secret to manage.

const LLM_MODEL = 'claude_sonnet_4_6'; // strong, reliable structured/tool output

function unauthorized() {
  return new Response(JSON.stringify({ error: 'unauthorized' }), {
    status: 401,
    headers: { 'Content-Type': 'application/json' },
  });
}

function rid(prefix) {
  return prefix + Math.random().toString(36).slice(2, 12);
}

// Serialize the OpenAI messages + tools into one prompt for InvokeLLM (which
// only accepts a single prompt string, no native function-calling).
function buildPrompt(messages, tools) {
  const parts = [];

  if (Array.isArray(tools) && tools.length) {
    parts.push('You are an assistant that can call tools. You have these tools available:');
    tools.forEach((t, i) => {
      const fn = t.function || t;
      let line = `${i + 1}. ${fn.name}`;
      if (fn.description) line += ` — ${fn.description}`;
      parts.push(line);
      if (fn.parameters) parts.push('   parameters: ' + JSON.stringify(fn.parameters));
    });
    parts.push('');
    parts.push('HOW TO CALL A TOOL: put an entry in the "tool_calls" array as { "name": "<tool name>", "arguments": "<a JSON-encoded string of the arguments object>" }. You may include a short spoken "content" reply AT THE SAME TIME as a tool call. Call a tool the instant the reply involves the relevant item, and keep the spoken content focused on the topic (never narrate that you are calling a tool).');
    parts.push('');
  }

  parts.push('CONVERSATION (reply as the assistant to the most recent user message):');
  for (const m of messages || []) {
    const role = m.role;
    if (role === 'tool') {
      parts.push(`[tool result${m.tool_call_id ? ' ' + m.tool_call_id : ''}]: ${typeof m.content === 'string' ? m.content : JSON.stringify(m.content)}`);
    } else if (role === 'assistant' && Array.isArray(m.tool_calls) && m.tool_calls.length) {
      parts.push(`assistant (tool calls): ${JSON.stringify(m.tool_calls)}${m.content ? ' spoken: ' + m.content : ''}`);
    } else {
      const label = role === 'user' ? 'user' : role === 'system' ? 'system' : 'assistant';
      parts.push(`${label}: ${typeof m.content === 'string' ? m.content : JSON.stringify(m.content)}`);
    }
  }

  parts.push('');
  parts.push('Respond now as the assistant. Output ONLY a JSON object with:');
  parts.push('  "content": string — your spoken reply (short, natural, in the visitor\'s language). Empty string if you are only calling a tool.');
  parts.push('  "tool_calls": array (optional) of { "name": string, "arguments": string (JSON-encoded arguments) }. Omit or leave empty if no tool is needed.');
  parts.push('Never put raw tool-call JSON inside "content". Keep "content" as the actual spoken words only.');
  return parts.join('\n');
}

function normalizeLLM(llm) {
  let obj = llm;
  if (typeof llm === 'string') {
    try { obj = JSON.parse(llm); } catch { return { content: llm, tool_calls: [] }; }
  }
  if (!obj || typeof obj !== 'object') return { content: '', tool_calls: [] };
  // InvokeLLM wraps structured output in { response: { ... } }
  if (obj.response && typeof obj.response === 'object' && !Array.isArray(obj.response)) obj = obj.response;

  let content = typeof obj.content === 'string' ? obj.content
    : (obj.content === undefined || obj.content === null) ? ''
    : JSON.stringify(obj.content);

  const raw = Array.isArray(obj.tool_calls) ? obj.tool_calls
    : (obj.tool_call ? [obj.tool_call] : []);
  const tool_calls = [];
  raw.forEach((tc) => {
    if (!tc || typeof tc !== 'object') return;
    const name = tc.name || (tc.function && tc.function.name);
    if (!name) return;
    let args = tc.arguments ?? (tc.function && tc.function.arguments) ?? {};
    if (typeof args === 'object') { try { args = JSON.stringify(args); } catch { args = '{}'; } }
    if (typeof args !== 'string') args = '{}';
    tool_calls.push({
      id: rid('call_'),
      type: 'function',
      function: { name, arguments: args },
    });
  });
  return { content, tool_calls };
}

function chunkText(text, size) {
  const out = [];
  for (let i = 0; i < text.length; i += size) out.push(text.slice(i, i + size));
  return out.length ? out : [''];
}

function sseChunk(enc, payload) {
  return enc.encode('data: ' + JSON.stringify(payload) + '\n\n');
}

function streamResponse(id, created, content, tool_calls, llmMs, model) {
  const enc = new TextEncoder();
  const modelLabel = model || 'bogest-via-base44';
  const frames = [];
  frames.push({ id, object: 'chat.completion.chunk', created, model: modelLabel, choices: [{ index: 0, delta: { role: 'assistant' }, finish_reason: null }] });
  for (const piece of chunkText(content || '', 8)) {
    frames.push({ id, object: 'chat.completion.chunk', created, model: modelLabel, choices: [{ index: 0, delta: { content: piece }, finish_reason: null }] });
  }
  tool_calls.forEach((tc, i) => {
    frames.push({
      id, object: 'chat.completion.chunk', created, model: modelLabel,
      choices: [{ index: 0, delta: { tool_calls: [{ index: i, id: tc.id, type: 'function', function: { name: tc.function.name, arguments: tc.function.arguments } }] }, finish_reason: null }],
    });
  });
  const finish_reason = tool_calls.length ? 'tool_calls' : 'stop';
  frames.push({ id, object: 'chat.completion.chunk', created, model: modelLabel, choices: [{ index: 0, delta: {}, finish_reason }] });

  const stream = new ReadableStream({
    start(controller) {
      for (const f of frames) controller.enqueue(sseChunk(enc, f));
      controller.enqueue(enc.encode('data: [DONE]\n\n'));
      controller.close();
    },
  });
  return new Response(stream, {
    status: 200,
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
      'X-Bogest-LLM-Ms': String(llmMs),
    },
  });
}

function jsonResponse(id, created, content, tool_calls, llmMs, model, raw) {
  const message = { role: 'assistant', content: content || null };
  if (tool_calls.length) message.tool_calls = tool_calls;
  const finish_reason = tool_calls.length ? 'tool_calls' : 'stop';
  const out = {
    id,
    object: 'chat.completion',
    created,
    model: model || 'bogest-via-base44',
    choices: [{ index: 0, message, finish_reason }],
    usage: { prompt_tokens: 0, completion_tokens: 0, total_tokens: 0 },
    _llm_ms: llmMs,
  };
  if (raw !== undefined) {
    out._raw = typeof raw === 'string' ? raw.slice(0, 1200) : JSON.stringify(raw).slice(0, 1200);
  }
  return Response.json(out);
}

export default async function(req) {
  try {
    const key = secrets.get('ELEVENLABS_API_KEY');
    if (!key) return Response.json({ error: 'server_misconfigured_no_key' }, { status: 500 });

    const body = await req.json().catch(() => ({}));

    // Health / self-discovery probe (cheap, no LLM call, no auth).
    if (body && body.ping) {
      return Response.json({ pong: true });
    }

    const auth = req.headers.get('authorization') || '';
    const bearer = auth.replace(/^Bearer\s+/i, '').trim();
    if (!bearer || bearer !== key) return unauthorized();

    const { messages = [], tools = [], stream = true, model } = body;
    const prompt = buildPrompt(messages, tools);

    const base44 = createClientFromRequest(req);
    const schema = {
      type: 'object',
      properties: {
        content: { type: 'string', description: 'Spoken reply to the visitor. Empty string if only calling a tool.' },
        tool_calls: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              name: { type: 'string' },
              arguments: { type: 'string', description: 'JSON-encoded arguments object.' },
            },
            required: ['name', 'arguments'],
          },
          description: 'Tool calls to execute. Omit or empty if no tool is needed.',
        },
      },
      required: ['content'],
    };

    const t0 = Date.now();
    const llm = await base44.asServiceRole.integrations.Core.InvokeLLM({
      prompt,
      response_json_schema: schema,
      model: LLM_MODEL,
    });
    const llmMs = Date.now() - t0;

    const { content, tool_calls } = normalizeLLM(llm);
    const id = rid('chatcmpl-');
    const created = Math.floor(Date.now() / 1000);

    if (stream) return streamResponse(id, created, content, tool_calls, llmMs, model);
    return jsonResponse(id, created, content, tool_calls, llmMs, model, body.debug ? llm : undefined);
  } catch (e) {
    return Response.json({ error: e.message }, { status: 500 });
  }
}