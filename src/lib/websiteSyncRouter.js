import { base44 } from '@/api/base44Client';
import { matchLocal, compactIndex, CONTENT_INDEX } from '@/lib/websiteContentIndex';

/**
 * Two-stage topic router.
 *
 * Stage A — instant local fuzzy match against the content index (free).
 * Stage B — when the local pass is not confident, an LLM (Gemini Flash via
 *           Base44 integration credits) reads the agent's words and the compact
 *           index and returns the single best matching entry id, or null.
 *
 * This is what makes the engine "understand everything": the agent can describe
 * a topic in its own words ("that dry-aged ribeye you guys are known for") and
 * the router maps it to the right page/section/dish — no predefined keyword
 * list.
 */

let routePromise = null;
let lastInput = null;

export async function routeTopic(topic) {
  const text = String(topic || '').trim();
  if (!text) return null;

  // Stage A — local
  const local = matchLocal(text);
  if (local) return local;

  // Stage B — LLM router. Debounce identical consecutive calls.
  if (lastInput === text && routePromise) return routePromise;
  lastInput = text;

  const list = compactIndex();
  const prompt =
    `You map a spoken restaurant-conversation topic to exactly ONE website content entry.
Return JSON: { "id": "<entry id>", "confidence": <0..1> }.
If nothing on the website matches the topic, return { "id": null, "confidence": 0 }.
Pick the single best match. The topic is free text the host is currently discussing — it may paraphrase, translate, or describe a dish/page/location/service.

Topic: """${text}"""

Available entries (id | label | aliases):
${list.map((e) => `${e.id} | ${e.label} | ${e.aliases.join(', ')}`).join('\n')}`;

  routePromise = (async () => {
    try {
      const res = await base44.integrations.Core.InvokeLLM({
        prompt,
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