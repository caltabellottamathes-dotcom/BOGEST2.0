// Google Custom Search JSON API — image search (searchType=image) for Bogèst.
// Returns a clean list of image URLs (.jpg / .png) found for the given terms.
//
// invoke('googleImageSearch', { query: 'Bogèst restaurant' })            // one term
// invoke('googleImageSearch', { query: 'all' })                        // default set
// invoke('googleImageSearch', { query: 'Bogèst interieur', num: 8 })
export default async function (req) {
  try {
    const API_KEY = process.env.GOOGLE_CSE_API_KEY;
    const CX = process.env.GOOGLE_CSE_CX;
    if (!API_KEY || !CX) {
      return Response.json({ error: 'Google Custom Search keys not configured (GOOGLE_CSE_API_KEY / GOOGLE_CSE_CX)' }, { status: 500 });
    }

    let params = {};
    if (req.method === 'GET') {
      const url = new URL(req.url);
      params = { query: url.searchParams.get('query') || url.searchParams.get('q'), num: url.searchParams.get('num') };
    } else {
      params = await req.json().catch(() => ({}));
    }

    const DEFAULT_TERMS = ['Bogèst restaurant', 'Bogèst interieur', 'Bogèst food'];
    const query = String(params.query || params.q || 'all');
    const num = Math.min(10, Math.max(1, Number(params.num) || 10));
    const queries = query && query !== 'all' ? [query] : DEFAULT_TERMS;

    const images = [];
    const seen = new Set();
    let apiError = null;
    for (const q of queries) {
      try {
        const endpoint = 'https://www.googleapis.com/customsearch/v1'
          + '?key=' + encodeURIComponent(API_KEY)
          + '&cx=' + encodeURIComponent(CX)
          + '&searchType=image'
          + '&num=' + num
          + '&q=' + encodeURIComponent(q);
        const res = await fetch(endpoint, { signal: AbortSignal.timeout(20000) });
        if (!res.ok) {
          const body = await res.text().catch(() => '');
          apiError = `Google API ${res.status}: ${body.slice(0, 300)}`;
          continue;
        }
        const data = await res.json();
        if (data.error) apiError = data.error.message || JSON.stringify(data.error);
        for (const item of data.items || []) {
          const link = item.link;
          if (!link) continue;
          if (!/\.(jpg|jpeg|png)(\?|$)/i.test(link)) continue;
          if (seen.has(link)) continue;
          seen.add(link);
          images.push({
            url: link,
            source: item.image?.contextLink || item.displayLink || '',
            title: item.title || '',
            query: q,
          });
        }
      } catch {}
    }

    if (images.length === 0 && apiError) {
      return Response.json({ ok: false, error: apiError, query: queries.join(', '), count: 0, images: [] });
    }
    return Response.json({ ok: true, query: queries.join(', '), count: images.length, images, error: apiError });
  } catch (e) {
    return Response.json({ error: e.message }, { status: 500 });
  }
}