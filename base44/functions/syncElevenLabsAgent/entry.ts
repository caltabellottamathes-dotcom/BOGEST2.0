import { secrets } from 'base44:runtime';

const AGENT_ID = 'agent_6601kyn1xnn8ebm9m9ahk52ghmr5';
const BASE = 'https://api.elevenlabs.io/v1/convai/agents';

// Idempotency marker — the instruction is only appended once.
const MARKER = 'BOGEST_WEBSITE_NAVIGATION_INSTRUCTION';

const INSTRUCTION = `
[${MARKER}]
WEBSITE NAVIGATION (PROACTIVE — MANDATORY, SMOOTH):
You are embedded inside the Bogèst restaurant website as a voice assistant. You have a client tool named "websiteAction" with parameters { action: string, target: string }.
Use it to drive the visitor's screen IN REAL TIME, in sync with your speech. Do NOT wait for the visitor to ask, and do NOT pause or go silent to "think" before or after calling it — keep talking naturally the whole time. The tool runs instantly in the background; your voice must never stop because of it. Speak the sentence about the topic, call the tool mid-sentence, and keep talking.

When to call it:
Whenever you mention, recommend, describe or bring up any page, dish, location or feature, call "websiteAction" exactly once for that topic, right as you start talking about it, and keep speaking while the page changes.

Actions:
- action "navigate"  → open a page.
- action "scroll"    → smooth-scroll to a section on the current page (e.g. a location's spaces, reviews, opening hours, terrace).
- action "highlight" → open the menu AND visually point out (highlight + scroll to) one specific dish.

Valid targets:
- Pages: "home", "menu", "about", "locations", "reserve", "takeaway", "gift-cards", "contact", "groups", "jobs", "instagram".
- Specific locations: "hasselt", "borgloon", "heusden-zolder".
- Dishes (use action "highlight"): "ribeye", "cote-a-l-os", "chateaubriand", "filet-pur", "spare-ribs", "entremisu", "stoofvlees", "boulet", "godina".

Rules:
- Call the tool ONCE per topic you introduce; do not repeat for the same topic.
- To point out a specific dish while you describe it, use { action: "highlight", target: "<dish>" } — the page scrolls to it and highlights it as you talk.
- To scroll to a part of the current page (e.g. "let me show you the terrace"), use { action: "scroll", target: "<section>" }.
- For general menu talk, use { action: "navigate", target: "menu" }. For a specific location, navigate to that location's target.
- Never output raw URLs or page paths in speech — the tool handles navigation.
- If the visitor just asks a factual question with no navigation need, do not call the tool.
[${MARKER}_END]`;

function authHeaders() {
  const key = secrets.get('ELEVENLABS_API_KEY');
  if (!key) throw new Error('ELEVENLABS_API_KEY not set');
  return { 'xi-api-key': key, 'Content-Type': 'application/json' };
}

export default async function(req) {
  try {
    const getRes = await fetch(`${BASE}/${AGENT_ID}`, { headers: authHeaders() });
    if (!getRes.ok) {
      const txt = await getRes.text();
      return Response.json({ error: 'get_failed', status: getRes.status, detail: txt }, { status: 502 });
    }
    const agent = await getRes.json();

    const payload = await req.json().catch(() => ({}));
    if (payload && payload.dry) {
      // Recursively find any `tools` / `tool_ids` keys so we know what to strip.
      const found = [];
      const walk = (obj, path) => {
        if (!obj || typeof obj !== 'object') return;
        for (const k of Object.keys(obj)) {
          if (k === 'tools' || k === 'tool_ids') {
            found.push({ path: path.concat(k).join('.'), type: Array.isArray(obj[k]) ? 'array' : typeof obj[k], len: Array.isArray(obj[k]) ? obj[k].length : null });
          }
          if (obj[k] && typeof obj[k] === 'object') walk(obj[k], path.concat(k));
        }
      };
      walk(agent, []);
      const p = agent.conversation_config?.agent?.prompt || {};
      const wFull = Array.isArray(p.tools) ? p.tools.find((t) => t && t.name === 'websiteAction') : null;
      let singleTool = null;
      try {
        const sRes = await fetch('https://api.elevenlabs.io/v1/convai/tools/tool_1201kypr5xmeej7anvcbdyyzgy73', { headers: authHeaders() });
        if (sRes.ok) {
          const s = await sRes.json();
          const cfg = s.tool_config || s;
          singleTool = { id: s.id, name: cfg.name, force_pre_tool_speech: cfg.force_pre_tool_speech, pre_tool_speech: cfg.pre_tool_speech, tool_call_sound: cfg.tool_call_sound, tool_call_sound_behavior: cfg.tool_call_sound_behavior, topKeys: Object.keys(s) };
        } else { singleTool = { status: sRes.status, body: await sRes.text() }; }
      } catch (e) { singleTool = { error: String(e) }; }
      return Response.json({
        websiteActionKeys: wFull ? Object.keys(wFull) : null,
        websiteActionId: wFull?.id || null,
        singleTool,
        hasInstruction: typeof p.prompt === 'string' && p.prompt.includes('BOGEST_WEBSITE_NAVIGATION_INSTRUCTION'),
      });
    }

    // System prompt lives at conversation_config.agent.prompt.prompt (string).
    const promptObj = agent?.conversation_config?.agent?.prompt;
    let current = typeof promptObj?.prompt === 'string' ? promptObj.prompt : '';

    // Strip any previously-applied instruction block so an updated INSTRUCTION
    // re-applies cleanly (idempotent refresh, not append-on-append).
    const blockRe = new RegExp(
      '\\n*\\[' + MARKER + '\\][\\s\\S]*?\\[' + MARKER + '_END\\]\\n*',
      'g'
    );
    current = current.replace(blockRe, '').trim();

    const promptChanged = !current.includes(MARKER);
    const next = current + (current ? '\n\n' : '') + INSTRUCTION.trim();

    // 1) Prompt: minimal merge PATCH — only send the prompt string so the
    //    platform preserves tools / tool_ids / llm / temperature / etc. This
    //    also avoids the "cannot specify both tools and tool_ids" conflict.
    let promptPatched = false;
    if (promptChanged) {
      const pRes = await fetch(`${BASE}/${AGENT_ID}`, {
        method: 'PATCH',
        headers: authHeaders(),
        body: JSON.stringify({ conversation_config: { agent: { prompt: { prompt: next } } } }),
      });
      promptPatched = pRes.ok;
      if (!pRes.ok) {
        const txt = await pRes.text();
        return Response.json({ error: 'prompt_patch_failed', status: pRes.status, detail: txt }, { status: 502 });
      }
    }

    // 2) Tool config: websiteAction is a SAVED library tool (referenced by
    //    tool_ids), so inline edits on the agent don't persist. Find its id via
    //    the tools endpoint, then PATCH the tool directly to make it speak
    //    BEFORE it runs — so the agent keeps talking while the page
    //    navigates/scrolls/highlights (no dead-air "thinking" pause).
    let toolPatched = false;
    let toolId = null;
    try {
      const tlRes = await fetch('https://api.elevenlabs.io/v1/convai/tools', { headers: authHeaders() });
      if (tlRes.ok) {
        const tl = await tlRes.json();
        const items = Array.isArray(tl) ? tl : (tl.tools || []);
        const wTool = items.find((t) => t?.tool_config?.name === 'websiteAction' || t?.name === 'websiteAction');
        toolId = wTool?.id || null;
        if (toolId) {
          // Fetch the full stored tool, mutate only the speech fields, save it.
          const tGetRes = await fetch(`https://api.elevenlabs.io/v1/convai/tools/${toolId}`, { headers: authHeaders() });
          if (tGetRes.ok) {
            const tFull = await tGetRes.json();
            const cfg = tFull.tool_config || tFull;
            const updatedCfg = { ...cfg, force_pre_tool_speech: true, pre_tool_speech: 'auto', disable_interruptions: false, interruption_mode: 'allow' };
            const tPatchRes = await fetch(`https://api.elevenlabs.io/v1/convai/tools/${toolId}`, {
              method: 'PATCH',
              headers: authHeaders(),
              body: JSON.stringify({ tool_config: updatedCfg }),
            });
            toolPatched = tPatchRes.ok;
            if (!tPatchRes.ok) {
              const txt = await tPatchRes.text();
              return Response.json({ error: 'tool_patch_failed', status: tPatchRes.status, detail: txt, toolId }, { status: 502 });
            }
          }
        }
      }
    } catch (e) {
      return Response.json({ error: 'tool_sync_error', detail: String(e) }, { status: 502 });
    }

    return Response.json({ ok: true, changed: promptChanged || toolPatched, promptPatched, toolPatched, toolId, promptLength: next.length });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}