import { createClientFromRequest } from 'npm:@base44/sdk@0.8.40';
import { secrets } from 'base44:runtime';

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

// Every image currently used on the Bogèst website (Squarespace CDN + curated
// Unsplash). Kickstart imports these first so the archive always mirrors the
// live site, then tops up with discovery.
const WEBSITE_IMAGES = [
  // Interiors
  `${CDN}/b7c2edca-9db5-43c2-b109-4cc33197dfbe/veranda+hasselt.jpeg`,
  `${CDN}/5baf9326-de7f-4a23-9273-dd46941a1b15/veranda+borgloon.jpeg`,
  `${CDN}/04917c77-6ebc-4470-83fb-a2abc637268b/zolder+veranda.jpeg`,
  `${CDN}/1756906798133-O44CER8WRTZ0YVM5E8TK/living.jpeg`,
  `${CDN}/1756906798126-DFOS1XY5Y0NOWCQVE23M/96368874_542981379699687_4859956873555607552_n.jpg`,
  `${CDN}/1756906798149-17KHS8RDD2FJIZI179ZQ/EF6D9D08-F3ED-41E2-9392-96AB73DEF2E6.jpeg`,
  `${CDN}/1756906798165-JY6MLWTWSAW9LSNQ1R89/2503F10C-6FB0-4FB4-9296-9E616D4559C3.jpeg`,
  `${CDN}/1756906798141-H0H195TOCA6WGBG9N8WA/IMG_4166.jpg`,
  `${CDN}/1756906798157-1KE555XAD515OGKMTL1M/IMG_5033.JPG`,
  `${CDN}/32f05da0-47c0-41c3-8beb-befced66a749/5D626C0A-F4F5-4B45-895D-E1D622FB21E2.jpeg`,
  // Beef & grilled
  `${CDN}/1756906798035-Y0LQXMVFSBJWWVXQG7ZI/filet+pur+.jpeg`,
  `${CDN}/1756906798060-BJGKYWMVJNFODKFB94TE/B4E94C22-3656-4874-A66B-CEA4D674F86D.jpeg`,
  `${CDN}/1756906799913-Y5ZEKPI4I2XXUTYC8W3T/d2db3621-8f9b-45f1-95c8-498c24ed15c3-1.jpg`,
  `${CDN}/1756906798084-QF5DJWQ3TUKX4AZR1JXU/278560265_1007469039884087_903507914175074104_n.jpg`,
  `${CDN}/1756906798020-1RKR6N8VGHSE1Z88BXP4/378389609_756558059816060_7208800625589654574_n.jpg`,
  `${CDN}/1756906798052-P24QWA3M58JWMGOWHVBD/399841843_793829846088881_1062638734165438461_n.jpg`,
  `${CDN}/1756906798104-DAH7YUC0MQMSXKX8D257/437846437_908368301301701_1295494183982636809_n.jpg`,
  `${CDN}/1756906798027-ZPXKAMZNVCSV6440QX6W/402597853_796945305777335_8211882432551808857_n.jpg`,
  `${CDN}/1756906793828-46U4HY2BWRCMXLZ9G2VW/313432687_792246775522672_788010508288086563_n.jpg`,
  // Pork / chicken / fish / veggie
  `${CDN}/1756906798068-Y30B7VANC5RKS6HTHGE9/tomapork.jpeg`,
  `${CDN}/1756906799922-SLXI4OSI7W3KWGKE3UFY/5a7c094c-9679-410a-bbc5-5f8c663d8a14.JPG`,
  `${CDN}/426ec0ed-f1b6-4eb0-90d5-ad7cea634e7c/7B0C379C-A65C-400B-83D7-C140E27E6ABF_1_201_a.jpeg`,
  `${CDN}/73cc2b2a-9419-4222-80ee-be10bc8bff62/69FCF8C3-2BD9-4D7C-9871-8E00EDE111A5.jpeg`,
  `${CDN}/2691085b-33a3-45ec-80b3-484d63c034d2/WhatsApp+Image+2026-06-09+at+14.13.49.jpeg`,
  // Starters / desserts / bar
  `${CDN}/1756906799926-VML5QXWO8V6D1NYAO2ZA/909af4c2-7392-4bbc-af18-2ea890714ecd-1.jpg`,
  `${CDN}/1756906793871-KBDPOQZVPFE4ORKRLGFS/402597853_796945305777335_8211882432551808857_n.jpg`,
  `${CDN}/1b9991fd-fc43-405b-acb6-a86317aaf9f1/5757bb8f-abdc-43e6-9219-e4e103f1a2e0.jpeg`,
  // Curated stock (Unsplash) for subjects Bogèst doesn't shoot itself
  'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=900&q=80',
  'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1400&q=80',
  'https://images.unsplash.com/photo-1558030006-450675393492?w=900&q=80',
  'https://images.unsplash.com/photo-1567206563064-6f60540aafc9?w=900&q=80',
];

// Broad public-web discovery queries — rotate a few per run so the archive
// keeps growing from review sites, blogs, news, travel & social without one
// giant slow pass.
const BROAD_QUERIES = [
  'Bogèst Hasselt restaurant photos TripAdvisor Restaurant Guru Google Maps review',
  'Bogèst Borgloon restaurant review blog photos food interior',
  'Bogèst Heusden-Zolder grillhouse photos press blog review',
  'Bogèst restaurant interior terrace veranda atmosphere images',
  'Bogèst steak grill dishes menu photography food blog Belgium',
  'Bogèst Hasselt Borgloon Heusden-Zolder opening event photos Limburg',
  'Bogèst restaurant staff guests dining atmosphere photos',
  'bogest.be restaurant photos news magazine Limburg Belgium',
];

// Public sources where most Bogèst photos live — site-scoped SerpApi
// google_images discovery. The auto pipeline runs these, dedups against the
// existing archive (content_hash + phash) and auto-imports ONLY new, unique,
// relevant photos — no manual review needed.
const AUTO_SITES = [
  { domain: 'tripadvisor.com', query: 'Bogèst', label: 'TripAdvisor' },
  { domain: 'instagram.com', query: 'bogest', label: 'Instagram' },
  { domain: 'facebook.com', query: 'bogesthasselt', label: 'Facebook Hasselt' },
  { domain: 'facebook.com', query: 'dentrecote', label: "Facebook d'Entrecote" },
  { domain: 'facebook.com', query: 'dentrecotezolder', label: 'Facebook Zolder' },
  { domain: 'bogest.be', query: '', label: 'bogest.be' },
  { domain: 'd-entrecote.be', query: '', label: 'd-entrecote.be' },
];

const CURATOR_PROMPT = `You are an expert brand curator for Bogèst, a premium Belgian grillhouse chain with locations in Hasselt, Borgloon and Heusden-Zolder. Analyze the attached image and:

1. Assign ONE OR MORE categories from this taxonomy, returning each as a "group/Sub" path (use the EXACT group and sub labels below). An image may belong to several categories — pick all that genuinely apply:
   Restaurant: Exterior, Building, Entrance, Terrace, Garden, Parking, Signage, Surroundings, Aerial Views
   Interior: Dining Room, Private Dining, Bar, Wine Cellar / Wine Display, Kitchen, Fireplace, Hallway, Waiting Area, Restrooms, Decoration, Furniture, Lighting, Flooring, Ceiling
   Food: Starters, Main Courses, Desserts, Cheese, Children's Dishes, Seasonal Specials, Tasting Menu
   Ingredients: Belgian Blue Beef, Beef, Pork, Chicken, Fish, Shellfish, Vegetarian, Vegan
   Drinks: Red Wine, White Wine, Rosé, Champagne, Cocktails, Beer, Coffee, Tea, Soft Drinks, Spirits
   Food Presentation: Close-up, Table Setting, Plating, Overhead View, Served at Table, Detail Shot
   People: Guests, Couples, Families, Groups, Children, Staff, Chef, Service Team, Owners, Team Photos
   Guest Experience: Hospitality, Dining, Celebration, Birthday, Anniversary, Romantic Dinner, Business Dinner, Toasting
   Atmosphere: Daytime, Sunset, Evening, Night, Candlelight, Cozy, Luxury, Rustic, Modern, Busy, Quiet
   Seasons: Spring, Summer, Autumn, Winter, Christmas, Easter, Valentine's Day, Mother's Day
   Events: Wine Tasting, Live Music, Corporate Event, Private Event, Press Event, Restaurant Opening
   Marketing: Professional Photography, Website, Social Media, Advertisement, Flyer, Press Photography
   Locations: Hasselt, Borgloon, Heusden-Zolder
   Source: Official Website, Google Maps, Tripadvisor, Instagram, Facebook, TikTok, Pinterest, Blog, News, Review Website
   Technical: Landscape, Portrait, Square, High Resolution, Watermarked, Smartphone, Professional Camera
   Quality: Hero Image, Website Ready, Print Ready, Social Media Ready, High Brand Consistency, Excellent Composition, Excellent Lighting, High Visual Quality
   Only add a Locations entry when the specific location is recognizable.
2. Infer the Bogèst location if recognizable (hasselt, borgloon, heusden-zolder), else "unknown".
3. Write a detailed description (1-2 sentences).
4. Generate UNLIMITED descriptive lowercase tags — as many meaningful tags as needed to accurately describe the image (e.g. belgian blue, steak, dessert, grilled, candlelight, elegant plating, fine dining, warm lighting, hospitality, wooden table, linen napkins, wine glass, outdoor dining, rustic, luxury, seasonal decoration). Do NOT limit the number.
5. Extract mood and dominant colors.
6. RELEVANCE — be strict and skeptical; do NOT assume the image is Bogèst just because it was searched. Set is_relevant=false for anything that is not clearly a real restaurant photograph: playgrounds, race tracks, amusement parks, sports, gyms, nature/landscapes, generic people, stock photos, other restaurants/brands, screenshots, text/logos, documents, or low-quality/blurry images. Set is_relevant=true only if the image clearly shows a restaurant interior, food/dishes/drinks/plating, or people dining/staff in a restaurant setting.
Return strict JSON.`;

const ANALYSIS_SCHEMA = {
  type: 'object',
  properties: {
    categories: { type: 'array', items: { type: 'string' }, description: 'Category paths "group/Sub" from the taxonomy' },
    location: { type: 'string', enum: ['hasselt', 'borgloon', 'heusden-zolder', 'unknown'] },
    description: { type: 'string' },
    tags: { type: 'array', items: { type: 'string' } },
    mood: { type: 'string' },
    colors: { type: 'array', items: { type: 'string' } },
    is_relevant: { type: 'boolean' },
    quality_score: { type: 'number' },
  },
  required: ['categories', 'description', 'is_relevant', 'quality_score'],
};

const RELEVANCE_PROMPT = `You are a strict gatekeeper for the Bogèst restaurant photo archive. Bogèst is a Belgian grillhouse / steakhouse restaurant with locations in Hasselt, Borgloon and Heusden-Zolder. It serves grilled meats, steaks, spare ribs, Belgian classics, wine and beer. It is a RESTAURANT ONLY — it does NOT have playgrounds, race tracks, amusement parks, bowling, arcades, sports facilities, pools or outdoor activities.

Look ONLY at the image (ignore any search context). Decide whether it could genuinely be a real photograph taken inside or of a Bogèst restaurant. Be conservative and skeptical — do NOT assume relevance.

Set is_relevant = TRUE only if the image clearly shows:
- A restaurant interior (dining room, bar, kitchen, terrace, veranda, tables, decoration)
- Restaurant food, dishes, drinks, plating or a table setting
- People dining, staff, chefs or guests socializing in a restaurant setting
- The exterior / building / signage of a Bogèst restaurant

Set is_relevant = FALSE for anything a restaurant would NOT have — playgrounds, indoor play structures, race tracks, go-karts, amusement parks, bowling, arcades, trampolines, sports, gyms, pools, nature/landscapes without the restaurant, generic people, models, stock photos, other restaurants/brands, screenshots, text/logo graphics, documents, or low-quality/blurry images.

Give a confidence score 0-100. Return strict JSON.`;

const RELEVANCE_SCHEMA = {
  type: 'object',
  properties: {
    is_relevant: { type: 'boolean' },
    confidence: { type: 'number' },
    reason: { type: 'string' },
  },
  required: ['is_relevant', 'confidence'],
};

// Strict Bogèst relevance gate. Fails open on API errors so the curator still runs.
async function verifyRelevance(base44, imageUrl) {
  try {
    const v = await base44.asServiceRole.integrations.Core.InvokeLLM({
      model: 'gemini_3_flash',
      prompt: RELEVANCE_PROMPT,
      file_urls: [imageUrl],
      response_json_schema: RELEVANCE_SCHEMA,
    });
    if (!v) return { relevant: true };
    const conf = Number(v.confidence);
    return { relevant: v.is_relevant === true && Number.isFinite(conf) && conf >= 65 };
  } catch {
    return { relevant: true };
  }
}

// SerpApi google_images helper — shared by targeted search and library fill.
async function serpImageSearch(query, apiKey, num) {
  try {
    const endpoint = 'https://serpapi.com/search?engine=google_images&q=' + encodeURIComponent(query) + '&api_key=' + encodeURIComponent(apiKey) + '&ijn=0';
    const res = await fetch(endpoint, { signal: AbortSignal.timeout(20000) });
    if (!res.ok) return [];
    const data = await res.json();
    if (data.error) return [];
    const out = [];
    for (const item of data.images_results || []) {
      const link = item.original;
      if (!link) continue;
      if (!/\.(jpg|jpeg|png|webp)(\?|$)/i.test(link)) continue;
      out.push(link);
      if (out.length >= num) break;
    }
    return out;
  } catch {
    return [];
  }
}

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
        // SOF segment: [length(2)][precision(1)][height(2)][width(2)] — i already points at length
        return { h: (b[i + 3] << 8) | b[i + 4], w: (b[i + 5] << 8) | b[i + 6] };
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

function hamming(a, b) {
  if (!a || !b || a.length !== b.length) return 99;
  let d = 0;
  for (let i = 0; i < a.length; i++) if (a[i] !== b[i]) d++;
  return d;
}

// Best-effort perceptual hash (8×8 average hash). Decodes JPEG via jpeg-js and
// PNG via upng-js when resolvable in the runtime; returns null otherwise (exact
// + dimension dedup still run, so near-dup gracefully degrades to exact-dup).
async function computePHash(buf, ct) {
  let data = null, w = 0, h = 0;
  try {
    if ((ct || '').includes('png')) {
      const mod = await import('npm:upng-js').catch(() => null);
      if (!mod) return null;
      const img = mod.decode(new Uint8Array(buf));
      const frames = mod.toRGBA8 ? mod.toRGBA8(img) : null;
      const bytes = frames ? frames[0] : (img.data || img);
      w = img.width; h = img.height;
      data = bytes instanceof Uint8Array ? bytes : new Uint8Array(bytes.buffer || bytes);
    } else {
      const mod = await import('npm:jpeg-js').catch(() => null);
      if (!mod) return null;
      const img = mod.decode(new Uint8Array(buf), { useTArray: true });
      w = img.width; h = img.height; data = img.data;
    }
  } catch {
    return null;
  }
  if (!data || !w || !h) return null;
  const cell = new Float32Array(64);
  const counts = new Float32Array(64);
  const xstep = w / 8, ystep = h / 8;
  for (let y = 0; y < h; y++) {
    const cy = Math.min(7, Math.floor(y / ystep));
    for (let x = 0; x < w; x++) {
      const cx = Math.min(7, Math.floor(x / xstep));
      const idx = (y * w + x) * 4;
      const g = 0.299 * data[idx] + 0.587 * data[idx + 1] + 0.114 * data[idx + 2];
      cell[cy * 8 + cx] += g;
      counts[cy * 8 + cx]++;
    }
  }
  let avg = 0;
  for (let i = 0; i < 64; i++) { cell[i] = counts[i] ? cell[i] / counts[i] : 0; avg += cell[i]; }
  avg /= 64;
  let bits = '';
  for (let i = 0; i < 64; i++) bits += cell[i] >= avg ? '1' : '0';
  return bits;
}

// Merge a duplicate source into the master record, preferring the highest-
// resolution version (re-mirror + update image_url when the new copy is larger).
async function mergeSource(base44, master, newUrl, newDims, fetched, newPHash) {
  try {
    const srcs = Array.isArray(master.source_urls) ? [...master.source_urls] : [master.source_url].filter(Boolean);
    if (newUrl && !srcs.includes(newUrl)) srcs.push(newUrl);
    const update = { source_urls: srcs };
    const newArea = (newDims.w || 0) * (newDims.h || 0);
    const oldArea = (master.width || 0) * (master.height || 0);
    if (fetched && newArea > oldArea) {
      const mirroredUrl = await mirrorImage(base44, fetched.buf, fetched.ct);
      if (mirroredUrl) { update.image_url = mirroredUrl; update.mirrored = true; update.width = newDims.w; update.height = newDims.h; }
    }
    if (newPHash && !master.phash) update.phash = newPHash;
    await base44.asServiceRole.entities.AssetArchive.update(master.id, update);
  } catch {}
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
  const push = (u, sourceType, query) => { if (u && !seen.has(u)) { seen.add(u); candidates.push({ url: u, sourceType, query: query || '', sourcePlatform: sourceType === 'instagram' ? 'Instagram' : 'Official Website' }); } };
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
      for (const img of res?.images || []) if (img.url) push(img.url, 'web', t.queries.join(', '));
    } catch {}
  }

  return candidates;
}

// Shared per-candidate pipeline (used by both per-theme discovery and the
// kickstart bulk import) — fetch → filter → dedup → mirror → analyze → store.
async function processCandidates(base44, candidates, limit, themeLabel) {
  const stats = { theme: themeLabel, candidates: candidates.length, fetched: 0, stored: 0, skippedDup: 0, skippedFilter: 0, rejected: 0, errors: 0 };
  const fetchCap = limit * 8;
  const VALID_LOCS = new Set(['hasselt', 'borgloon', 'heusden-zolder', 'unknown']);
  const PHASH_THRESHOLD = 8;

  // Load the archive ONCE for in-memory dedup — exact content hashes, perceptual
  // hashes (compared against the full archive, not just recent records) and all
  // known source URLs (so re-discovered links are skipped before even fetching).
  const existing = await base44.asServiceRole.entities.AssetArchive.filter({}, '-created_date', 500);
  const knownHashes = new Set();
  const knownPhashes = [];
  const knownUrls = new Set();
  for (const r of existing || []) {
    if (r.content_hash) knownHashes.add(r.content_hash);
    if (r.phash) knownPhashes.push({ id: r.id, phash: r.phash });
    if (r.source_url) knownUrls.add(r.source_url);
    if (r.image_url) knownUrls.add(r.image_url);
    for (const u of r.source_urls || []) knownUrls.add(u);
  }

  for (const cand of candidates) {
    if (stats.stored >= limit) break;
    if (stats.fetched >= fetchCap) break;
    // Skip URLs already in the archive — the biggest win against re-imports.
    if (knownUrls.has(cand.url)) { stats.skippedDup++; continue; }
    const trustedSource = cand.sourceType === 'seed' || cand.sourceType === 'instagram';
    try {
      const fetched = await fetchBytes(cand.url);
      stats.fetched++;
      if (!fetched) { stats.errors++; continue; }
      const dims = imageDimensions(fetched.buf);
      if (!dims || dims.w < 600) { stats.skippedFilter++; continue; }
      const aspect = dims.w / dims.h;
      if (aspect < 0.8 || aspect > 2.0) { stats.skippedFilter++; continue; }

      const hash = await sha256Hex(fetched.buf);
      if (knownHashes.has(hash)) { stats.skippedDup++; continue; }

      // Near-duplicate (perceptual hash) against the full archive.
      const phash = await computePHash(fetched.buf, fetched.ct);
      if (phash) {
        let bestD = 99, bestRec = null;
        for (const rec of knownPhashes) {
          const d = hamming(phash, rec.phash);
          if (d < bestD) { bestD = d; bestRec = rec; }
        }
        if (bestRec && bestD <= PHASH_THRESHOLD) {
          await mergeSource(base44, bestRec, cand.url, dims, fetched, phash);
          knownUrls.add(cand.url);
          if (!bestRec.phash) bestRec.phash = phash;
          stats.skippedDup++;
          continue;
        }
      }

      const mirroredUrl = await mirrorImage(base44, fetched.buf, fetched.ct);
      const imageUrl = mirroredUrl || cand.url;
      const mirrored = !!mirroredUrl;

      // Strict Bogèst relevance gate — the main defense against irrelevant
      // imports (playgrounds, race tracks, stock photos). Trusted seeds/Instagram
      // bypass it; discovered web images must pass.
      if (!trustedSource) {
        const gate = await verifyRelevance(base44, imageUrl);
        if (!gate.relevant) { stats.rejected++; continue; }
      }

      const analysis = await base44.asServiceRole.integrations.Core.InvokeLLM({
        model: 'gemini_3_flash',
        prompt: CURATOR_PROMPT,
        file_urls: [imageUrl],
        response_json_schema: ANALYSIS_SCHEMA,
      });

      if (analysis && analysis.is_relevant === false) { stats.rejected++; continue; }

      const loc = String(analysis?.location || 'unknown').toLowerCase();
      const cats = Array.isArray(analysis?.categories) ? analysis.categories.map((c) => String(c)).filter(Boolean) : [];
      const legacyCat = (() => {
        const has = (g) => cats.some((c) => c.startsWith(g + '/'));
        if (has('food') || has('ingredients') || has('drinks') || has('presentation')) return 'gastronomy';
        if (has('restaurant') || has('interior') || has('locations')) return 'interiors';
        if (has('atmosphere') || has('experience') || has('people') || has('seasons')) return 'atmosphere';
        return 'branding';
      })();
      const orientation = dims ? (dims.w / dims.h > 1.15 ? 'landscape' : dims.w / dims.h < 0.87 ? 'portrait' : 'square') : 'unknown';
      const created = await base44.asServiceRole.entities.AssetArchive.create({
        content_hash: hash,
        source_url: cand.url,
        source_urls: [cand.url],
        image_url: imageUrl,
        mirrored,
        categories: cats,
        primary_category: legacyCat,
        subcategory: '',
        orientation,
        source_platform: cand.sourcePlatform || '',
        location: VALID_LOCS.has(loc) ? loc : 'unknown',
        description: analysis?.description || '',
        tags: analysis?.tags || [],
        mood: analysis?.mood || '',
        colors: analysis?.colors || [],
        is_relevant: analysis ? analysis.is_relevant !== false : true,
        quality_score: (() => { let qs = Number(analysis?.quality_score); if (!Number.isFinite(qs)) qs = 50; if (qs <= 1) qs *= 100; return Math.max(0, Math.min(100, Math.round(qs))); })(),
        width: dims.w,
        height: dims.h,
        theme: themeLabel,
        source_type: cand.sourceType,
        search_query: cand.query || '',
        phash: phash || '',
        status: 'active',
      });
      knownHashes.add(hash);
      knownUrls.add(cand.url);
      if (phash && created?.id) knownPhashes.push({ id: created.id, phash });
      stats.stored++;
    } catch {
      stats.errors++;
    }
  }
  return stats;
}

async function processTheme(base44, themeKey, limit, dryRun, webSearch = false) {
  const candidates = await buildCandidates(base44, themeKey, webSearch);
  if (dryRun) return { theme: themeKey, candidates: candidates.length, sample: candidates.slice(0, 8).map((c) => c.url) };
  return await processCandidates(base44, candidates, limit, themeKey);
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

    // Kickstart — one big, thorough fill: import every image currently used on
    // the website + all known seeds + Instagram, then categorize. No slow web
    // search (the site's own photos already give a full, reliable archive).
    if (body.kickstart) {
      const seen = new Set();
      const cands = [];
      const push = (url, sourceType) => { if (url && !seen.has(url)) { seen.add(url); cands.push({ url, sourceType, sourcePlatform: sourceType === 'instagram' ? 'Instagram' : 'Official Website' }); } };
      for (const u of WEBSITE_IMAGES) push(u, 'seed');
      for (const k of Object.keys(THEMES)) for (const u of THEMES[k].seed) push(u, 'seed');
      try {
        const posts = await base44.asServiceRole.entities.InstagramPost.list('-posted_at', 50);
        for (const p of posts || []) if (p.media_url) push(p.media_url, 'instagram');
      } catch {}
      const limit = Math.max(1, Math.min(40, Number(body.limit) || 15));
      const stats = await processCandidates(base44, cands, limit, 'kickstart');
      return Response.json({ ok: true, kickstart: true, ...stats });
    }

    // ─── One comprehensive discovery pass ───────────────────────────────────
    // Crawls every bogest.be page (via the sitemap), scrapes the three Bogèst
    // Tripadvisor review pages, pulls Facebook / d-entrecote / Tripadvisor images
    // via SerpApi site-scoped search, and imports all known seeds + Instagram —
    // all through the shared dedup + relevance-gate pipeline. One button, all
    // images that really belong to Bogèst.
    if (body.discoverAll) {
      const apiKey = secrets.get('SERPAPI_API_KEY');
      const seen = new Set();
      const cands = [];
      const push = (url, sourceType, platform) => { if (url && !seen.has(url)) { seen.add(url); cands.push({ url, sourceType, sourcePlatform: platform || '', query: '' }); } };

      // Known website images + theme seeds (trusted — skip relevance gate)
      for (const u of WEBSITE_IMAGES) push(u, 'seed', 'Official Website');
      for (const k of Object.keys(THEMES)) for (const u of THEMES[k].seed) push(u, 'seed', 'Official Website');

      // Instagram posts already synced into the DB (trusted)
      try {
        const posts = await base44.asServiceRole.entities.InstagramPost.list('-posted_at', 50);
        for (const p of posts || []) if (p.media_url) push(p.media_url, 'instagram', 'Instagram');
      } catch {}

      // bogest.be — crawl the sitemap, then scrape every page for its images
      try {
        const smRes = await fetch('https://www.bogest.be/sitemap.xml', { signal: AbortSignal.timeout(15000), redirect: 'follow' });
        if (smRes.ok) {
          const xml = await smRes.text();
          const locs = [...xml.matchAll(/<loc>([^<]+)<\/loc>/gi)].map((m) => m[1]).filter((u) => u.includes('bogest.be') && !/\.(jpg|jpeg|png|webp|pdf)$/i.test(u));
          for (const page of locs.slice(0, 40)) {
            try {
              const res = await fetch(page, { headers: { 'User-Agent': 'BogestAssetArchive/1.0' }, signal: AbortSignal.timeout(12000), redirect: 'follow' });
              if (!res.ok) continue;
              const html = await res.text();
              for (const u of extractImgUrls(html, page)) {
                if (u.includes('squarespace-cdn') || /\.(jpg|jpeg|png|webp)(\?|$)/i.test(u)) push(u, 'seed', 'Official Website');
              }
            } catch {}
          }
        }
      } catch {}
      // Key pages directly, in case the sitemap is unavailable
      for (const page of ['https://www.bogest.be', 'https://www.bogest.be/menu', 'https://www.bogest.be/ons-verhaal']) {
        try {
          const res = await fetch(page, { headers: { 'User-Agent': 'BogestAssetArchive/1.0' }, signal: AbortSignal.timeout(12000), redirect: 'follow' });
          if (!res.ok) continue;
          const html = await res.text();
          for (const u of extractImgUrls(html, page)) {
            if (u.includes('squarespace-cdn') || /\.(jpg|jpeg|png|webp)(\?|$)/i.test(u)) push(u, 'seed', 'Official Website');
          }
        } catch {}
      }

      // Tripadvisor review pages (Borgloon, Hasselt/Wimmertingen, Heusden-Zolder)
      const TRIP_PAGES = [
        'https://www.tripadvisor.be/Restaurant_Review-g644058-d8568810-Reviews-D_Entrecote_Borgloon-Borgloon_Limburg_Province.html',
        'https://www.tripadvisor.be/Restaurant_Review-g15608563-d15605677-Reviews-D_Entrecote-Wimmertingen_Limburg_Province.html',
        'https://www.tripadvisor.be/Restaurant_Review-g641787-d26730531-Reviews-Bogest_Heusden_zolder-Heusden_Zolder_Limburg_Province.html',
      ];
      for (const page of TRIP_PAGES) {
        try {
          const res = await fetch(page, { headers: { 'User-Agent': 'Mozilla/5.0 (compatible; BogestAssetArchive/1.0)' }, signal: AbortSignal.timeout(15000), redirect: 'follow' });
          if (!res.ok) continue;
          const html = await res.text();
          for (const u of extractImgUrls(html, page)) {
            if (u.includes('tripadvisor') || u.includes('media-cdn') || /\.(jpg|jpeg|png|webp)(\?|$)/i.test(u)) push(u, 'web', 'Tripadvisor');
          }
          const re = /https?:\/\/[a-z0-9.-]*tripadvisor[a-z0-9.\-/_]*\.(?:jpg|jpeg|png|webp)/gi;
          let m;
          while ((m = re.exec(html))) push(m[0], 'web', 'Tripadvisor');
        } catch {}
      }

      // SerpApi site-scoped image search for the remaining Bogèst channels
      if (apiKey) {
        const SERP = [
          { q: 'site:facebook.com bogesthasselt', label: 'Facebook Hasselt' },
          { q: 'site:facebook.com bogestborgloon', label: 'Facebook Borgloon' },
          { q: 'site:facebook.com bogest_heusdenzolder', label: 'Facebook Heusden-Zolder' },
          { q: 'site:facebook.com dentrecote', label: "Facebook d'Entrecote" },
          { q: 'site:d-entrecote.be', label: 'd-entrecote.be' },
          { q: 'site:tripadvisor.be bogest', label: 'Tripadvisor Bogèst' },
          { q: "site:tripadvisor.be d'entrecote", label: "Tripadvisor d'Entrecote" },
          { q: 'site:bogest.be', label: 'bogest.be' },
        ];
        for (const s of SERP) {
          try {
            const endpoint = 'https://serpapi.com/search?engine=google_images&q=' + encodeURIComponent(s.q) + '&api_key=' + encodeURIComponent(apiKey) + '&ijn=0';
            const res = await fetch(endpoint, { signal: AbortSignal.timeout(20000) });
            if (!res.ok) continue;
            const data = await res.json();
            if (data.error) continue;
            for (const item of data.images_results || []) {
              const link = item.original;
              if (!link) continue;
              if (!/\.(jpg|jpeg|png|webp)(\?|$)/i.test(link)) continue;
              push(link, 'web', s.label);
            }
          } catch {}
        }
      }

      const limit = Math.max(1, Math.min(40, Number(body.limit) || 25));
      const stats = await processCandidates(base44, cands, limit, 'discover-all');
      return Response.json({ ok: true, discoverAll: true, candidates: cands.length, ...stats });
    }

    // ─── Targeted topic discovery ───────────────────────────────────────────
    // One focused search on a subject (e.g. "wijn", "terras", "steak",
    // " Borgloon interieur") across Bogèst's own site + the public review/social
    // channels via SerpApi google_images. Same dedup + relevance pipeline.
    if (body.topic) {
      const apiKey = secrets.get('SERPAPI_API_KEY');
      const topic = String(body.topic).trim();
      if (!topic) return Response.json({ error: 'Empty topic' }, { status: 400 });
      const queries = [
        `bogest ${topic}`,
        `site:bogest.be ${topic}`,
        `site:tripadvisor.be bogest ${topic}`,
        `site:facebook.com bogest ${topic}`,
        `site:d-entrecote.be ${topic}`,
      ];
      const seen = new Set();
      const cands = [];
      for (const q of queries) {
        const links = apiKey ? await serpImageSearch(q, apiKey, 12) : [];
        for (const u of links) {
          if (seen.has(u)) continue;
          seen.add(u);
          cands.push({ url: u, sourceType: 'web', query: q, sourcePlatform: 'Topic' });
        }
      }
      const limit = Math.max(1, Math.min(40, Number(body.limit) || 15));
      const stats = await processCandidates(base44, cands, limit, 'topic:' + topic);
      return Response.json({ ok: true, topic, candidates: cands.length, ...stats });
    }

    // Broad public-web discovery — gemini web search across review sites, blogs,
    // news, travel & social. Rotates a few queries per run so each pass stays
    // fast while the archive keeps growing from new public sources over time.
    if (body.web) {
      // One query per run keeps the pass fast & reliable; rotation cycles the full
      // query set across days so the archive keeps growing from new sources.
      const qCount = 1;
      const dayIdx = Math.floor(Date.now() / 86400000) % BROAD_QUERIES.length;
      const queries = [];
      for (let i = 0; i < qCount; i++) queries.push(BROAD_QUERIES[(dayIdx + i) % BROAD_QUERIES.length]);
      const seen = new Set();
      const cands = [];
      for (const q of queries) {
        try {
          const res = await base44.asServiceRole.integrations.Core.InvokeLLM({
            model: 'gemini_3_flash',
            add_context_from_internet: true,
            prompt: `Search the public web for photographs of the Bogèst restaurant chain (bogest.be, Hasselt / Borgloon / Heusden-Zolder, Belgium). Query: "${q}". Return JSON { "images": [ { "url": "<direct, publicly accessible, high-resolution image URL ending in .jpg/.jpeg/.png/.webp or a CDN image link>", "source": "<page where found>" } ] } — up to 12 REAL image URLs only. Never invent URLs; if unsure, return fewer.`,
            response_json_schema: { type: 'object', properties: { images: { type: 'array', items: { type: 'object', properties: { url: { type: 'string' }, source: { type: 'string' } } } } } },
          });
          for (const img of res?.images || []) {
            if (img.url && !seen.has(img.url)) { seen.add(img.url); cands.push({ url: img.url, sourceType: 'web', query: q }); }
          }
        } catch {}
      }
      const limit = Math.max(1, Math.min(15, Number(body.limit) || 8));
      const stats = await processCandidates(base44, cands, limit, 'web');
      return Response.json({ ok: true, web: true, queries, ...stats });
    }

    // Automatic site-scoped discovery (SerpApi google_images) across the public
    // sources where most Bogèst photos live (TripAdvisor, Instagram, Facebook
    // per page, bogest.be, d-entrecote.be). Dedup (content_hash + phash) + vision
    // filter + auto-import ONLY new, unique, relevant photos — fully automatic,
    // no manual selection. Reuses processCandidates so dedup/merge is identical
    // to the rest of the archive.
    if (body.auto) {
      const apiKey = secrets.get('SERPAPI_API_KEY');
      if (!apiKey) return Response.json({ error: 'SERPAPI_API_KEY not configured' }, { status: 500 });
      const seen = new Set();
      const cands = [];
      const perSite = Math.max(1, Math.min(20, Number(body.limit) || 8));
      const cap = perSite * AUTO_SITES.length;
      for (const s of AUTO_SITES) {
        try {
          const q = s.query ? `site:${s.domain} ${s.query}` : `site:${s.domain}`;
          const endpoint = 'https://serpapi.com/search'
            + '?engine=google_images'
            + '&q=' + encodeURIComponent(q)
            + '&api_key=' + encodeURIComponent(apiKey)
            + '&ijn=0';
          const res = await fetch(endpoint, { signal: AbortSignal.timeout(20000) });
          if (!res.ok) continue;
          const data = await res.json();
          if (data.error) continue;
          for (const item of data.images_results || []) {
            const link = item.original;
            if (!link) continue;
            if (!/\.(jpg|jpeg|png)(\?|$)/i.test(link)) continue;
            if (seen.has(link)) continue;
            seen.add(link);
            cands.push({ url: link, sourceType: 'web', query: s.label || s.domain, sourcePlatform: s.label });
            if (cands.length >= cap) break;
          }
        } catch {}
      }
      const limit = Math.max(1, Math.min(30, Number(body.limit) || 10));
      const stats = await processCandidates(base44, cands, limit, 'web');
      return Response.json({ ok: true, auto: true, sites: AUTO_SITES.length, candidates: cands.length, ...stats });
    }

    // Library fill via SerpApi — broad Bogèst queries, same engine as targeted
    // search. Dedup + relevance gate + auto-import via the shared pipeline.
    if (body.fill) {
      const apiKey = secrets.get('SERPAPI_API_KEY');
      if (!apiKey) return Response.json({ error: 'SERPAPI_API_KEY not configured' }, { status: 500 });
      const FILL_QUERIES = [
        'Bogèst restaurant Hasselt', 'Bogèst restaurant Borgloon', 'Bogèst restaurant Heusden-Zolder',
        'Bogèst grillhouse interior', 'Bogèst steak dishes', 'Bogèst restaurant food',
        'Bogèst terras veranda', 'Bogèst restaurant Belgium',
      ];
      const seen = new Set();
      const cands = [];
      for (const q of FILL_QUERIES) {
        const links = await serpImageSearch(q, apiKey, 10);
        for (const u of links) if (!seen.has(u)) { seen.add(u); cands.push({ url: u, sourceType: 'web', query: q, sourcePlatform: 'SerpApi' }); }
      }
      const limit = Math.max(1, Math.min(40, Number(body.limit) || 15));
      const stats = await processCandidates(base44, cands, limit, 'fill');
      return Response.json({ ok: true, fill: true, candidates: cands.length, ...stats });
    }

    // Targeted SerpApi search — a free-text query (category / tag based) → import.
    if (body.serpQuery) {
      const apiKey = secrets.get('SERPAPI_API_KEY');
      if (!apiKey) return Response.json({ error: 'SERPAPI_API_KEY not configured' }, { status: 500 });
      const q = String(body.serpQuery || '').trim();
      if (!q) return Response.json({ error: 'Empty query' }, { status: 400 });
      const num = Math.max(1, Math.min(30, Number(body.num) || 12));
      const links = await serpImageSearch(q, apiKey, num);
      const cands = links.map((u) => ({ url: u, sourceType: 'web', query: q, sourcePlatform: 'SerpApi' }));
      const limit = Math.max(1, Math.min(20, Number(body.limit) || 8));
      const stats = await processCandidates(base44, cands, limit, 'serp');
      return Response.json({ ok: true, serpQuery: q, candidates: cands.length, ...stats });
    }

    // Import a specific list of image URLs (e.g. from Google Custom Search) →
    // mirror + classify + dedup via the same pipeline as discovery.
    if (Array.isArray(body.importUrls) && body.importUrls.length) {
      const cands = body.importUrls.map((u) => ({ url: String(u), sourceType: 'web', query: 'google-cse' }));
      const limit = Math.max(1, Math.min(20, body.importUrls.length));
      const stats = await processCandidates(base44, cands, limit, 'google');
      return Response.json({ ok: true, import: true, ...stats });
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