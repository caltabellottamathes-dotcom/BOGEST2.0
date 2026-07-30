// Shared image helpers for the Bogèst visual archive — byte fetching, SHA-256
// content hashing, dimension parsing, and an 8×8 average perceptual hash.
// Used by discovery (discoverAssets) and dedup (dedupeAssets) so both compute
// hashes identically.

export async function fetchBytes(url) {
  const res = await fetch(url, {
    headers: { 'User-Agent': 'BogestAssetArchive/1.0 (+https://bogest.be)' },
    signal: AbortSignal.timeout(20000),
    redirect: 'follow',
  });
  if (!res.ok) return null;
  const ct = (res.headers.get('content-type') || '').toLowerCase();
  if (!ct.startsWith('image/')) {
    if (!/\.(jpg|jpeg|png|webp|gif)(\?|$)/i.test(url)) return null;
  }
  const buf = await res.arrayBuffer();
  return { buf, ct: ct || 'image/jpeg' };
}

export async function sha256Hex(buf) {
  const digest = await crypto.subtle.digest('SHA-256', buf);
  return Array.from(new Uint8Array(digest)).map((x) => x.toString(16).padStart(2, '0')).join('');
}

export function hamming(a, b) {
  if (!a || !b || a.length !== b.length) return 99;
  let d = 0;
  for (let i = 0; i < a.length; i++) if (a[i] !== b[i]) d++;
  return d;
}

export function imageDimensions(buf) {
  const b = new Uint8Array(buf);
  if (b.length < 24) return null;
  if (b[0] === 0x89 && b[1] === 0x50 && b[2] === 0x4e && b[3] === 0x47) {
    return { w: (b[16] << 24) | (b[17] << 16) | (b[18] << 8) | b[19], h: (b[20] << 24) | (b[21] << 16) | (b[22] << 8) | b[23] };
  }
  if (b[0] === 0x47 && b[1] === 0x49 && b[2] === 0x46) {
    return { w: b[6] | (b[7] << 8), h: b[8] | (b[9] << 8) };
  }
  if (b[0] === 0xff && b[1] === 0xd8) {
    let i = 2;
    while (i < b.length - 9) {
      if (b[i] !== 0xff) { i++; continue; }
      const marker = b[i + 1];
      i += 2;
      if (marker >= 0xc0 && marker <= 0xcf && marker !== 0xc4 && marker !== 0xc8 && marker !== 0xcc) {
        return { h: (b[i + 3] << 8) | b[i + 4], w: (b[i + 5] << 8) | b[i + 6] };
      }
      const len = (b[i] << 8) | b[i + 1];
      i += len;
    }
    return null;
  }
  if (b[0] === 0x52 && b[8] === 0x57 && b[9] === 0x45 && b[10] === 0x42 && b[11] === 0x50) {
    const fourcc = String.fromCharCode(b[12], b[13], b[14], b[15]);
    if (fourcc === 'VP8 ') return { w: (b[26] | (b[27] << 8)) & 0x3fff, h: (b[28] | (b[29] << 8)) & 0x3fff };
    if (fourcc === 'VP8L') { const v = b[21] | (b[22] << 8) | (b[23] << 16) | (b[24] << 24); return { w: (v & 0x3fff) + 1, h: ((v >> 14) & 0x3fff) + 1 }; }
    if (fourcc === 'VP8X') return { w: (b[24] | (b[25] << 8) | (b[26] << 16)) + 1, h: (b[27] | (b[28] << 8) | (b[29] << 16)) + 1 };
  }
  return null;
}

// 8×8 average perceptual hash. Decodes JPEG via jpeg-js and PNG via upng-js
// (now installed); returns null if the image can't be decoded.
export async function computePHash(buf, ct) {
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