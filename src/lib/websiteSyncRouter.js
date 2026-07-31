import { base44 } from '@/api/base44Client';
import { matchLocal, matchFuzzy, matchSemantic, compactIndex, CONTENT_INDEX } from '@/lib/websiteContentIndex';

/**
 * Multi-stage topic router — the "brain" that keeps the website in sync with
 * the conversation by understanding INTENT and ASSOCIATED terms, not just
 * literal words.
 *
 * Stage A   — instant local EXACT match (free).
 * Stage A.5 — instant local FUZZY match: a specific dish / category /
 *             location / section alias inside the topic (longest alias wins,
 *             dish beats category) — no LLM round-trip.
 * Stage A.6 — instant SEMANTIC match: a curated multilingual cluster map of
 *             synonyms / associated words / paraphrases → entry. This is what
 *             makes "I love a good steak", "where are you guys", "a birthday
 *             with 20 people" or "do you have gift cards" navigate the instant
 *             the direction becomes clear, without an exact keyword.
 * Stage B   — LLM (Gemini Flash) reads the agent's words + the full content
 *             index and returns the single best matching entry id, or null.
 *             Handles anything the local stages missed, across Dutch / French
 *             / English.
 */
let routePromise = null;
let lastInput = null;

const LLM_PROMPT = (text, list) => `You are the navigation brain of the Bogèst restaurant website. You map what the digital host is currently talking about to exactly ONE website content entry — understanding INTENT, MEANING and ASSOCIATED concepts, not only literal words. The topic may paraphrase, translate (Dutch / French / English), or describe something indirectly (e.g. "meat", "a good steak", "a birthday with 20 people", "where are you guys", "do you have gift cards").

Rules:
- Match the visitor's INTENT and associated terms, not just keywords. "meat/steak/beef/dish/food" → a menu category or dish; "birthday/party/group/company/team" → groups; "where/cities/address/waar" → locations overview; "gift/voucher/cadeau" → gift cards; "takeaway/pickup/order online/afhalen" → takeaway; "book/table/reserve/tafel" → reservations; "hours/open/openingsuren" → a location's hours; "story/verhaal" → about/story; "philosophy/filosofie/pijlers" → philosophy; "reviews/ervaringen" → reviews; "instagram/social/foto's" → instagram.
- A specific city or restaurant name (Hasselt, Borgloon, Heusden-Zolder) → that specific location entry (loc-hasselt / loc-borgloon / loc-heusden-zolder).
- Terrace / spaces / rooms of a specific city → that location's spaces entry (loc-<city>-spaces).
- Opening hours / parking / contact / address of a specific city → that location's sub-section (loc-<city>-hours / -parking / -contact).
- Prefer the MOST SPECIFIC match: an individual dish (menu-dish-*) beats its category (menu-cat-*); a specific location beats the locations overview.
- If the host is clearly describing a named dish on the menu, return that dish id (menu-dish-*).
- If the intent is to close / dismiss / stop / go back / "never mind" a panel, return id "close-panel".
- If nothing on the website corresponds to the topic (weather, greeting, small talk, "hoe laat is het"), return { "id": null, "confidence": 0 }.

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

  // Stage A.5 — local fuzzy match (instant, free): specific dish / category /
  // location / section alias inside the topic — longest alias wins, dish beats
  // category, specific location beats generic section.
  const fuzzy = matchFuzzy(text);
  if (fuzzy) return fuzzy;

  // Stage A.6 — local semantic match (instant, free): curated synonym /
  // associated-word clusters, including pages — fires on direction, not exact
  // keyword.
  const semantic = matchSemantic(text);
  if (semantic) return semantic;

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