import { createClientFromRequest } from 'npm:@base44/sdk@0.8.40';
import { fetchBytes, sha256Hex, computePHash, hamming } from '../../shared/imageUtils.ts';

// Removes all duplicate images from the Bogèst visual archive in one pass.
// Recomputes BOTH the content hash and perceptual hash from the actual image
// bytes (so it works even on records that were imported before phash existed),
// then:
//   Phase 1 — exact duplicates: identical content_hash (SHA-256 of the bytes).
//   Phase 2 — near duplicates: perceptual hash within Hamming distance 10.
// In each group the highest-quality (then largest) record is kept as master;
// duplicates are deleted after merging their source_urls into the master.

const PHASH_THRESHOLD = 10;

function score(r) {
  return (Number(r.quality_score) || 0) + (Number(r.width) || 0) * (Number(r.height) || 0) / 100000;
}

function mergeSources(master, ...others) {
  const set = new Set();
  for (const u of master.source_urls || []) if (u) set.add(u);
  if (master.source_url) set.add(master.source_url);
  for (const o of others) {
    if (!o) continue;
    for (const u of o.source_urls || []) if (u) set.add(u);
    if (o.source_url) set.add(o.source_url);
  }
  return [...set];
}

export default async function (req) {
  try {
    const base44 = createClientFromRequest(req);

    // Admin gate — allow anonymous (scheduled) calls too.
    try {
      const user = await base44.auth.me();
      if (user && user.role !== 'admin') return Response.json({ error: 'Admin only' }, { status: 403 });
    } catch {}

    const all = await base44.asServiceRole.entities.AssetArchive.filter({}, '-created_date', 500);

    // Recompute fresh content_hash + phash for every record by fetching its image
    // (in parallel batches of 8 for speed). This is what makes perceptual dedup
    // actually work — previously phash was never stored because the decode libs
    // were missing, so visual duplicates were never caught.
    const recs = [];
    const BATCH = 8;
    for (let i = 0; i < all.length; i += BATCH) {
      const batch = all.slice(i, i + BATCH);
      const results = await Promise.all(batch.map(async (r) => {
        if (!r.image_url) return { r, hash: r.content_hash || '', phash: r.phash || '' };
        try {
          const fetched = await fetchBytes(r.image_url);
          if (!fetched) return { r, hash: r.content_hash || '', phash: r.phash || '' };
          const hash = await sha256Hex(fetched.buf);
          const phash = await computePHash(fetched.buf, fetched.ct);
          const update = {};
          if (phash && !r.phash) update.phash = phash;
          if (hash && !r.content_hash) update.content_hash = hash;
          if (Object.keys(update).length) { try { await base44.asServiceRole.entities.AssetArchive.update(r.id, update); } catch {} }
          return { r, hash, phash };
        } catch {
          return { r, hash: r.content_hash || '', phash: r.phash || '' };
        }
      }));
      recs.push(...results);
    }

    const deleted = new Set();
    let exactDupes = 0;
    let nearDupes = 0;

    // ── Phase 1: exact duplicates by content_hash ──────────────────────────
    const byHash = new Map();
    for (const x of recs) {
      if (!x.hash) continue;
      if (!byHash.has(x.hash)) byHash.set(x.hash, []);
      byHash.get(x.hash).push(x);
    }
    for (const group of byHash.values()) {
      if (group.length < 2) continue;
      group.sort((a, b) => score(b.r) - score(a.r));
      const master = group[0];
      const dups = group.slice(1);
      const srcs = mergeSources(master.r, ...dups.map((d) => d.r));
      for (const d of dups) {
        try {
          await base44.asServiceRole.entities.AssetArchive.delete(d.r.id);
          deleted.add(d.r.id);
          exactDupes++;
        } catch {}
      }
      try { await base44.asServiceRole.entities.AssetArchive.update(master.r.id, { source_urls: srcs }); } catch {}
    }

    // ── Phase 2: near duplicates by perceptual hash ───────────────────────
    const phashRecs = recs.filter((x) => x.phash && !deleted.has(x.r.id));
    for (let i = 0; i < phashRecs.length; i++) {
      if (deleted.has(phashRecs[i].r.id)) continue;
      for (let j = i + 1; j < phashRecs.length; j++) {
        if (deleted.has(phashRecs[j].r.id)) continue;
        if (hamming(phashRecs[i].phash, phashRecs[j].phash) > PHASH_THRESHOLD) continue;
        const a = phashRecs[i];
        const b = phashRecs[j];
        const loser = score(a.r) >= score(b.r) ? b : a;
        const winner = loser === a ? b : a;
        try {
          await base44.asServiceRole.entities.AssetArchive.update(winner.r.id, { source_urls: mergeSources(winner.r, loser.r) });
          await base44.asServiceRole.entities.AssetArchive.delete(loser.r.id);
          deleted.add(loser.r.id);
          nearDupes++;
        } catch {}
      }
    }

    return Response.json({
      ok: true,
      total: all.length,
      removed: deleted.size,
      exactDuplicates: exactDupes,
      nearDuplicates: nearDupes,
      remaining: all.length - deleted.size,
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}