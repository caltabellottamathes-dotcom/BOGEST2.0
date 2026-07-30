import { createClientFromRequest } from 'npm:@base44/sdk@0.8.40';

// Queryable Bogèst asset archive — for the Digital Host (VraagHetBogest) and
// the ElevenLabs voice agent. Returns relevant archive photos by category /
// free-text query / location, so the agents can surface real Bogèst imagery
// (interior, dishes, atmosphere, architecture, branding) in conversation.
//
// invoke('assetSearch', { query: 'veranda', category: 'interiors', location: 'hasselt', limit: 6 })
// → { count, images: [{ url, description, category, subcategory, location, tags, quality_score }] }
export default async function (req) {
  try {
    const base44 = createClientFromRequest(req);

    let params = {};
    if (req.method === 'GET') {
      const url = new URL(req.url);
      params = {
        query: url.searchParams.get('query'),
        category: url.searchParams.get('category'),
        location: url.searchParams.get('location'),
        limit: url.searchParams.get('limit'),
      };
    } else {
      params = await req.json().catch(() => ({}));
    }

    const limit = Math.min(20, Math.max(1, Number(params.limit) || 6));
    const category = params.category && params.category !== 'all' ? String(params.category) : null;
    const location = params.location && params.location !== 'all' ? String(params.location) : null;

    const filter = { is_relevant: true, status: 'active' };
    if (category) filter.primary_category = category;
    if (location) filter.location = location;

    // Pull a larger pool (sorted by quality) then free-text filter client-side,
    // since the archive is small and multi-field text search isn't indexed.
    let items = await base44.asServiceRole.entities.AssetArchive.filter(filter, '-quality_score', 80);
    const q = String(params.query || '').trim().toLowerCase();
    if (q) {
      items = items.filter((a) =>
        (a.description || '').toLowerCase().includes(q) ||
        (a.subcategory || '').toLowerCase().includes(q) ||
        (a.mood || '').toLowerCase().includes(q) ||
        (a.primary_category || '').toLowerCase().includes(q) ||
        (a.tags || []).some((t) => String(t).toLowerCase().includes(q))
      );
    }
    items = items.slice(0, limit);

    return Response.json({
      count: items.length,
      images: items.map((a) => ({
        url: a.image_url,
        description: a.description || '',
        category: a.primary_category,
        subcategory: a.subcategory || '',
        location: a.location || 'unknown',
        tags: a.tags || [],
        quality_score: a.quality_score || 0,
      })),
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}