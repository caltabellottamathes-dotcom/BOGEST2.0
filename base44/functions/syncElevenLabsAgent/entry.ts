import { secrets } from 'base44:runtime';

const AGENT_ID = 'agent_6601kyn1xnn8ebm9m9ahk52ghmr5';
const BASE = 'https://api.elevenlabs.io/v1/convai/agents';

// Idempotency marker — the instruction is only appended once.
const MARKER = 'BOGEST_WEBSITE_NAVIGATION_INSTRUCTION';

const INSTRUCTION = `
[${MARKER}]
WEBSITE NAVIGATION (PROACTIVE — MANDATORY):
You are embedded inside the Bogèst restaurant website as a voice assistant. You have a client tool named "websiteAction" with parameters { action: string, target: string }.
Use it to drive the visitor's screen in real time, IN SYNC with what you say. Do NOT wait for the visitor to ask — whenever you mention, recommend, describe or bring up any page, dish, location or feature below, you MUST call "websiteAction" exactly once for that topic, right as you start talking about it, and keep speaking naturally while the page changes.
Actions:
- action "navigate"  → open a page.
- action "highlight" → open the menu and visually highlight one specific dish.
Valid targets:
- Pages: "home", "menu", "about", "locations", "reserve", "takeaway", "gift-cards", "contact", "groups", "jobs", "instagram".
- Specific locations: "hasselt", "borgloon", "heusden-zolder".
- Dishes (use action "highlight"): "ribeye", "cote-a-l-os", "chateaubriand", "filet-pur", "spare-ribs", "entremisu", "stoofvlees", "boulet", "godina".
Rules:
- Call the tool ONCE per topic you introduce; do not repeat it for the same topic.
- For general menu talk, use { action: "navigate", target: "menu" }. For a specific dish, use { action: "highlight", target: "<dish>" }.
- For a specific location (Hasselt / Borgloon / Heusden-Zolder), navigate to that location's target.
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
      return Response.json({
        toolsLocations: found,
        promptKeys: Object.keys(p),
        tool_ids: p.tool_ids,
        toolNames: Array.isArray(p.tools) ? p.tools.map((t) => t && t.name) : null,
        hasInstruction: typeof p.prompt === 'string' && p.prompt.includes('BOGEST_WEBSITE_NAVIGATION_INSTRUCTION'),
      });
    }

    // System prompt lives at conversation_config.agent.prompt.prompt (string).
    const promptObj = agent?.conversation_config?.agent?.prompt;
    const current = typeof promptObj?.prompt === 'string' ? promptObj.prompt : '';

    if (current.includes(MARKER)) {
      return Response.json({ ok: true, changed: false, message: 'Navigation instruction already present.' });
    }

    const next = current.trimEnd() + (current ? '\n\n' : '') + INSTRUCTION.trim();
    // Only mutate the prompt string; preserve llm/temperature/etc.
    promptObj.prompt = next;

    // The GET response returns both `prompt.tools` (resolved tool objects) and
    // `prompt.tool_ids` (library references). PATCH rejects sending both, so
    // drop the id references — the inline `tools` array already holds the defs.
    delete promptObj.tool_ids;

    const patchRes = await fetch(`${BASE}/${AGENT_ID}`, {
      method: 'PATCH',
      headers: authHeaders(),
      body: JSON.stringify({ conversation_config: agent.conversation_config }),
    });
    if (!patchRes.ok) {
      const txt = await patchRes.text();
      return Response.json({ error: 'patch_failed', status: patchRes.status, detail: txt }, { status: 502 });
    }

    return Response.json({ ok: true, changed: true, promptLength: next.length });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}