import { createClientFromRequest } from 'npm:@base44/sdk@0.8.40';

// Vision Filter pipeline for the Bogèst Universal Asset Archive.
// Accepts an array of image URLs (typically the output of googleImageSearch),
// runs each through Gemini vision with a strict relevance prompt, and returns
// only the photos that are relevant to Bogèst (goede_fotos).
//
// invoke('visionFilterAssets', { images: [{url, ...}, ...] })   // structured
// invoke('visionFilterAssets', { urls: ['https://...', ...] }) // plain urls
//
// Returns: { ok, count, total, goede_fotos: [...], errors: [...] }
export default async function (req) {
  try {
    const base44 = createClientFromRequest(req);

    let params = {};
    if (req.method === 'GET') {
      const url = new URL(req.url);
      try { params.images = JSON.parse(url.searchParams.get('images') || '[]'); } catch {}
      try { params.urls = JSON.parse(url.searchParams.get('urls') || '[]'); } catch {}
    } else {
      params = await req.json().catch(() => ({}));
    }

    const raw = params.images || params.urls || [];
    const items = raw
      .map((it) => (typeof it === 'string' ? { url: it } : it))
      .filter((it) => it && it.url);

    const PROMPT =
      'Analyseer deze afbeelding. Is dit een foto van het interieur, het eten/de gerechten ' +
      'of een evenement van restaurant Bogèst?\n' +
      'Antwoord uitsluitend in JSON-formaat: {"is_relevant": true/false, "categorie": "Interieur/Food/Event/Overig", "reden": "kort waarom"}.';

    // Parallel vision analysis — all images analysed concurrently for speed.
    const results = await Promise.allSettled(
      items.map((item) =>
        base44.asServiceRole.integrations.Core.InvokeLLM({
          prompt: PROMPT,
          file_urls: [item.url],
          model: 'gemini_3_flash',
          response_json_schema: {
            type: 'object',
            properties: {
              is_relevant: { type: 'boolean' },
              categorie: { type: 'string', enum: ['Interieur', 'Food', 'Event', 'Overig'] },
              reden: { type: 'string' }
            },
            required: ['is_relevant', 'categorie']
          }
        }).then((verdict) => {
          const v = verdict && typeof verdict === 'object' ? verdict : null;
          if (v && v.is_relevant === true && v.categorie !== 'Overig') {
            return { ...item, is_relevant: true, categorie: v.categorie, reden: v.reden || '' };
          }
          return null;
        })
      )
    );

    const goede_fotos = [];
    const errors = [];
    results.forEach((r, i) => {
      if (r.status === 'fulfilled') {
        if (r.value) goede_fotos.push(r.value);
      } else {
        errors.push({ url: items[i].url, error: (r.reason && r.reason.message) || 'afbeelding kon niet geladen worden' });
      }
    });

    return Response.json({
      ok: true,
      count: goede_fotos.length,
      total: items.length,
      goede_fotos,
      errors
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}