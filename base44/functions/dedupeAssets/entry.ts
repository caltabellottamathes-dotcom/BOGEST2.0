import { createClientFromRequest } from 'npm:@base44/sdk@0.8.40';

// Removes all duplicate images from the Bogèst visual archive in one pass.
// Phase 1 — exact duplicates: identical content_hash (SHA-256 of the bytes).
// Phase 2 — near duplicates: perceptual hash (phash) within Hamming distance 8.
// In each group the record with the highest quality_score (then largest area) is
// kept as the master; duplicates are deleted after merging their source_urls
// into the master. Runs as the service role (admin-gated on the client side).

function hamming(a, b) {
  if (!a || !b || a.length !== b.length) return 99;
  let d = 0;
  for (let i = 0; i < a.length; i++) if (a[i] !== b[i]) d++;
  return d;
}

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
    const deleted = new Set();
    let exactDupes = 0;
    let nearDupes = 0;

    // ── Phase 1: exact duplicates by content_hash ──────────────────────────
    const byHash = new Map();
    for (const r of all) {
      if (!r.content_hash) continue;
      if (!byHash.has(r.content_hash)) byHash.set(r.content_hash, []);
      byHash.get(r.content_hash).push(r);
    }
    for (const group of byHash.values()) {
      if (group.length < 2) continue;
      group.sort((a, b) => score(b) - score(a));
      const master = group[0];
      const dups = group.slice(1);
      const srcs = mergeSources(master, ...dups);
      for (const d of dups) {
        try {
          await base44.asServiceRole.entities.AssetArchive.delete(d.id);
          deleted.add(d.id);
          exactDupes++;
        } catch {}
      }
      try { await base44.asServiceRole.entities.AssetArchive.update(master.id, { source_urls: srcs }); } catch {}
    }

    // ── Phase 2: near duplicates by perceptual hash ─────────────────────────
    const phashRecs = all.filter((r) => r.phash && !deleted.has(r.id));
    for (let i = 0; i < phashRecs.length; i++) {
      if (deleted.has(phashRecs[i].id)) continue;
      for (let j = i + 1; j < phashRecs.length; j++) {
        if (deleted.has(phashRecs[j].id)) continue;
        if (hamming(phashRecs[i].phash, phashRecs[j].phash) > 8) continue;
        const a = phashRecs[i];
        const b = phashRecs[j];
        const loser = score(a) >= score(b) ? b : a;
        const winner = loser === a ? b : a;
        try {
          await base44.asServiceRole.entities.AssetArchive.update(winner.id, { source_urls: mergeSources(winner, loser) });
          await base44.asServiceRole.entities.AssetArchive.delete(loser.id);
          deleted.add(loser.id);
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