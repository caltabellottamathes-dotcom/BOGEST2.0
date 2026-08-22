import { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useLang } from '@/lib/LangContext';
import { Plus, Trash2, Pencil, X, Check } from 'lucide-react';

const LOCATIONS = [
  { value: 'all', label: 'Alle vestigingen' },
  { value: 'hasselt', label: 'Hasselt' },
  { value: 'borgloon', label: 'Borgloon' },
  { value: 'heusden-zolder', label: 'Heusden-Zolder' },
];

const EMPTY = {
  title: '',
  message: '',
  link_label: '',
  link_url: '',
  location: 'all',
  start_date: '',
  end_date: '',
  active: true,
  sort_order: 0,
};

// Minimale CRUD voor tijdelijke meldingen (automatisch verbergen na einddatum).
export default function AnnouncementBeheer() {
  const { t } = useLang();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null); // item of EMPTY
  const [saving, setSaving] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const all = await base44.entities.Announcement.list('-created_date', 100);
      setItems(all || []);
    } catch {}
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const startNew = () => setEditing({ ...EMPTY });
  const startEdit = (item) => setEditing({ ...item });

  const save = async () => {
    if (!editing.title || !editing.message) return;
    setSaving(true);
    try {
      const payload = {
        title: editing.title,
        message: editing.message,
        link_label: editing.link_label || '',
        link_url: editing.link_url || '',
        location: editing.location || 'all',
        start_date: editing.start_date ? new Date(editing.start_date).toISOString() : null,
        end_date: editing.end_date ? new Date(editing.end_date).toISOString() : null,
        active: editing.active !== false,
        sort_order: Number(editing.sort_order) || 0,
      };
      if (editing.id) {
        await base44.entities.Announcement.update(editing.id, payload);
      } else {
        await base44.entities.Announcement.create(payload);
      }
      setEditing(null);
      load();
    } catch {}
    setSaving(false);
  };

  const remove = async (item) => {
    if (!confirm('Deze melding verwijderen?')) return;
    try { await base44.entities.Announcement.delete(item.id); load(); } catch {}
  };

  const toggleActive = async (item) => {
    try { await base44.entities.Announcement.update(item.id, { active: !item.active }); load(); } catch {}
  };

  return (
    <div className="min-h-screen pt-24 pb-20 px-6 md:px-10 lg:px-16">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <span className="font-body text-[10px] tracking-[0.35em] uppercase text-primary block mb-2">Bogèst · Beheer</span>
            <h1 className="font-heading text-3xl md:text-4xl font-bold text-foreground">Meldingen</h1>
            <p className="font-body text-sm text-muted-foreground mt-2">Tijdelijke meldingen op de site. Verdwijnen automatisch na de einddatum.</p>
          </div>
          <button onClick={startNew} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary text-primary-foreground font-body text-xs tracking-widest uppercase hover:bg-primary/90 transition-colors">
            <Plus className="w-4 h-4" /> Nieuw
          </button>
        </div>

        {loading ? (
          <p className="font-body text-sm text-muted-foreground">Laden…</p>
        ) : items.length === 0 ? (
          <p className="font-body text-sm text-muted-foreground">Nog geen meldingen. Maak er een aan.</p>
        ) : (
          <div className="space-y-3">
            {items.map((item) => {
              const expired = item.end_date && new Date(item.end_date) < new Date();
              const upcoming = item.start_date && new Date(item.start_date) > new Date();
              return (
                <div key={item.id} className="rounded-2xl border border-border bg-card/50 p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`w-2 h-2 rounded-full ${item.active === false ? 'bg-muted-foreground/40' : expired ? 'bg-muted-foreground/40' : upcoming ? 'bg-primary/50' : 'bg-primary'}`} />
                        <h3 className="font-heading text-lg font-semibold text-foreground truncate">{item.title}</h3>
                      </div>
                      <p className="font-body text-sm text-muted-foreground line-clamp-2">{item.message}</p>
                      <p className="font-body text-[11px] text-muted-foreground/80 mt-2">
                        {LOCATIONS.find((l) => l.value === item.location)?.label || 'Alle'}
                        {item.start_date && !upcoming ? '' : item.start_date ? ` · vanaf ${new Date(item.start_date).toLocaleDateString('nl-BE')}` : ''}
                        {item.end_date ? ` · t/m ${new Date(item.end_date).toLocaleDateString('nl-BE')}` : ''}
                        {expired ? ' · verlopen' : upcoming ? ' · gepland' : ''}
                      </p>
                    </div>
                    <div className="flex items-center gap-1.5 flex-shrink-0">
                      <button onClick={() => toggleActive(item)} title={item.active === false ? 'Activeren' : 'Uitschakelen'} className="w-8 h-8 rounded-full flex items-center justify-center border border-border hover:border-primary transition-colors">
                        {item.active !== false ? <Check className="w-4 h-4 text-primary" /> : <X className="w-4 h-4 text-muted-foreground" />}
                      </button>
                      <button onClick={() => startEdit(item)} title="Bewerken" className="w-8 h-8 rounded-full flex items-center justify-center border border-border hover:border-primary transition-colors">
                        <Pencil className="w-3.5 h-3.5 text-foreground/70" />
                      </button>
                      <button onClick={() => remove(item)} title="Verwijderen" className="w-8 h-8 rounded-full flex items-center justify-center border border-border hover:border-destructive transition-colors">
                        <Trash2 className="w-3.5 h-3.5 text-muted-foreground" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {editing && (
        <div className="fixed inset-0 z-[90] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={() => setEditing(null)}>
          <div className="w-full max-w-lg rounded-2xl bg-background border border-border p-6 max-h-[88vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <h2 className="font-heading text-xl font-bold text-foreground mb-5">{editing.id ? 'Melding bewerken' : 'Nieuwe melding'}</h2>
            <div className="space-y-4">
              <Field label="Titel">
                <input value={editing.title} onChange={(e) => setEditing({ ...editing, title: e.target.value })} className="bogest-input" placeholder="Bijv. Sluitingsdagen" />
              </Field>
              <Field label="Bericht">
                <textarea value={editing.message} onChange={(e) => setEditing({ ...editing, message: e.target.value })} rows={3} className="bogest-input" placeholder="Bijv. Van 24 t/m 26 december zijn we gesloten." />
              </Field>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Vanaf (optioneel)">
                  <input type="datetime-local" value={editing.start_date ? toLocal(editing.start_date) : ''} onChange={(e) => setEditing({ ...editing, start_date: e.target.value })} className="bogest-input" />
                </Field>
                <Field label="Tot en met (optioneel)">
                  <input type="datetime-local" value={editing.end_date ? toLocal(editing.end_date) : ''} onChange={(e) => setEditing({ ...editing, end_date: e.target.value })} className="bogest-input" />
                </Field>
              </div>
              <Field label="Vestiging">
                <select value={editing.location} onChange={(e) => setEditing({ ...editing, location: e.target.value })} className="bogest-input">
                  {LOCATIONS.map((l) => <option key={l.value} value={l.value}>{l.label}</option>)}
                </select>
              </Field>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Knoplabel (optioneel)">
                  <input value={editing.link_label} onChange={(e) => setEditing({ ...editing, link_label: e.target.value })} className="bogest-input" placeholder="Reserveer" />
                </Field>
                <Field label="Knoplink (optioneel)">
                  <input value={editing.link_url} onChange={(e) => setEditing({ ...editing, link_url: e.target.value })} className="bogest-input" placeholder="/reserve" />
                </Field>
              </div>
              <label className="flex items-center gap-2.5 cursor-pointer">
                <input type="checkbox" checked={editing.active !== false} onChange={(e) => setEditing({ ...editing, active: e.target.checked })} className="w-4 h-4 accent-[hsl(var(--primary))]" />
                <span className="font-body text-sm text-foreground">Actief</span>
              </label>
            </div>
            <div className="flex justify-end gap-2 mt-6">
              <button onClick={() => setEditing(null)} className="px-5 py-2.5 rounded-full border border-border font-body text-xs tracking-widest uppercase hover:border-primary transition-colors">Annuleren</button>
              <button onClick={save} disabled={saving || !editing.title || !editing.message} className="px-5 py-2.5 rounded-full bg-primary text-primary-foreground font-body text-xs tracking-widest uppercase hover:bg-primary/90 transition-colors disabled:opacity-40">
                {saving ? 'Opslaan…' : 'Opslaan'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Field({ label, children }) {
  return (
    <label className="block">
      <span className="font-body text-xs text-muted-foreground mb-1.5 block">{label}</span>
      {children}
    </label>
  );
}

function toLocal(iso) {
  try {
    const d = new Date(iso);
    const off = d.getTimezoneOffset();
    return new Date(d.getTime() - off * 60000).toISOString().slice(0, 16);
  } catch { return ''; }
}