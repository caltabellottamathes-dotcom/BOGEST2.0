import { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { base44 } from '@/api/base44Client';

const SLUGS = [
  { value: 'hasselt', label: 'Hasselt' },
  { value: 'borgloon', label: 'Borgloon' },
  { value: 'heusden-zolder', label: 'Heusden-Zolder' },
];

function emptyJob(sort_order) {
  return {
    title_nl: '', title_fr: '', title_en: '',
    location_name: '', location_slug: 'hasselt',
    type_nl: '', type_fr: '', type_en: '',
    desc_nl: '', desc_fr: '', desc_en: '',
    apply_email: '', apply_phone: '', walk_in: '',
    full_text_nl: '', full_text_fr: '', full_text_en: '',
    sort_order, active: true,
  };
}

// Vertaal de Nederlandse velden automatisch naar Frans en Engels via de LLM,
// zodat de admin alleen de Nederlandse tekst hoeft in te vullen.
async function translateJob(job) {
  const fields = ['title', 'type', 'desc', 'full_text'];
  const source = {};
  fields.forEach((f) => { source[f] = (job[`${f}_nl`] || '').trim(); });
  // Alles al ingevuld in FR/EN? Dan hoeven we niet te vertalen.
  const allFrFilled = fields.every((f) => (job[`${f}_fr`] || '').trim());
  const allEnFilled = fields.every((f) => (job[`${f}_en`] || '').trim());
  if (allFrFilled && allEnFilled) return job;

  const res = await base44.integrations.Core.InvokeLLM({
    prompt:
      `Je bent een professionele vertaler voor een restaurant (Bogèst, een Limburgse grillbrasserie). ` +
      `Vertaal de volgende Nederlandse vacature-velden naar het Frans en Engels. ` +
      `Behoud toon, opmaak (witregels, streepjes "—") en betekenis. Geef uitsluitend JSON terug.\n\n` +
      `Nederlands:\n${JSON.stringify(source, null, 2)}`,
    response_json_schema: {
      type: 'object',
      properties: {
        fr: { type: 'object', properties: { title: { type: 'string' }, type: { type: 'string' }, desc: { type: 'string' }, full_text: { type: 'string' } } },
        en: { type: 'object', properties: { title: { type: 'string' }, type: { type: 'string' }, desc: { type: 'string' }, full_text: { type: 'string' } } },
      },
    },
    model: 'gpt_5_mini',
  });

  const out = { ...job };
  fields.forEach((f) => {
    if (!out[`${f}_fr`]) out[`${f}_fr`] = res?.fr?.[f] || source[f] || '';
    if (!out[`${f}_en`]) out[`${f}_en`] = res?.en?.[f] || source[f] || '';
  });
  return out;
}

// Beheer de vacatures. De admin vult alleen de Nederlandse velden in; bij het
// opslaan worden deze automatisch naar het Frans en Engels vertaald.
export default function VacaturesBeheer() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openKey, setOpenKey] = useState(null);
  const [savingKey, setSavingKey] = useState(null);
  const [err, setErr] = useState('');

  const load = async () => {
    setLoading(true);
    try {
      const rows = await base44.entities.Job.list('sort_order', 100);
      setJobs(rows || []);
    } catch {}
    setLoading(false);
  };
  useEffect(() => { load(); }, []);

  const keyOf = (job, idx) => job.id || `new-${idx}`;

  const update = (job, patch) => setJobs(prev => prev.map(j => (j === job ? { ...j, ...patch } : j)));

  const addNew = () => {
    const next = (jobs.length ? Math.max(...jobs.map(x => x.sort_order || 0)) : 0) + 1;
    const j = emptyJob(next);
    setJobs(prev => [...prev, j]);
    setOpenKey(`new-${jobs.length}`);
  };

  const save = async (job) => {
    const k = jobs.indexOf(job);
    setSavingKey(k);
    setErr('');
    try {
      const translated = await translateJob(job);
      // reflect translations in local state
      setJobs(prev => prev.map(j => (j === job ? translated : j)));
      if (job.id) {
        await base44.entities.Job.update(job.id, translated);
      } else {
        await base44.entities.Job.create(translated);
      }
      await load();
      setOpenKey(null);
    } catch (e) {
      setErr('Opslaan mislukt: ' + (e?.message || 'vertaling of opslag faalde'));
    }
    setSavingKey(null);
  };

  const remove = async (job) => {
    if (!job.id) { setJobs(prev => prev.filter(j => j !== job)); return; }
    try { await base44.entities.Job.delete(job.id); await load(); } catch {}
  };

  return (
    <div className="pt-8 md:pt-10 pb-20 px-6 md:px-10 lg:px-16">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-4">
          <div>
            <span className="font-body text-[10px] tracking-[0.35em] uppercase text-primary block mb-2">Bogèst · Beheer</span>
            <h1 className="font-heading text-3xl md:text-4xl font-bold text-foreground">Vacatures</h1>
          </div>
          <button onClick={addNew} className="px-4 py-2 rounded-full bg-primary text-primary-foreground font-body text-xs tracking-widest uppercase hover:bg-primary/90">+ Nieuw</button>
        </div>
        <p className="font-body text-xs text-muted-foreground mb-6">Vul alleen de Nederlandse tekst in — bij opslaan worden de Franse en Engelse versies automatisch vertaald.</p>

        {err && <p className="font-body text-sm text-destructive mb-4">{err}</p>}

        {loading ? (
          <p className="font-body text-sm text-muted-foreground">Laden…</p>
        ) : jobs.length === 0 ? (
          <p className="font-body text-sm text-muted-foreground">Nog geen vacatures. Voeg er een toe — de site toont ze direct.</p>
        ) : (
          <div className="space-y-3">
            {jobs.map((job, idx) => {
              const k = keyOf(job, idx);
              const open = openKey === k;
              const saving = savingKey === idx;
              return (
                <div key={k} className="rounded-2xl border border-border bg-card/40">
                  <button onClick={() => setOpenKey(open ? null : k)} className="w-full text-left p-4 flex items-center justify-between gap-3">
                    <span className="font-heading text-base font-semibold text-foreground">{job.title_nl || '(naamloos)'}</span>
                    <span className="font-body text-xs text-muted-foreground text-right">{job.location_name} · {job.type_nl}</span>
                  </button>
                  {open && (
                    <div className="p-4 pt-0 border-t border-border/50 space-y-3">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <Labeled label="Titel (NL)" value={job.title_nl || ''} onChange={v => update(job, { title_nl: v })} />
                        <Labeled label="Vestiging (naam)" value={job.location_name || ''} onChange={v => update(job, { location_name: v })} />
                        <Labeled label="Type (NL)" value={job.type_nl || ''} onChange={v => update(job, { type_nl: v })} />
                        <SelectLabeled label="Vestiging (slug)" value={job.location_slug || 'hasselt'} options={SLUGS} onChange={v => update(job, { location_slug: v })} />
                        <Labeled label="Sollicitatie-e-mail" value={job.apply_email || ''} onChange={v => update(job, { apply_email: v })} />
                        <Labeled label="Sollicitatie-telefoon" value={job.apply_phone || ''} onChange={v => update(job, { apply_phone: v })} />
                        <Labeled label="Langskomen — vraag naar" value={job.walk_in || ''} onChange={v => update(job, { walk_in: v })} />
                        <Labeled label="Volgorde" value={String(job.sort_order ?? 0)} onChange={v => update(job, { sort_order: Number(v) || 0 })} />
                      </div>
                      <Labeled label="Korte beschrijving (NL)" value={job.desc_nl || ''} onChange={v => update(job, { desc_nl: v })} />
                      <label className="block">
                        <span className="font-body text-xs text-muted-foreground">Volledige tekst (NL)</span>
                        <textarea value={job.full_text_nl || ''} onChange={e => update(job, { full_text_nl: e.target.value })} rows={10} className="bogest-input mt-1 font-body" />
                      </label>
                      <div className="flex items-center gap-3 pt-1">
                        <button onClick={() => save(job)} disabled={saving} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary text-primary-foreground font-body text-xs tracking-widest uppercase hover:bg-primary/90 disabled:opacity-40">
                          {saving && <Loader2 className="w-3.5 h-3.5 animate-spin" />}{saving ? 'Vertalen & opslaan…' : 'Opslaan'}
                        </button>
                        <button onClick={() => remove(job)} className="px-4 py-2 rounded-full border border-border font-body text-xs tracking-widest uppercase text-muted-foreground hover:text-destructive">Verwijderen</button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

function Labeled({ label, value, onChange }) {
  return (
    <label className="block">
      <span className="font-body text-xs text-muted-foreground">{label}</span>
      <input value={value} onChange={e => onChange(e.target.value)} className="bogest-input mt-1" />
    </label>
  );
}

function SelectLabeled({ label, value, options, onChange }) {
  return (
    <label className="block">
      <span className="font-body text-xs text-muted-foreground">{label}</span>
      <select value={value} onChange={e => onChange(e.target.value)} className="bogest-input mt-1">
        {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    </label>
  );
}