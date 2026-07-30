import { createClientFromRequest } from 'npm:@base44/sdk@0.8.40';

// GET /api/assets?category=gastronomy&limit=5&sort=quality_score   (HTTP)
// invoke('assetsApi', { category, limit, sort })                   (SDK / agent)
// invoke('assetsApi', { action: 'delete', id })                    (admin only)
export default async function (req) {
  try {
    const base44 = createClientFromRequest(req);

    let params = {};
    if (req.method === 'GET') {
      const url = new URL(req.url);
      params = {
        category: url.searchParams.get('category'),
        limit: url.searchParams.get('limit'),
        sort: url.searchParams.get('sort'),
        action: url.searchParams.get('action'),
        id: url.searchParams.get('id'),
      };
    } else {
      params = await req.json().catch(() => ({}));
    }

    // Delete — admin only
    if (params.action === 'delete') {
      try {
        const user = await base44.auth.me();
        if (!user || user.role !== 'admin') return Response.json({ error: 'Admin only' }, { status: 403 });
      } catch {
        return Response.json({ error: 'Admin only' }, { status: 403 });
      }
      const id = params.id;
      if (!id) return Response.json({ error: 'Missing id' }, { status: 400 });
      await base44.asServiceRole.entities.AssetArchive.delete(id);
      return Response.json({ ok: true });
    }

    // Update fields — admin only
    if (params.action === 'update') {
      try {
        const user = await base44.auth.me();
        if (!user || user.role !== 'admin') return Response.json({ error: 'Admin only' }, { status: 403 });
      } catch {
        return Response.json({ error: 'Admin only' }, { status: 403 });
      }
      const id = params.id;
      if (!id) return Response.json({ error: 'Missing id' }, { status: 400 });
      const allowed = ['description', 'primary_category', 'subcategory', 'location', 'tags', 'mood', 'colors', 'quality_score', 'is_relevant', 'status', 'source_url', 'collections'];
      const update = {};
      for (const k of allowed) if (k in (params.data || {})) update[k] = params.data[k];
      if (Object.keys(update).length === 0) return Response.json({ error: 'Nothing to update' }, { status: 400 });
      const updated = await base44.asServiceRole.entities.AssetArchive.update(id, update);
      return Response.json({ ok: true, item: updated });
    }

    const limit = Math.min(Math.max(1, Number(params.limit) || 20), 200);
    // sort: "quality_score" → highest first; "date" → newest first (default)
    let sort = '-created_date';
    if (params.sort === 'quality_score' || params.sort === '-quality_score') sort = '-quality_score';

    const filter = {};
    if (params.category && params.category !== 'all') filter.primary_category = params.category;

    const items = await base44.asServiceRole.entities.AssetArchive.filter(filter, sort, limit);

    return Response.json({ items, count: items.length });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}