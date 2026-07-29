import { base44 } from '@/api/base44Client';
import { matchLocal, matchFuzzy, compactIndex, CONTENT_INDEX } from '@/lib/websiteContentIndex';

/**
 * Two-stage topic router — the "brain" that keeps the website in sync with the
 * conversation by understanding INTENT, not just literal words.
 *
 * Stage A — instant local EXACT match against the content index (free). Only
 *           exact matches short-circuit here, so ambiguous or paraphrased topics
 *           fall through to the LLM.
 * Stage B — an LLM (Gemini Flash via Base44 integration credits) reads the
 *           agent's words + the full content index and returns the single best
 *           matching entry id, or null. This is what makes the engine
 *           understand "that dry-aged steak you guys are known for",
 *           "where are you located", "show me the terrace in Borgloon", or
 *           "never mind, close that" — regardless of phrasing or language
 *           (Dutch / French / English).
 */

let routePromise = null;
let lastInput = null;

const LLM_PROMPT = (text, list) => `You are the navigation brain of the Bogèst restaurant website. You map what the digital host is currently talking about to exactly ONE website content entry — understanding INTENT and MEANING, not only literal words. The topic may paraphrase, translate (Dutch / French / English), or describe something indirectly.

Rules:
- Match the visitor's INTENT, not just keywords.
- "where are you / which cities / addresses / locations" → id "locations" (overview of ALL restaurants).
- A specific city or restaurant name (Hasselt, Borgloon, Heusden-Zolder) → that specific location entry (loc-hasselt / loc-borgloon / loc-heusden-zolder) — which opens the location info page AND its restaurant-and-spaces panel.
- Terrace / spaces / rooms / "restaurant en ruimtes" of a specific city → that location's spaces entry (loc-<city>-spaces).
- Opening hours / parking / contact / address of a specific city → that location's sub-section (loc-<city>-hours / -parking / -contact).
- Prefer the MOST SPECIFIC match: an individual dish (id menu-dish-*) beats its category (menu-cat-*); a specific location beats the locations overview.
- If the host is clearly describing a named dish on the menu, return that dish id (menu-dish-*).
- If the intent is to close / dismiss / stop / go back / "never mind" a panel, return id "close-panel".
- If nothing on the website corresponds to the topic (e.g. weather, greeting, small talk, "hoe laat is het"), return { "id": null, "confidence": 0 }.

Return JSON: { "id": "<entry id or null>", "confidence": <0..1> }.
Pick the single best match.

Topic: """${text}"""

Available entries (id | type | label | aliases | hint):
${list.map((e) => `${e.id} | ${e.type} | ${e.label} | ${e.aliases.join(', ')} | ${e.desc}`).join('\n')}`;

export async function routeTopic(topic) {
  const text = String(topic || '').trim();
  if (!text) return null;

  // Stage A — local exact match (instant, free)
  const local = matchLocal(text);
  if (local) return local;

  // Stage A.5 — local fuzzy match (instant, free): if a specific dish /
  // category / location / section alias is mentioned inside the topic, route
  // to it without an LLM round-trip so scroll & highlight react instantly.
  const fuzzy = matchFuzzy(text);
  if (fuzzy) return fuzzy;

  // Stage B — LLM router. Debounce identical consecutive calls.
  if (lastInput === text && routePromise) return routePromise;
  lastInput = text;

  const list = compactIndex();

  routePromise = (async () => {
    try {
      const res = await base44.integrations.Core.InvokeLLM({
        prompt: LLM_PROMPT(text, list),
        model: 'gemini_3_flash',
        response_json_schema: {
          type: 'object',
          properties: { id: { type: 'string' }, confidence: { type: 'number' } },
          required: ['id'],
        },
      });
      const id = res?.id;
      if (!id || id === 'null') return null;
      const entry = CONTENT_INDEX.find((e) => e.id === id);
      return entry || null;
    } catch {
      return null;
    } finally {
      routePromise = null;
    }
  })();

  return routePromise;
}