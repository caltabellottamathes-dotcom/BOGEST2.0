// Google Image Search via SerpApi — vervanger voor de Google Custom Search API.
// Deze functie haalt nu beelden op via SerpApi zonder dat je OAuth of Cloud Project rechten nodig hebt.

export default async function (req) {
  try {
    // Haal de SERPAPI_API_KEY uit je secrets.
    const API_KEY = process.env.SERPAPI_API_KEY; 
    
    if (!API_KEY) {
      return Response.json({ error: 'SERPAPI_API_KEY not configured in secrets' }, { status: 500 });
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

    // We doorlopen de zoektermen
    for (const q of queries) {
      try {
        // SerpApi endpoint voor image search
        const endpoint = 'https://serpapi.com/search'
          + '?engine=google_images'
          + '&q=' + encodeURIComponent(q)
          + '&api_key=' + encodeURIComponent(API_KEY)
          + '&ijn=0' 
          + '&num=' + num;

        const res = await fetch(endpoint, { signal: AbortSignal.timeout(20000) });
        if (!res.ok) {
          const body = await res.text().catch(() => '');
          apiError = `SerpApi ${res.status}: ${body.slice(0, 300)}`;
          continue;
        }
        
        const data = await res.json();
        
        // SerpApi foutafhandeling
        if (data.error) {
            apiError = data.error;
            continue;
        }

        // SerpApi geeft resultaten terug in 'images_results'
        for (const item of data.images_results || []) {
          const link = item.original; // De directe afbeelding-URL
          if (!link) continue;
          
          // Filter op extensies (JPG/PNG)
          if (!/\.(jpg|jpeg|png)(\?|$)/i.test(link)) continue;
          if (seen.has(link)) continue;
          
          seen.add(link);
          images.push({
            url: link,
            source: item.source || item.link || '',
            title: item.title || '',
            query: q,
          });
          
          if (images.length >= num) break;
        }
      } catch (err) {
        console.error("SerpApi fetch failed:", err);
      }
    }

    if (images.length === 0 && apiError) {
      return Response.json({ ok: false, error: apiError, query: queries.join(', '), count: 0, images: [] });
    }
    
    return Response.json({ ok: true, query: queries.join(', '), count: images.length, images, error: apiError });
  } catch (e) {
    return Response.json({ error: e.message }, { status: 500 });
  }
}