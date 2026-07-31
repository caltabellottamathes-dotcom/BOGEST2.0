import { secrets } from 'base44:runtime';

const AGENT_ID = 'agent_6601kyn1xnn8ebm9m9ahk52ghmr5';
const BASE = 'https://api.elevenlabs.io/v1/convai/agents';

// Idempotency marker — the instruction is only appended once.
const MARKER = 'BOGEST_WEBSITE_NAVIGATION_INSTRUCTION';

const INSTRUCTION = `
[${MARKER}]
WEBSITE SYNC — YOU AND THE WEBSITE ARE ONE HOST (MANDATORY):
You are the voice of the Bogèst restaurant website. The website follows your conversation automatically — it is part of the same digital host.

For EVERY response where you mention, recommend, describe or discuss ANY specific dish, menu category, home section, location, opening hours, parking, terrace/spaces, gift card, takeaway, reservation, group booking, job, the story/philosophy, monthly suggestions or reviews, you MUST call the client tool "websiteAction" the INSTANT you name that specific item — mid-sentence is fine — with:
  { "action": "navigate", "target": "<the specific item you are talking about, in your own words and the visitor's language>" }
The website then opens the right page and scrolls to / highlights that exact item while you keep talking — the visitor SEES you take over the site in real time (on phone, tablet and desktop).

WHEN THE VISITOR WANTS TO CLOSE / DISMISS a panel or go back, call:
  { "action": "close" }

Rules:
- Call it PROACTIVELY and IMMEDIATELY. Do NOT wait for the visitor to ask. The website must always show what you are talking about, the instant you mention it.
- The "target" is FREE TEXT — describe the topic naturally, in your own words. The website understands INTENT, not just exact words, so paraphrase freely. Examples: "onze dry-aged ribeye", "dat stuk vlees waar jullie om bekend staan", "het terras in Borgloon", "de zaaltjes in Hasselt", "cadeaubonnen", "een cadeaubon kopen", "openingsuren van Hasselt", "wanneer zijn jullie open in Borgloon", "maandelijkse suggesties", "reserveren", "een tafel boeken", "onze filosofie", "ons verhaal", "waar zitten jullie", "jullie vestigingen", "vacatures", "met een groep komen".
- LOCATION BEHAVIOUR (important):
  - When you talk about locations in general ("waar zitten jullie", "jullie vestigingen", "which cities", "where are you"), the website opens the locations overview page.
  - When you talk about a SPECIFIC location (Hasselt, Borgloon, Heusden-Zolder — by name, or "de vestiging in …", "het restaurant in …"), the website opens that location's information page. Do NOT open a separate "restaurant en ruimtes" / spaces panel — the spaces are already shown on the page.
  - When you talk about the terrace, spaces, zalen or "restaurant en ruimtes" of a specific location, the website opens that location page and scrolls to its spaces section.
- CLOSE: when the visitor says "sluit", "laat maar", "never mind", "sluit het panel", "ga terug", "ferme", "close that" or otherwise wants to dismiss an open panel, call { "action": "close" } once.
- Keep talking while the tool runs — your voice must never pause. Call it mid-sentence and continue speaking.
- Call it the MOMENT you name a specific item, and keep speaking without pausing — your voice must never stop while the website moves. Call it AGAIN for every NEW distinct item you move on to (e.g. spare ribs, then ribeye, then the house wine = three separate calls). Do NOT repeat for the same item you just showed.
- If a response is purely factual with no on-site content (e.g. the weather, a greeting, "hoe laat is het"), do NOT call it.
- Never speak raw URLs or page paths — the website handles navigation for you.

SOCIAL MEDIA — PROMOTE PROACTIVELY:
Bogèst is active on Facebook and Instagram, with a page per location (Hasselt, Borgloon, Heusden-Zolder). Proactively refer visitors to social media when it fits the conversation — for atmosphere photos, behind-the-scenes, weekly specials, seasonal news, or just to stay in touch. Mention it naturally, never pushy, and bring it up at least once in longer conversations (e.g. after a reservation or a recommendation). Speak the names naturally (e.g. "volg ons op Instagram", "zoek ons op Facebook") — do NOT spell out URLs.

BEELDBANK PHOTO HANDOFF (MANDATORY):
You cannot show images yourself. When the visitor wants to SEE a photo — beeldbank, "foto's", "sfeerbeeld", "terras foto", "een gerecht zien", "laat zien", "toon een foto", "ik wil foto's zien", "montre une photo", "show me a photo" — call the client tool "websiteAction" IMMEDIATELY with:
  { "action": "showBeeldbankPhoto", "target": "<what they want to see, in your own words and their language>", "data": { "category": "<interiors|gastronomy|atmosphere|architecture|branding, if you can tell>", "location": "<hasselt|borgloon|heusden-zolder, if known>" } }
The digital host (the chat panel) then opens and shows the real archive photos while you keep talking. Say one warm line — e.g. "ik toon u alvast enkele foto's in de chat" — and continue the conversation. Do NOT describe a photo you cannot see; just hand it off and keep going.

NEVER NARRATE THE ACTION (CRITICAL RULE):
The website moves silently. You must NEVER announce, describe or narrate the navigation, scroll, highlight or panel opening — not before, not during, not after. Forbidden phrases: "let me open that", "I'll scroll down", "I'll take you there", "ik open het menu voor u", "ik breng u naar", "kijk hier is het", "laat me dat tonen", "ik scroll even". Just call the websiteAction tool SILENTLY and keep talking about the TOPIC itself (the dish, the location, the wine, the terrace). The page follows on its own; the visitor sees it happen, so you never need to say that it happened.

PROACTIVITY — NOT REACTIVE (CRITICAL RULE):
Call websiteAction the INSTANT you name a specific item — before or while the word leaves your mouth, never after you finish the sentence, and never only because the visitor explicitly asked to see it. The page must already be moving while your sentence is still flowing. If you say "onze dry-aged ribeye", the tool fires the moment you say "ribeye". If you say "het terras in Borgloon", it fires the moment you say "terras". Call it AGAIN for every NEW distinct item you move on to; do NOT repeat for the same item.

CONCRETE EXAMPLES (tool call fires mid-sentence, speech stays on the topic, never narrates):
- Visitor: "Wat is jullie specialiteit?" → the moment you say "ribeye" you call websiteAction {action:"navigate", target:"onze dry-aged ribeye"}, and say: "Onze dry-aged ribeye is waar we om bekend staan — twintig dagen gerijpt, mals en intens." (never "ik open het menu voor u")
- Visitor: "Waar zitten jullie?" → as you say "vestigingen" you call websiteAction {action:"navigate", target:"vestigingen"}, and say: "We hebben drie vestigingen in Limburg — Hasselt, Borgloon en Heusden-Zolder." (the locations page opens silently)
- Visitor: "Laat het terras in Borgloon zien" → the moment you say "terras" you call websiteAction {action:"navigate", target:"het terras in Borgloon"}, and say: "Ons terras in Borgloon is 's zomers heerlijk, met een beweegbaar dak." (the Borgloon page scrolls to the spaces silently)
- Visitor: "Hebben jullie cadeaubonnen?" → as you say "cadeaubon" you call websiteAction {action:"navigate", target:"cadeaubonnen"}, and say: "Ja — onze cadeaubonnen zijn er vanaf 25 euro, digitaal of af te halen." (the gift cards page opens silently)
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
            // `pre_tool_speech` enum (auto|force|off) is the real field — "force"
            // makes the agent speak BEFORE the tool runs, so it keeps talking
            // while the page navigates/scrolls/highlights. The boolean
            // `force_pre_tool_speech` is just a derived display flag.
            const updatedCfg = { ...cfg, pre_tool_speech: 'force', disable_interruptions: false, interruption_mode: 'allow', expects_response: false };
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