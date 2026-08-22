import { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { DAY_NAMES } from '@/lib/openingHours';

const LOCATIONS = [
  { slug: 'hasselt', name: 'Hasselt' },
  { slug: 'borgloon', name: 'Borgloon' },
  { slug: 'heusden-zolder', name: 'Heusden-Zolder' },
];

// Beheer de openingsuren per vestiging. Verschijnt direct op de site en in het
// Google-schema (zelfde bron). Lege cel = die dag verwijderen uit de entiteit
// (valt dan terug op de statische standaarduren).
export default function OpeningHoursBeheer() {
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(null);

  const load = async () => {
    setLoading(true);
    try {
      const rows = await base44.entities.OpeningHours.list('day_index', 100);
      const map = {};
      (rows || []).forEach((r) => {
        if (!map[r.location]) map[r.location] = {};
        map[r.location][r.day_index] = { id: r.id, hours_text: r.hours_text, active: r.active };
      });
      setData(map);
    } catch {}
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

  const save = async (slug) => {
    setSaving(slug);
    try {
      const cells = data[slug] || {};
      for (let day = 0; day < 7; day++) {
        const cell = cells[day];
        const text = (cell?.hours_text || '').trim();
        if (!text) {
          if (cell?.id) { try { await base44.entities.OpeningHours.delete(cell.id); } catch {} }
          continue;
        }
        if (cell?.id) {
          await base44.entities.OpeningHours.update(cell.id, { hours_text: text, active: true });
        } else {
          await base44.entities.OpeningHours.create({ location: slug, day_index: day, hours_text: text, active: true });
        }
      }
      await load();
    } catch {}
    setSaving(null);
  };

  return (
    <div className="min-h-screen pt-24 pb-20 px-6 md:px-10 lg:px-16">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <span className="font-body text-[10px] tracking-[0.35em] uppercase text-primary block mb-2">Bogèst · Beheer</span>
          <h1 className="font-heading text-3xl md:text-4xl font-bold text-foreground">Openingsuren</h1>
          <p className="font-body text-sm text-muted-foreground mt-2">Pas de uren per vestiging aan — ze verschijnen direct op de site en in de Google-structuur. Leeg = terugval op de standaarduren.</p>
        </div>
        {loading ? (
          <p className="font-body text-sm text-muted-foreground">Laden…</p>
        ) : (
          <div className="space-y-6">
            {LOCATIONS.map((loc) => {
              const cells = data[loc.slug] || {};
              return (
                <div key={loc.slug} className="rounded-2xl border border-border bg-card/40 p-5">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="font-heading text-xl font-bold text-foreground">{loc.name}</h2>
                    <button onClick={() => save(loc.slug)} disabled={saving === loc.slug} className="px-4 py-2 rounded-full bg-primary text-primary-foreground font-body text-xs tracking-widest uppercase hover:bg-primary/90 disabled:opacity-40">
                      {saving === loc.slug ? 'Opslaan…' : 'Opslaan'}
                    </button>
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
          </div>
        )}
      </div>
    </div>
  );
}