import { createClientFromRequest } from 'npm:@base44/sdk@0.8.40';
import { logEvent } from '../../shared/eventBus.ts';
import { recommend, suggestLocation } from '../../shared/recommendationEngine.ts';

export default async function(req) {
  try {
    const base44 = createClientFromRequest(req);
    const body = await req.json().catch(() => ({}));
    const { action, visitor_id } = body;

    logEvent(base44, { type: 'recommendation.requested', domain: 'recommendation', payload: { action }, visitorId: visitor_id, source: 'tool' });

    const menu = base44.asServiceRole.entities.MenuKnowledge;

    if (action === 'getDishes') {
      const { preferences = {}, exclude = [], limit = 3 } = body;
      const items = await menu.list('-created_date', 200);
      const recs = recommend(items, { preferences, exclude, limit });
      return Response.json({
        recommendations: recs,
        uiAction: recs.length > 0 ? `openGallery|food|${preferences.location || ''}` : null,
      });
    }

    if (action === 'getWinePairing') {
      const { dish_name } = body;
      if (!dish_name) return Response.json({ error: 'dish_name required' }, { status: 400 });
      const items = await menu.filter({ item_name: dish_name });
      const item = items && items[0];
      if (!item) return Response.json({ found: false });
      return Response.json({ found: true, dish: item.item_name, pairing: item.pairing || null });
    }

    if (action === 'getSeasonal') {
      const { season } = body;
      const items = await menu.list('-created_date', 200);
      const seasonal = (items || []).filter((i) => i.is_new || (season && ['autumn', 'winter'].includes(season) && ['beef', 'signature', 'sides'].includes(i.category)));
      return Response.json({ items: seasonal.slice(0, 5) });
    }

    if (action === 'getLocation') {
      const result = suggestLocation(body);
      return Response.json(result);
    }

    return Response.json({ error: 'unknown_action', actions: ['getDishes', 'getWinePairing', 'getSeasonal', 'getLocation'] }, { status: 400 });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}