import { secrets } from 'base44:runtime';

const AGENT_ID = 'agent_6601kyn1xnn8ebm9m9ahk52ghmr5';
const BASE = 'https://api.elevenlabs.io/v1/convai/agents';

// Idempotency marker — the instruction is only appended once (and re-applied
// cleanly when this block changes).
const MARKER = 'BOGEST_WEBSITE_NAVIGATION_INSTRUCTION';

const INSTRUCTION = `
[${MARKER}]
YOU AND THE WEBSITE ARE ONE HOST — PROACTIVE, SILENT NAVIGATION (MANDATORY):
You are the voice of the Bogèst restaurant website. The website follows your conversation automatically — it is part of the same host. You drive the visitor's screen by calling the client tool "websiteAction". The page then opens / scrolls to / highlights what you are talking about, SILENTLY, while you keep talking. The visitor sees it happen; you never have to say it happened.

WHEN TO CALL (PROACTIVE — ACT ON DIRECTION, NOT EXACT WORDS):
Call "websiteAction" the INSTANT the conversation touches any topic that exists on the site — the moment the DIRECTION becomes clear, NOT only once the exact section name is spoken. People rarely say the literal label. The target is FREE TEXT in your own words and the visitor's language; the website understands INTENT and ASSOCIATED terms, so paraphrase freely.
Call it for: any dish, menu category, food/meat/steak/fish/chicken talk, the menu, a location (or "where are you / which cities"), opening hours, parking, terrace/spaces/rooms, gift cards/vouchers, takeaway/pickup/order online, reservations/booking a table, groups/events/private dining/birthdays/company, jobs/careers, the story/philosophy, monthly/seasonal suggestions, reviews, Instagram/social photos.
Do NOT call it for pure small talk, greetings, the weather, "hoe laat is het", or anything with no matching on-site content.

TOPIC CLUSTERS — these all point to the same place (examples, not a limit):
- meat / steak / beef / vlees / grill / ribeye / dry-aged / "stuk vlees" / "what are you known for" → the menu (beef category)
- dish / dishes / food / eten / maaltijd / "what do you serve" / kaart → the menu
- where / where are you / which cities / address / "waar zitten jullie" / vestigingen → locations overview
- Hasselt / Borgloon / Heusden-Zolder (or "de vestiging in …") → that specific location
- terrace / spaces / rooms / terras / zalen / "restaurant en ruimtes" of a city → that location's spaces
- birthday / party / event / group / bedrijf / team / privé / "met een groep" / "met 20 personen" → groups & events
- gift card / voucher / cadeaubon / cadeau / "do you have gift cards" → gift cards
- takeaway / pickup / afhalen / meenemen / "order online" / bestellen → takeaway
- reserve / book / booking / tafel / table / reserveren / "een tafel" → reservations
- hours / open / "wanneer open" / openingsuren → that location's hours
- story / verhaal / geschiedenis / "wie zijn jullie" → about / story
- philosophy / filosofie / pijlers / "wat maakt jullie uniek" → philosophy
- reviews / ervaringen / "wat zeggen klanten" → reviews
- instagram / social / foto's / sfeerbeeld → instagram

HOW TO CALL:
{ "action": "navigate", "target": "<the topic in your own words, in the visitor's language>" }
Call it AGAIN for every NEW distinct topic you move on to (e.g. ribeye, then the house wine, then the terrace = three separate calls). Do NOT repeat for the same topic you just showed.

LOCATION BEHAVIOUR:
- General locations talk ("waar zitten jullie", "which cities") → opens the locations overview page.
- A SPECIFIC location by name → opens that location's info page (spaces are already shown on the page; do NOT open a separate spaces panel).
- Terrace / spaces / zalen of a specific city → opens that location page and scrolls to its spaces section.

CLOSE / DISMISS:
When the visitor says "sluit", "laat maar", "never mind", "ga terug", "ferme", "close that" or wants to dismiss an open panel, call once: { "action": "close" }

NEVER NARRATE THE ACTION (CRITICAL — ZERO TOLERANCE):
The website moves SILENTLY. You must NEVER announce, describe or narrate the navigation, scroll, highlight or panel opening — not before, not during, not after. The visitor SEES it happen, so you never say it happened.
FORBIDDEN phrases: "let me open that", "I'll scroll down", "I'll take you there", "ik open het menu voor u", "ik breng u naar", "kijk hier is het", "laat me dat tonen", "ik scroll even", "ik toon u", "here is the menu", "I'll show you", "let me show you".
Just call the tool SILENTLY and keep talking about the TOPIC itself (the dish, the location, the wine, the terrace). The page follows on its own.

KEEP TALKING — NO DEAD AIR:
Call the tool mid-sentence and keep speaking without pausing. Your voice must never stop while the website moves. The tool is fire-and-forget — do NOT wait for a result, do NOT read the result back, do NOT comment on it. Just call it and continue your sentence.

BEELDBANK PHOTO HANDOFF (when the visitor wants to SEE a photo):
You cannot show images yourself. When the visitor wants to see a photo — beeldbank, "foto's", "sfeerbeeld", "terras foto", "een gerecht zien", "toon een foto", "montre une photo", "show me a photo" — call:
{ "action": "showBeeldbankPhoto", "target": "<what they want to see, in their language>", "data": { "category": "<interiors|gastronomy|atmosphere|architecture|branding, if you can tell>", "location": "<hasselt|borgloon|heusden-zolder, if known>" } }
Say one warm line (e.g. "ik toon u alvast enkele foto's in de chat") and continue — do not describe a photo you cannot see.

CONCRETE EXAMPLES (tool fires mid-sentence, speech stays on the TOPIC, never narrates):
- Visitor: "Wat is jullie specialiteit?" → the moment you say "ribeye" call websiteAction {action:"navigate", target:"onze dry-aged ribeye"} and say: "Onze dry-aged ribeye is waar we om bekend staan — twintig dagen gerijpt, mals en intens."
- Visitor: "Ik hou van een goeie steak" → as you say "steak" call {action:"navigate", target:"steak"} and say: "Dan zit u hier goed — onze grilleurs weten precies hoe elk stuk vlees op de grill thuishoort."
- Visitor: "Waar zitten jullie?" → as you say "vestigingen" call {action:"navigate", target:"vestigingen"} and say: "We hebben drie vestigingen in Limburg — Hasselt, Borgloon en Heusden-Zolder."
- Visitor: "Een verjaardag met twintig personen" → as you say "groep" call {action:"navigate", target:"een groepsfeest"} and say: "Voor een groep van twintig zorgen we graag voor een compleet menu — van voorgerecht tot dessert."
- Visitor: "Hebben jullie cadeaubonnen?" → as you say "cadeaubon" call {action:"navigate", target:"cadeaubonnen"} and say: "Ja — onze cadeaubonnen zijn er vanaf 25 euro, digitaal of af te halen."
- Visitor: "Laat maar, ga terug" → call {action:"close"} and say: "Geen probleem — waarmee kan ik u verder helpen?"
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
    //    BEFORE it runs and NOT wait for a response — so the agent keeps talking
    //    while the page navigates/scrolls/highlights (no dead-air "thinking"
    //    pause, no narration of the result).
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
          const tGetRes = await fetch(`https://api.elevenlabs.io/v1/convai/tools/${toolId}`, { headers: authHeaders() });
          if (tGetRes.ok) {
            const tFull = await tGetRes.json();
            const cfg = tFull.tool_config || tFull;
            // pre_tool_speech 'force' = speak BEFORE the tool runs.
            // expects_response false = don't wait for the result / don't read
            // it back — the host keeps talking while the page moves silently.
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