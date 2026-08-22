import { useState, useEffect } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { DAY_NAMES } from '@/lib/openingHours';

const BASE_LOCATIONS = [
  { slug: 'hasselt', name: 'Hasselt' },
  { slug: 'borgloon', name: 'Borgloon' },
  { slug: 'heusden-zolder', name: 'Heusden-Zolder' },
];

// Beheer de openingsuren per vestiging. Verschijnt direct op de site en in het
// Google-schema (zelfde bron). Lege cel = die dag verwijderen uit de entiteit
// (valt dan terug op de statische standaarduren). Nieuwe vestigingen kunnen
// hier worden toegevoegd.
export default function OpeningHoursBeheer() {
  const [data, setData] = useState({});
  const [locations, setLocations] = useState(BASE_LOCATIONS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(null);
  const [adding, setAdding] = useState(false);
  const [newSlug, setNewSlug] = useState('');
  const [newName, setNewName] = useState('');
  const [err, setErr] = useState('');

  const load = async () => {
    setLoading(true);
    setErr('');
    try {
      const rows = await base44.entities.OpeningHours.list('day_index', 200);
      const map = {};
      const extraSlugs = new Map();
      (rows || []).forEach((r) => {
        if (!map[r.location]) map[r.location] = {};
        map[r.location][r.day_index] = { id: r.id, hours_text: r.hours_text, active: r.active };
        if (r.location_label && !BASE_LOCATIONS.some((b) => b.slug === r.location)) {
          extraSlugs.set(r.location, r.location_label);
        }
      });
      setData(map);
      // Basis-3 + admin-toegevoegde vestigingen
      const locs = [...BASE_LOCATIONS];
      extraSlugs.forEach((name, slug) => { if (!locs.some((l) => l.slug === slug)) locs.push({ slug, name }); });
      setLocations(locs);
    } catch {
      setErr('Openingsuren konden niet geladen worden.');
    }
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const setCell = (slug, day, val) => {
    setData((prev) => {
      const loc = { ...(prev[slug] || {}) };
      loc[day] = { ...(loc[day] || {}), hours_text: val };
      return { ...prev, [slug]: loc };
    });
  };

  const addVestiging = () => {
    const slug = newSlug.trim().toLowerCase().replace(/\s+/g, '-');
    const name = newName.trim();
    if (!slug || !name) { setErr('Vul zowel een slug als een naam in.'); return; }
    if (locations.some((l) => l.slug === slug)) { setErr('Deze vestiging bestaat al.'); return; }
    setErr('');
    setLocations((prev) => [...prev, { slug, name }]);
    setData((prev) => ({ ...prev, [slug]: {} }));
    setNewSlug('');
    setNewName('');
    setAdding(false);
  };

  const removeVestiging = async (slug) => {
    if (BASE_LOCATIONS.some((b) => b.slug === slug)) return; // basisvestigingen behouden
    const cells = data[slug] || {};
    for (let day = 0; day < 7; day++) {
      const cell = cells[day];
      if (cell?.id) { try { await base44.entities.OpeningHours.delete(cell.id); } catch {} }
    }
    setLocations((prev) => prev.filter((l) => l.slug !== slug));
    setData((prev) => { const n = { ...prev }; delete n[slug]; return n; });
  };

  const save = async (slug) => {
    setSaving(slug);
    setErr('');
    try {
      const loc = locations.find((l) => l.slug === slug);
      const label = loc?.name || '';
      const cells = data[slug] || {};
      for (let day = 0; day < 7; day++) {
        const cell = cells[day];
        const text = (cell?.hours_text || '').trim();
        if (!text) {
          if (cell?.id) { try { await base44.entities.OpeningHours.delete(cell.id); } catch {} }
          continue;
        }
        if (cell?.id) {
          await base44.entities.OpeningHours.update(cell.id, { hours_text: text, active: true, location_label: label });
        } else {
          await base44.entities.OpeningHours.create({ location: slug, location_label: label, day_index: day, hours_text: text, active: true });
        }
      }
      await load();
    } catch {
      setErr('Opslaan mislukt.');
    }
    setSaving(null);
  };

  return (
    <div className="pt-8 md:pt-10 pb-20 px-6 md:px-10 lg:px-16">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <span className="font-body text-[10px] tracking-[0.35em] uppercase text-primary block mb-2">Bogèst · Beheer</span>
          <h1 className="font-heading text-3xl md:text-4xl font-bold text-foreground">Openingsuren</h1>
          <p className="font-body text-sm text-muted-foreground mt-2">Pas de uren per vestiging aan — ze verschijnen direct op de site en in de Google-structuur. Leeg = terugval op de standaarduren.</p>
        </div>

        {err && <p className="font-body text-sm text-destructive mb-4">{err}</p>}

        {loading ? (
          <p className="font-body text-sm text-muted-foreground">Laden…</p>
        ) : (
          <div className="space-y-6">
            {locations.map((loc) => {
              const cells = data[loc.slug] || {};
              const isExtra = !BASE_LOCATIONS.some((b) => b.slug === loc.slug);
              return (
                <div key={loc.slug} className="rounded-2xl border border-border bg-card/40 p-5">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="font-heading text-xl font-bold text-foreground">{loc.name}</h2>
                    <div className="flex items-center gap-2">
                      {isExtra && (
                        <button onClick={() => removeVestiging(loc.slug)} className="w-9 h-9 rounded-lg border border-border flex items-center justify-center text-muted-foreground hover:text-destructive hover:border-destructive/40 transition-colors" title="Vestiging verwijderen">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                      <button onClick={() => save(loc.slug)} disabled={saving === loc.slug} className="px-4 py-2 rounded-full bg-primary text-primary-foreground font-body text-xs tracking-widest uppercase hover:bg-primary/90 disabled:opacity-40">
                        {saving === loc.slug ? 'Opslaan…' : 'Opslaan'}
                      </button>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {DAY_NAMES.nl.map((day, i) => (
                      <label key={day} className="flex items-center gap-3">
                        <span className="w-28 font-body text-sm text-foreground flex-shrink-0">{day}</span>
                        <input value={cells[i]?.hours_text || ''} onChange={(e) => setCell(loc.slug, i, e.target.value)} placeholder="17:00 – 22:00 of Gesloten" className="bogest-input" />
                      </label>
                    ))}
                  </div>
                </div>
              );
            })}

            {adding ? (
              <div className="rounded-2xl border border-primary/40 bg-card/40 p-5 space-y-3">
                <h2 className="font-heading text-lg font-bold text-foreground">Nieuwe vestiging</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <label className="block">
                    <span className="font-body text-xs text-muted-foreground">Slug (bijv. maasmechelen)</span>
                    <input value={newSlug} onChange={(e) => setNewSlug(e.target.value)} className="bogest-input mt-1" placeholder="maasmechelen" />
                  </label>
                  <label className="block">
                    <span className="font-body text-xs text-muted-foreground">Naam</span>
                    <input value={newName} onChange={(e) => setNewName(e.target.value)} className="bogest-input mt-1" placeholder="Bogèst Maasmechelen" />
                  </label>
                </div>
                <div className="flex gap-2">
                  <button onClick={addVestiging} className="px-4 py-2 rounded-full bg-primary text-primary-foreground font-body text-xs tracking-widest uppercase hover:bg-primary/90">Toevoegen</button>
                  <button onClick={() => { setAdding(false); setNewSlug(''); setNewName(''); }} className="px-4 py-2 rounded-full border border-border font-body text-xs tracking-widest uppercase text-muted-foreground hover:bg-muted">Annuleren</button>
                </div>
              </div>
            ) : (
              <button onClick={() => setAdding(true)} className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full border border-dashed border-border text-muted-foreground hover:text-primary hover:border-primary/40 transition-colors font-body text-xs tracking-widest uppercase">
                <Plus className="w-4 h-4" /> Nieuwe vestiging
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}