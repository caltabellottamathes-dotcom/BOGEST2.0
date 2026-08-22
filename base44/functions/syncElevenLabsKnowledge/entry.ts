import { createClientFromRequest } from 'npm:@base44/sdk@0.8.40';
import { secrets } from 'base44:runtime';

// Regenerates a single marked "live knowledge" block inside the ElevenLabs
// voice-agent prompt from the live Base44 entities (menu prices, opening hours,
// jobs, announcements) and PATCHes it back. The rest of the 93k prompt —
// including the navigation / guest-memory / language instruction blocks managed
// by syncElevenLabsAgent — is left untouched (we only replace our own marker).
//
// Idempotent: if the regenerated block is identical to what's already there,
// no PATCH is sent. Safe to run daily via a scheduled workflow.

const AGENT_ID = 'agent_6601kyn1xnn8ebm9m9ahk52ghmr5';
const BASE = 'https://api.elevenlabs.io/v1/convai/agents';
const MARKER = 'BOGEST_LIVE_KNOWLEDGE';

const CAT_ORDER = ['signature', 'starters', 'beef', 'masters', 'chicken', 'fish', 'veggie', 'pork', 'classics', 'sides', 'sauces', 'wines', 'beers', 'drinks', 'desserts', 'kids', 'seasonal'];
const CAT_LABEL = {
  signature: 'Signature', starters: 'Voorgerechten', beef: 'Runds — Grill', masters: 'Masters — Premium',
  chicken: 'Kip & Alternatieven', fish: 'Vis & Vegetarisch', veggie: 'Vegetarisch', pork: 'Varken',
  classics: 'Klassiekers', sides: 'Bijgerechten', sauces: 'Sauzen', wines: 'Wijnen', beers: 'Bieren',
  drinks: 'Dranken', desserts: 'Nagerechten', kids: 'Kinderen', seasonal: 'Seizoensgerechten',
};
const DAYS = ['maandag', 'dinsdag', 'woensdag', 'donderdag', 'vrijdag', 'zaterdag', 'zondag'];

function eur(n) {
  return '€' + Number(n).toFixed(2).replace('.', ',');
}

function buildBlock(data) {
  const lines = [];
  lines.push('LIVE DATA — AUTHORITATIEF. Overschrijft eerdere statische menu-, uren- en vacature-info in deze prompt. Spreek deze prijzen, uren en vacatures, niets anders.');

  if (data.menu.length) {
    lines.push('');
    lines.push('## MENU — live prijzen & beschikbaarheid');
    const byCat = {};
    for (const m of data.menu) (byCat[m.category] ||= []).push(m);
    for (const c of CAT_ORDER) {
      const items = byCat[c];
      if (!items || !items.length) continue;
      lines.push(`### ${CAT_LABEL[c] || c}`);
      for (const it of items) {
        const p = (it.price == null) ? 'inbegrepen in formule' : eur(it.price);
        let line = `- ${it.item_name} — ${p}`;
        if (it.is_popular) line += ' [populair]';
        if (it.is_new) line += ' [nieuw]';
        const locs = it.available_locations || [];
        if (Array.isArray(locs) && locs.length === 1) line += ` (enkel ${locs[0]})`;
        if (it.description) line += ` — ${it.description}`;
        lines.push(line);
      }
    }
  }

  if (data.hours.length) {
    lines.push('');
    lines.push('## OPENINGSUREN — live');
    const byLoc = {};
    for (const h of data.hours) {
      byLoc[h.location] ||= {};
      byLoc[h.location][h.day_index] = h;
    }
    for (const loc of Object.keys(byLoc)) {
      lines.push(`### ${loc}`);
      for (let d = 0; d < 7; d++) {
        const h = byLoc[loc][d];
        const txt = h && h.active !== false ? (h.hours_text || 'gesloten') : 'gesloten';
        lines.push(`- ${DAYS[d]}: ${txt}`);
      }
    }
  }

  if (data.jobs.length) {
    lines.push('');
    lines.push('## VACATURES — live');
    for (const j of data.jobs) {
      lines.push(`- ${j.title_nl} — ${j.location_name}${j.type_nl ? ` (${j.type_nl})` : ''}`);
    }
  }

  if (data.announcements.length) {
    lines.push('');
    lines.push('## MEDEDELINGEN — live');
    for (const a of data.announcements) {
      lines.push(`- ${a.title}: ${a.message}${a.link_label ? ` → ${a.link_label}` : ''}`);
    }
  }

  return `[${MARKER}]\n${lines.join('\n')}\n[${MARKER}_END]`;
}

function authHeaders() {
  const key = secrets.get('ELEVENLABS_API_KEY');
  if (!key) throw new Error('ELEVENLABS_API_KEY not set');
  return { 'xi-api-key': key, 'Content-Type': 'application/json' };
}

export default async function (req) {
  try {
    const base44 = createClientFromRequest(req);
    const body = await req.json().catch(() => ({}));
    const dry = !!(body && body.dry);
    const force = !!(body && body.force);

    // 1) Live data from the entities (service role — runs from a scheduled workflow without a user token).
    const sr = base44.asServiceRole.entities;
    const [menu, hours, jobs, annRaw] = await Promise.all([
      sr.MenuKnowledge.list('-sort_order', 500),
      sr.OpeningHours.list('location', 100),
      sr.Job.filter({ active: true }, 'sort_order', 200),
      sr.Announcement.filter({ active: true }, 'sort_order', 100),
    ]);

    // Date-window filtering for announcements (server time = UTC).
    const now = Date.now();
    const announcements = (annRaw || []).filter((a) => {
      const startOk = !a.start_date || new Date(a.start_date).getTime() <= now;
      const endOk = !a.end_date || new Date(a.end_date).getTime() >= now;
      return startOk && endOk;
    });

    const block = buildBlock({ menu: menu || [], hours: hours || [], jobs: jobs || [], announcements });

    if (dry) {
      return Response.json({
        dry: true,
        block,
        block_chars: block.length,
        counts: { menu: (menu || []).length, hours: (hours || []).length, jobs: (jobs || []).length, announcements: announcements.length },
      });
    }

    // 2) Fetch the current agent prompt.
    const getRes = await fetch(`${BASE}/${AGENT_ID}`, { headers: authHeaders() });
    if (!getRes.ok) {
      const txt = await getRes.text();
      return Response.json({ error: 'get_failed', status: getRes.status, detail: txt }, { status: 502 });
    }
    const agent = await getRes.json();
    const promptObj = agent?.conversation_config?.agent?.prompt;
    let current = typeof promptObj?.prompt === 'string' ? promptObj.prompt : '';

    // 3) Strip any previously-applied live-knowledge block (idempotent refresh), then re-append fresh.
    const kbRe = new RegExp('\\n*\\[' + MARKER + '\\][\\s\\S]*?\\[' + MARKER + '_END\\]\\n*', 'g');
    const stripped = current.replace(kbRe, '').trim();
    const next = stripped + '\n\n' + block;

    if (!force && next === current) {
      return Response.json({ ok: true, changed: false, reason: 'unchanged', block_chars: block.length });
    }

    // 4) Minimal-merge PATCH — only the prompt string, so tools / tool_ids / llm / temperature stay intact.
    const pRes = await fetch(`${BASE}/${AGENT_ID}`, {
      method: 'PATCH',
      headers: authHeaders(),
      body: JSON.stringify({ conversation_config: { agent: { prompt: { prompt: next } } } }),
    });
    if (!pRes.ok) {
      const txt = await pRes.text();
      return Response.json({ error: 'prompt_patch_failed', status: pRes.status, detail: txt }, { status: 502 });
    }

    return Response.json({
      ok: true,
      changed: true,
      forced: force,
      prompt_chars_before: current.length,
      prompt_chars_after: next.length,
      block_chars: block.length,
      counts: { menu: (menu || []).length, hours: (hours || []).length, jobs: (jobs || []).length, announcements: announcements.length },
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}