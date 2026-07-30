import { createClientFromRequest } from 'npm:@base44/sdk@0.8.40';

// ─── Bogèst Universal Asset Archive — discovery pipeline ───────────────────
// Multi-pass discovery: known Bogèst CDN seeds + bogest.be page scraping +
// Instagram posts + LLM web search → fetch → filter (size / aspect / dedup) →
// mirror to Base44 CDN → vision analysis (gemini_3_flash) → store.

const CDN = 'https://images.squarespace-cdn.com/content/v1/68b84525485ccc7e15a25577';

const THEMES = {
  interiors: {
    label: 'Interiors',
    queries: ['Bogèst restaurant interior design', 'Bogèst restaurant veranda'],
    pages: ['https://bogest.be', 'https://bogest.be/ons-verhaal'],
    seed: [
      `${CDN}/b7c2edca-9db5-43c2-b109-4cc33197dfbe/veranda+hasselt.jpeg`,
      `${CDN}/5baf9326-de7f-4a23-9273-dd46941a1b15/veranda+borgloon.jpeg`,
      `${CDN}/04917c77-6ebc-4470-83fb-a2abc637268b/zolder+veranda.jpeg`,
      `${CDN}/1756906798133-O44CER8WRTZ0YVM5E8TK/living.jpeg`,
      `${CDN}/1756906798126-DFOS1XY5Y0NOWCQVE23M/96368874_542981379699687_4859956873555607552_n.jpg`,
    ],
  },
  gastronomy: {
    label: 'Gastronomy',
    queries: ['Bogèst food photography', 'Bogèst dishes', 'Bogèst fine dining plating'],
    pages: ['https://bogest.be/menu'],
    seed: [
      `${CDN}/1756906798035-Y0LQXMVFSBJWWVXQG7ZI/filet+pur+.jpeg`,
      `${CDN}/1756906798060-BJGKYWMVJNFODKFB94TE/B4E94C22-3656-4874-A66B-CEA4D674F86D.jpeg`,
      `${CDN}/1756906798068-Y30B7VANC5RKS6HTHGE9/tomapork.jpeg`,
      `${CDN}/1756906799922-SLXI4OSI7W3KWGKE3UFY/5a7c094c-9679-410a-bbc5-5f8c663d8a14.JPG`,
      `${CDN}/1b9991fd-fc43-405b-acb6-a86317aaf9f1/5757bb8f-abdc-43e6-9219-e4e103f1a2e0.jpeg`,
    ],
  },
  atmosphere: {
    label: 'Atmosphere',
    queries: ['people dining at Bogèst', 'Bogèst social atmosphere', 'Bogèst terrace'],
    pages: ['https://bogest.be'],
    seed: [
      `${CDN}/1756906793871-KBDPOQZVPFE4ORKRLGFS/402597853_796945305777335_8211882432551808857_n.jpg`,
      `${CDN}/32f05da0-47c0-41c3-8beb-befced66a749/5D626C0A-F4F5-4B45-895D-E1D622FB21E2.jpeg`,
      `${CDN}/1756906798149-17KHS8RDD2FJIZI179ZQ/EF6D9D08-F3ED-41E2-9392-96AB73DEF2E6.jpeg`,
    ],
  },
  architecture: {
    label: 'Architecture',
    queries: ['Bogèst restaurant architecture', 'Bogèst building exterior'],
    pages: ['https://bogest.be/vestigingen'],
    seed: [
      `${CDN}/1756906798165-JY6MLWTWSAW9LSNQ1R89/2503F10C-6FB0-4FB4-9296-9E616D4559C3.jpeg`,
      `${CDN}/1756906798141-H0H195TOCA6WGBG9N8WA/IMG_4166.jpg`,
    ],
  },
  branding: {
    label: 'Branding',
    queries: ['Bogèst logo branding', 'Bogèst brand identity'],
    pages: ['https://bogest.be'],
    seed: [],
  },
};

const CURATOR_PROMPT = `You are an expert brand curator for Bogèst, a premium Belgian grillhouse chain. Analyze the attached image and categorize it into exactly one of these 5 buckets: interiors, gastronomy, atmosphere, architecture, branding. Extract a detailed description (1-2 sentences), identify key objects, and define the mood. If the image is not relevant to Bogèst (generic stock, unrelated subject, low quality, screenshot/text), set is_relevant to false. Generate up to 6 lowercase tags for searchability. Return strict JSON.`;

const ANALYSIS_SCHEMA = {
  type: 'object',
  properties: {
    primary_category: { type: 'string', enum: ['interiors', 'gastronomy', 'atmosphere', 'architecture', 'branding'] },
    description: { type: 'string' },
    tags: { type: 'array', items: { type: 'string' } },
    mood: { type: 'string' },
    colors: { type: 'array', items: { type: 'string' } },
    is_relevant: { type: 'boolean' },
    quality_score: { type: 'number' },
  },
  required: ['primary_category', 'description', 'is_relevant', 'quality_score'],
};

// ─── Helpers ────────────────────────────────────────────────────────────────
function imageDimensions(buf) {
  const b = new Uint8Array(buf);
  if (b.length < 24) return null;
  // PNG
  if (b[0] === 0x89 && b[1] === 0x50 && b[2] === 0x4e && b[3] === 0x47) {
    return { w: (b[16] << 24) | (b[17] << 16) | (b[18] << 8) | b[19], h: (b[20] << 24) | (b[21] << 16) | (b[22] << 8) | b[23] };
  }
  // GIF
  if (b[0] === 0x47 && b[1] === 0x49 && b[2] === 0x46) {
    return { w: b[6] | (b[7] << 8), h: b[8] | (b[9] << 8) };
  }
  // JPEG
  if (b[0] === 0xff && b[1] === 0xd8) {
    let i = 2;
    while (i < b.length - 9) {
      if (b[i] !== 0xff) { i++; continue; }
      const marker = b[i + 1];
      i += 2;
      if (marker >= 0xc0 && marker <= 0xcf && marker !== 0xc4 && marker !== 0xc8 && marker !== 0xcc) {
        return { h: (b[i + 1] << 8) | b[i + 2], w: (b[i + 3] << 8) | b[i + 4] };
      }
      const len = (b[i] << 8) | b[i + 1];
      i += len;
    }
    return null;
  }
  // WebP (RIFF....WEBP)
  if (b[0] === 0x52 && b[8] === 0x57 && b[9] === 0x45 && b[10] === 0x42 && b[11] === 0x50) {
    const fourcc = String.fromCharCode(b[12], b[13], b[14], b[15]);
    if (fourcc === 'VP8 ') return { w: (b[26] | (b[27] << 8)) & 0x3fff, h: (b[28] | (b[29] << 8)) & 0x3fff };
    if (fourcc === 'VP8L') { const v = b[21] | (b[22] << 8) | (b[23] << 16) | (b[24] << 24); return { w: (v & 0x3fff) + 1, h: ((v >> 14) & 0x3fff) + 1 }; }
    if (fourcc === 'VP8X') return { w: (b[24] | (b[25] << 8) | (b[26] << 16)) + 1, h: (b[27] | (b[28] << 8) | (b[29] << 16)) + 1 };
  }
  return null;
}

async function sha256Hex(buf) {
  const digest = await crypto.subtle.digest('SHA-256', buf);
  return Array.from(new Uint8Array(digest)).map((x) => x.toString(16).padStart(2, '0')).join('');
}

function resolveUrl(u, base) {
  try { return new URL(u, base).href; } catch { return u; }
}

function extractImgUrls(html, base) {
  const urls = [];
  const re = /<img[^>]+src=["']([^"']+)["']/gi;
  let m;
  while ((m = re.exec(html))) urls.push(resolveUrl(m[1], base));
  const re2 = /srcset=["']([^"']+)["']/gi;
  while ((m = re2.exec(html))) {
    for (const p of m[1].split(',')) {
      const u = p.trim().split(' ')[0];
      if (u) urls.push(resolveUrl(u, base));
    }
  }
  return urls;
}

async function fetchBytes(url) {
  const res = await fetch(url, {
    headers: { 'User-Agent': 'BogestAssetArchive/1.0 (+https://bogest.be)' },
    signal: AbortSignal.timeout(20000),
    redirect: 'follow',
  });
  if (!res.ok) return null;
  const ct = (res.headers.get('content-type') || '').toLowerCase();
  if (!ct.startsWith('image/')) {
    // some CDNs omit content-type; allow only if extension looks like an image
    if (!/\.(jpg|jpeg|png|webp|gif)(\?|$)/i.test(url)) return null;
  }
  const buf = await res.arrayBuffer();
  return { buf, ct: ct || 'image/jpeg' };
}

async function mirrorImage(base44, buf, ct) {
  try {
    const blob = new Blob([buf], { type: ct || 'image/jpeg' });
    const file = new File([blob], 'bogest-asset.jpg', { type: blob.type });
    const res = await base44.asServiceRole.integrations.Core.UploadFile({ file });
    return res?.file_url || null;
  } catch {
    return null;
  }
}

// ─── Per-theme pipeline ─────────────────────────────────────────────────────
async function buildCandidates(base44, themeKey, webSearch = false) {
  const t = THEMES[themeKey];
  if (!t) return [];
  const seen = new Set();
  const push = (u, sourceType) => { if (u && !seen.has(u)) { seen.add(u); candidates.push({ url: u, sourceType }); } };
  const candidates = [];

  // 1. Known Bogèst CDN seeds
  for (const u of t.seed) push(u, 'seed');

  // 2. Scrape bogest.be pages for <img> tags
  for (const page of t.pages) {
    try {
      const res = await fetch(page, { headers: { 'User-Agent': 'BogestAssetArchive/1.0' }, signal: AbortSignal.timeout(15000), redirect: 'follow' });
      if (!res.ok) continue;
      const html = await res.text();
      for (const u of extractImgUrls(html, page)) {
        // keep likely photos from CDNs / direct image URLs
        if (/\.(jpg|jpeg|png|webp)(\?|$)/i.test(u) || u.includes('squarespace-cdn') || u.includes('images.squarespace-cdn')) push(u, 'web');
      }
    } catch {}
  }

  // 3. Instagram posts already synced into the DB
  try {
    const posts = await base44.asServiceRole.entities.InstagramPost.list('-posted_at', 30);
    for (const p of posts || []) if (p.media_url) push(p.media_url, 'instagram');
  } catch {}

  // 4. LLM web search for additional real image URLs (opt-in — slow)
  if (webSearch) {
    try {
      const prompt = `Search the web for the Bogèst restaurant chain (bogest.be, Hasselt / Borgloon / Heusden-Zolder, Belgium). Themes: ${t.queries.join(', ')}. Return a JSON object { "images": [ { "url": "<direct, publicly accessible, high-resolution image URL>", "source": "<page where found>" } ] } — up to 12 real image URLs only (jpg/jpeg/png/webp or CDN image links). Never invent URLs.`;
      const res = await base44.asServiceRole.integrations.Core.InvokeLLM({
        model: 'gemini_3_flash',
        add_context_from_internet: true,
        prompt,
        response_json_schema: { type: 'object', properties: { images: { type: 'array', items: { type: 'object', properties: { url: { type: 'string' }, source: { type: 'string' } } } } } },
      });
      for (const img of res?.images || []) if (img.url) push(img.url, 'web');
    } catch {}
  }

  return candidates;
}

async function processTheme(base44, themeKey, limit, dryRun, webSearch = false) {
  const candidates = await buildCandidates(base44, themeKey, webSearch);
  if (dryRun) return { theme: themeKey, candidates: candidates.length, sample: candidates.slice(0, 8).map((c) => c.url) };

  const stats = { theme: themeKey, candidates: candidates.length, fetched: 0, stored: 0, skippedDup: 0, skippedFilter: 0, rejected: 0, errors: 0 };
  const fetchCap = limit * 8;

  for (const cand of candidates) {
    if (stats.stored >= limit) break;
    if (stats.fetched >= fetchCap) break;
    try {
      const fetched = await fetchBytes(cand.url);
      stats.fetched++;
      if (!fetched) { stats.errors++; continue; }
      const dims = imageDimensions(fetched.buf);
      if (!dims || dims.w < 600) { stats.skippedFilter++; continue; }
      const aspect = dims.w / dims.h;
      if (aspect < 0.8 || aspect > 2.0) { stats.skippedFilter++; continue; }

      const hash = await sha256Hex(fetched.buf);
      const existing = await base44.asServiceRole.entities.AssetArchive.filter({ content_hash: hash }, '-created_date', 1);
      if (existing && existing.length) { stats.skippedDup++; continue; }

      const mirroredUrl = await mirrorImage(base44, fetched.buf, fetched.ct);
      const imageUrl = mirroredUrl || cand.url;
      const mirrored = !!mirroredUrl;

      const analysis = await base44.asServiceRole.integrations.Core.InvokeLLM({
        model: 'gemini_3_flash',
        prompt: CURATOR_PROMPT,
        file_urls: [imageUrl],
        response_json_schema: ANALYSIS_SCHEMA,
      });

      if (analysis && analysis.is_relevant === false) { stats.rejected++; continue; }

      await base44.asServiceRole.entities.AssetArchive.create({
        content_hash: hash,
        source_url: cand.url,
        image_url: imageUrl,
        mirrored,
        primary_category: analysis?.primary_category || themeKey,
        description: analysis?.description || '',
        tags: analysis?.tags || [],
        mood: analysis?.mood || '',
        colors: analysis?.colors || [],
        is_relevant: analysis ? analysis.is_relevant !== false : true,
        quality_score: (() => { let qs = Number(analysis?.quality_score); if (!Number.isFinite(qs)) qs = 50; if (qs <= 1) qs *= 100; return Math.max(0, Math.min(100, Math.round(qs))); })(),
        width: dims.w,
        height: dims.h,
        theme: themeKey,
        source_type: cand.sourceType,
        status: 'active',
      });
      stats.stored++;
    } catch {
      stats.errors++;
    }
  }
  return stats;
}

// ─── Handler ────────────────────────────────────────────────────────────────
export default async function (req) {
  try {
    const base44 = createClientFromRequest(req);

    // Admin-only when invoked by a logged-in user; allow anonymous (scheduled workflow) calls.
    let hasUser = false;
    try {
      const user = await base44.auth.me();
      hasUser = !!user;
      if (user && user.role !== 'admin') return Response.json({ error: 'Admin only' }, { status: 403 });
    } catch { hasUser = false; }

    const body = await req.json().catch(() => ({}));
    const theme = String(body.theme || 'all').toLowerCase();
    const dryRun = !!body.dryRun;
    const webSearch = !!body.useWebSearch; // opt-in: deep web search is slow
    const isAll = theme === 'all';
    const limit = Math.max(1, Math.min(10, Number(body.limit) || (isAll ? 1 : 3)));

    if (dryRun) {
      if (isAll) {
        const out = {};
        for (const k of Object.keys(THEMES)) out[k] = await buildCandidates(base44, k, false).then((c) => ({ candidates: c.length, sample: c.slice(0, 5).map((x) => x.url) }));
        return Response.json({ dryRun: true, themes: out });
      }
      const candidates = await buildCandidates(base44, theme, webSearch);
      return Response.json({ dryRun: true, theme, candidates: candidates.length, sample: candidates.slice(0, 10).map((c) => c.url) });
    }

    // The scheduled "all" pass skips the slow web search — seeds + page scrape +
    // Instagram already yield plenty of candidates and keep the run fast.
    if (isAll) {
      const results = [];
      for (const k of Object.keys(THEMES)) results.push(await processTheme(base44, k, limit, false, false));
      return Response.json({ ok: true, theme: 'all', results });
    }
    if (!THEMES[theme]) return Response.json({ error: 'Unknown theme' }, { status: 400 });

    const stats = await processTheme(base44, theme, limit, false, webSearch);
    return Response.json({ ok: true, ...stats });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}