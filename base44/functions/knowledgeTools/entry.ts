import { createClientFromRequest } from 'npm:@base44/sdk@0.8.40';
import { logEvent } from '../../shared/eventBus.ts';
import { POLICIES, FAQ } from '../../shared/bogestData.ts';

export default async function(req) {
  try {
    const base44 = createClientFromRequest(req);
    const body = await req.json().catch(() => ({}));
    const { action, visitor_id } = body;

    logEvent(base44, { type: 'knowledge.queried', domain: 'knowledge', payload: { action }, visitorId: visitor_id, source: 'tool' });

    if (action === 'getMenuItem') {
      const { item_name, category, limit = 5 } = body;
      const entities = base44.asServiceRole.entities.MenuKnowledge;
      let items;
      if (item_name) {
        items = await entities.filter({ item_name });
      } else if (category) {
        items = await entities.filter({ category }, 'sort_order', limit);
      } else {
        items = await entities.list('sort_order', limit);
      }
      return Response.json({ items: (items || []).slice(0, limit) });
    }

    if (action === 'getPolicy') {
      const { topic } = body;
      if (!topic || !POLICIES[topic]) {
        return Response.json({ error: 'unknown_topic', topics: Object.keys(POLICIES) }, { status: 400 });
      }
      return Response.json({ topic, text: POLICIES[topic] });
    }

    if (action === 'answerFAQ') {
      const { question } = body;
      const q = (question || '').toLowerCase();
      const match = Object.values(FAQ).find((f) => q.includes(f.q.toLowerCase()) || f.q.toLowerCase().includes(q));
      if (!match) return Response.json({ answered: false, suggestion: 'Stel uw vraag aan de vestiging voor specifieke info.' });
      return Response.json({ answered: true, question: match.q, answer: match.a });
    }

    return Response.json({ error: 'unknown_action', actions: ['getMenuItem', 'getPolicy', 'answerFAQ'] }, { status: 400 });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}