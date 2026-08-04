import { createClientFromRequest } from 'npm:@base44/sdk@0.8.40';

// Queryable Bogèst asset archive — for the Digital Host (VraagHetBogest) and
// the ElevenLabs voice agent. Returns relevant archive photos using a
// natural-language search across multi-categories, unlimited AI tags,
// description and metadata.
//
// invoke('assetSearch', { query: 'belgian blue dishes in the evening', category: 'food', location: 'hasselt', limit: 6 })
// → { count, images: [{ url, description, categories, location, tags, quality_score }] }
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
    const category = params.category && params.category !== 'all' ? String(params.category).toLowerCase() : null;
    const location = params.location && params.location !== 'all' ? String(params.location) : null;

    const filter = { is_relevant: true, status: 'active' };
    if (location) filter.location = location;

    let items = await base44.asServiceRole.entities.AssetArchive.filter(filter, '-quality_score', 100);

    // Category filter — match the group or sub across multi-categories (with
    // a legacy fallback to the old single primary_category).
    if (category) {
      items = items.filter((a) => {
        const cats = a.categories || [];
        if (cats.some((c) => String(c).toLowerCase().includes(category))) return true;
        if ((a.primary_category || '').toLowerCase() === category) return true;
        return false;
      });
    }

    // Natural-language search: tokenize (NL/FR/EN stop words removed) and
    // score each asset across categories + tags + description + meta.
    const q = String(params.query || '').trim().toLowerCase();
    if (q) {
      const stop = new Set(['show', 'me', 'find', 'a', 'an', 'the', 'of', 'with', 'and', 'or', 'for', 'to', 'in', 'at', 'on', 'by', 'photos', 'photo', 'pictures', 'picture', 'image', 'images', 'served', 'that', 'are', 'is', 'was', 'van', 'een', 'de', 'het', 'met', 'en', 'fotos', 'foto', 'afbeelding', 'toon', 'laat', 'zien', 'vind', 'zoek', 'montre', 'moi', 'une', 'des', 'un', 'le', 'la', 'les', 'avec', 'pour', 'de']);
      const tokens = q.split(/\s+/).filter((t) => t.length > 1 && !stop.has(t));
      if (tokens.length) {
        const scored = items
          .map((a) => {
            const hay = [
              ...(a.categories || []),
              ...(a.tags || []),
              a.description || '',
              a.subcategory || '',
              a.mood || '',
              a.source_platform || '',
              a.primary_category || '',
              a.location || '',
            ].join(' ').toLowerCase();
            const score = tokens.reduce((s, t) => s + (hay.includes(t) ? 1 : 0), 0);
            return { a, score };
          })
          .filter((x) => x.score > 0)
          .sort((x, y) => y.score - x.score || (y.a.quality_score || 0) - (x.a.quality_score || 0))
          .map((x) => x.a);
        // If the (often Dutch) query doesn't match the English tags/descriptions,
        // fall back to the top-quality images so the caller always gets results.
        if (scored.length) items = scored;
      }
    }

    items = items.slice(0, limit);

    return Response.json({
      count: items.length,
      images: items.map((a) => {
        const cats = a.categories || (a.primary_category ? [a.primary_category] : []);
        return {
          url: a.image_url,
          description: a.description || '',
          categories: cats,
          category: a.primary_category || cats[0] || '',
          subcategory: a.subcategory || '',
          location: a.location || 'unknown',
          tags: a.tags || [],
          matched_dish: a.matched_dish || '',
          quality_score: a.quality_score || 0,
        };
      }),
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}