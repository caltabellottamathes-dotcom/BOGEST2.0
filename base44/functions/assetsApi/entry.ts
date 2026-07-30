import { createClientFromRequest } from 'npm:@base44/sdk@0.8.40';

// GET /api/assets?category=gastronomy&limit=5&sort=quality_score  (HTTP)
// or invoke('assetsApi', { category, limit, sort })                (SDK / agent)
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
      };
    } else {
      params = await req.json().catch(() => ({}));
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