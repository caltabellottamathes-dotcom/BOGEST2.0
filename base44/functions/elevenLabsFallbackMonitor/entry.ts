import { createClientFromRequest } from 'npm:@base44/sdk@0.8.40';
import { secrets } from 'base44:runtime';

const AGENT_ID = 'agent_6601kyn1xnn8ebm9m9ahk52ghmr5';
const ELEVEN_BASE = 'https://api.elevenlabs.io/v1/convai/agents';
const SUB_URL = 'https://api.elevenlabs.io/v1/user/subscription';

// ElevenLabs requires prompt.llm == "CUSTOM_LLM" to activate the custom_llm
// object (discovered from the live agent's validation response).
const CUSTOM_LLM_MODEL = 'custom-llm';
const NATIVE_LLM_FALLBACK = 'gemini-2.5-flash';

function authHeaders() {
  const key = secrets.get('ELEVENLABS_API_KEY');
  if (!key) throw new Error('ELEVENLABS_API_KEY not set');
  return { 'xi-api-key': key, 'Content-Type': 'application/json' };
}

function proxyUrl() {
  const appId = Deno.env.get('BASE44_APP_ID') || '';
  return `https://base44.app/api/apps/${appId}/functions/elevenLabsLlmProxy`;
}

async function getSubscription() {
  const res = await fetch(SUB_URL, { headers: authHeaders() });
  if (!res.ok) return { ok: false, status: res.status, detail: await res.text().catch(() => '') };
  const sub = await res.json();
  const used = Number(sub.character_count || 0);
  const limit = Number(sub.character_limit || 0);
  return {
    ok: true,
    tier: sub.tier,
    character_count: used,
    character_limit: limit,
    remaining: Math.max(0, limit - used),
    next_reset: sub.next_character_count_reset_unix || null,
  };
}

async function getPrompt() {
  const res = await fetch(`${ELEVEN_BASE}/${AGENT_ID}`, { headers: authHeaders() });
  if (!res.ok) return { ok: false, status: res.status, detail: await res.text().catch(() => '') };
  const agent = await res.json();
  return { ok: true, prompt: agent?.conversation_config?.agent?.prompt || null, agent };
}

async function patchAgent(body) {
  const res = await fetch(`${ELEVEN_BASE}/${AGENT_ID}`, {
    method: 'PATCH',
    headers: authHeaders(),
    body: JSON.stringify(body),
  });
  return {
    ok: res.ok,
    status: res.status,
    body: res.ok ? await res.json().catch(() => ({})) : await res.text().catch(() => ''),
  };
}

export default async function(req) {
  try {
    const base44 = createClientFromRequest(req);
    const payload = await req.json().catch(() => ({}));

    const subscription = await getSubscription();
    const promptRes = await getPrompt();
    const prompt = promptRes.ok ? promptRes.prompt : null;

    // ── Read persistent state ──
    let stateItems = [];
    try {
      stateItems = await base44.asServiceRole.entities.VoiceAgentState.filter({ agent_id: AGENT_ID });
    } catch { /* entity may not exist yet */ }
    let state = Array.isArray(stateItems) && stateItems[0] ? stateItems[0] : null;

    // ── Inspect mode: return everything about the live agent + state ──
    if (payload.inspect) {
      const keys = prompt ? Object.keys(prompt) : [];
      return Response.json({
        subscription,
        prompt_keys: keys,
        llm: prompt?.llm || null,
        temperature: prompt?.temperature ?? null,
        has_tools: Array.isArray(prompt?.tools),
        tool_ids: prompt?.tool_ids || null,
        has_custom_url_field: keys.some((k) => /custom|url/i.test(k)),
        custom_llm: prompt?.custom_llm ? JSON.parse(JSON.stringify(prompt.custom_llm)) : null,
        backup_llm_config: prompt?.backup_llm_config ? JSON.parse(JSON.stringify(prompt.backup_llm_config)) : null,
        cascade_timeout_seconds: prompt?.cascade_timeout_seconds ?? null,
        state,
        proxyUrl: proxyUrl(),
        agent_id: AGENT_ID,
      });
    }

    // ── Probe mode: learn the accepted custom_llm object shape without
    //    touching `llm` (agent stays on native). The API's 422/200 response
    //    reveals the expected fields. ──
    if (payload.probe) {
      const guess = payload.guess || { url: proxyUrl(), model: 'automatic' };
      const r = await patchAgent({ conversation_config: { agent: { prompt: { llm: CUSTOM_LLM_MODEL, custom_llm: guess } } } });
      return Response.json({ guess, result: r });
    }

    if (!subscription.ok || !promptRes.ok) {
      return Response.json({ error: 'upstream_read_failed', subscription, promptRes }, { status: 502 });
    }

    // ── Derive current mode + native snapshot ──
    const currentLlm = prompt?.llm;
    const isCustom = currentLlm && /custom/i.test(String(currentLlm));
    let mode = state?.mode || (isCustom ? 'base44_fallback' : 'elevenlabs_native');
    let nativeSnapshot = state?.native_llm || (!isCustom && currentLlm ? currentLlm : null);

    // ── Thresholds (buffer so we switch BEFORE hitting zero) ──
    const limit = subscription.character_limit || 0;
    const LOW = Math.max(50000, Math.floor(limit * 0.08));
    const RESTORE = Math.max(150000, Math.floor(limit * 0.15));

    // ── Effective remaining (simulate overrides for testing) ──
    let remaining = subscription.remaining;
    if (payload.simulate === 'low') remaining = 0;
    if (payload.simulate === 'high') remaining = limit;

    const shouldRun = payload.run === true || payload.simulate === 'low' || payload.simulate === 'high';
    if (!shouldRun) {
      return Response.json({ mode, remaining, low: LOW, restore: RESTORE, note: 'call with {run:true} to execute, {inspect:true} to inspect, {simulate:"low"|"high"} to test' });
    }

    let action = 'none';
    let patchResult = null;
    let newMode = mode;
    let direction = null;

    if (mode === 'elevenlabs_native' && remaining < LOW) {
      // ── Switch to Base44 fallback ──
      const fallbackBody = {
        conversation_config: {
          agent: {
            prompt: { llm: CUSTOM_LLM_MODEL, custom_llm: { url: proxyUrl(), model: 'automatic' } },
          },
        },
      };
      patchResult = await patchAgent(fallbackBody);
      if (patchResult.ok) {
        if (!nativeSnapshot && currentLlm) nativeSnapshot = currentLlm;
        action = 'switched_to_fallback';
        newMode = 'base44_fallback';
        direction = 'to_fallback';
      }
    } else if (mode === 'base44_fallback' && remaining >= RESTORE) {
      // ── Switch back to native ──
      const restoreModel = nativeSnapshot || NATIVE_LLM_FALLBACK;
      const restoreBody = { conversation_config: { agent: { prompt: { llm: restoreModel, custom_llm: null } } } };
      patchResult = await patchAgent(restoreBody);
      if (patchResult.ok) {
        action = 'switched_to_native';
        newMode = 'elevenlabs_native';
        direction = 'to_native';
      }
    }

    // ── Persist state ──
    const now = new Date().toISOString();
    try {
      if (!state) {
        state = await base44.asServiceRole.entities.VoiceAgentState.create({
          agent_id: AGENT_ID,
          mode: newMode,
          native_llm: nativeSnapshot || null,
          remaining_credits: remaining,
          character_count: subscription.character_count,
          character_limit: limit,
          last_check: now,
          last_switch: direction ? now : null,
          last_switch_direction: direction,
        });
      } else {
        const update = {
          mode: newMode,
          native_llm: nativeSnapshot || state.native_llm || null,
          remaining_credits: remaining,
          character_count: subscription.character_count,
          character_limit: limit,
          last_check: now,
        };
        if (direction) {
          update.last_switch = now;
          update.last_switch_direction = direction;
        }
        await base44.asServiceRole.entities.VoiceAgentState.update(state.id, update);
      }
    } catch { /* state persistence is best-effort */ }

    // ── Notify + log on a real switch ──
    if (action !== 'none') {
      const logPayload = {
        direction,
        from: mode,
        to: newMode,
        remaining,
        low_threshold: LOW,
        restore_threshold: RESTORE,
        character_count: subscription.character_count,
        character_limit: limit,
        patch_ok: patchResult?.ok,
        patch_status: patchResult?.status,
        timestamp: now,
      };
      try {
        await base44.asServiceRole.entities.EventLog.create({
          event_type: 'voice_agent.mode_switch',
          domain: 'system',
          source: 'automation',
          payload: logPayload,
        });
      } catch { /* best-effort */ }
      try {
        const users = await base44.asServiceRole.entities.User.list();
        const admins = (users || []).filter((u) => u.role === 'admin' && u.email);
        const subject = direction === 'to_fallback'
          ? 'Bogèst stemagent → Base44 fallback (ElevenLabs-credits laag)'
          : 'Bogèst stemagent → ElevenLabs native (credits hersteld)';
        const msg = direction === 'to_fallback'
          ? `De ElevenLabs-credits zijn onder de veiligheidsdrempel gezakt (${remaining}/${limit}). De stemagent is automatisch overgeschakeld naar de Base44 fallback-LLM. Bezoekers merken niets — navigatie en tools blijven werken.`
          : `De ElevenLabs-credits zijn weer ruim beschikbaar (${remaining}/${limit}). De stemagent is automatisch teruggezet naar de ElevenLabs native LLM.`;
        for (const a of admins) {
          try { await base44.asServiceRole.integrations.Core.SendEmail({ to: a.email, subject, body: msg }); } catch { /* best-effort */ }
        }
      } catch { /* best-effort */ }
    }

    return Response.json({
      mode_before: mode,
      mode_after: newMode,
      action,
      direction,
      remaining,
      low_threshold: LOW,
      restore_threshold: RESTORE,
      patch: patchResult,
      simulate: payload.simulate || null,
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}