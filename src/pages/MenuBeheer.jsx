import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Pencil, Trash2, Loader2, ArrowLeft, Star, Sparkles } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { MENU_CATEGORIES, MENU_LOCATIONS } from '@/lib/menuCategories';
import MenuItemEditor from '@/components/admin/MenuItemEditor';

const LOC_LABEL = Object.fromEntries(MENU_LOCATIONS.map((l) => [l.key, l.label]));

// Prijzenbeheer voor de menukaart — volledige CRUD op MenuKnowledge.
// Bereikbaar via /menu-beheer (admin-gated, net als de Beeldbank). Bogèst kan
// hier zelf prijzen, namen, beschrijvingen, pairings, beschikbaarheid per
// vestiging en populair/nieuw-vlaggen aanpassen, én gerechten toevoegen of
// verwijderen — zonder tussenkomst van de bouwer.
export default function MenuBeheer() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null); // null | 'new' | item
  const [saving, setSaving] = useState(false);
  const [confirmDel, setConfirmDel] = useState(null);
  const [error, setError] = useState('');

  const load = useCallback(() => {
    setLoading(true);
    setError('');
    base44.entities.MenuKnowledge.list('sort_order', 500)
      .then((rows) => setItems(rows || []))
      .catch(() => setError('Menu kon niet geladen worden.'))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { load(); }, [load]);

  const grouped = {};
  MENU_CATEGORIES.forEach((c) => { grouped[c.key] = []; });
  items.forEach((it) => {
    const k = it.category && grouped[it.category] ? it.category : 'signature';
    grouped[k].push(it);
  });

  const save = async (data) => {
    setSaving(true);
    setError('');
    try {
      if (editing === 'new') {
        await base44.entities.MenuKnowledge.create(data);
      } else {
        await base44.entities.MenuKnowledge.update(editing.id, data);
      }
      setEditing(null);
      load();
    } catch (e) {
      setError('Opslaan mislukt: ' + (e?.message || 'onbekende fout'));
    } finally {
      setSaving(false);
    }
  };

  const del = async () => {
    if (!confirmDel) return;
    try {
      await base44.entities.MenuKnowledge.delete(confirmDel.id);
      setConfirmDel(null);
      load();
    } catch (e) {
      setError('Verwijderen mislukt: ' + (e?.message || 'onbekende fout'));
    }
  };

  const priceStr = (p) => (p === null || p === undefined || p === '' ? 'Inbegrepen' : `€${Number(p).toFixed(2).replace('.', ',')}`);

  return (
    <div className="min-h-screen md:pt-16">
      <div className="max-w-5xl mx-auto px-6 md:px-10 py-8 md:py-12">
        <div className="flex items-start justify-between gap-4 mb-8">
          <div>
            <span className="font-body text-[10px] tracking-[0.3em] uppercase text-primary block mb-1">Bogèst</span>
            <h1 className="font-heading text-3xl font-bold leading-none">Menukaart beheer</h1>
            <p className="font-body text-xs text-muted-foreground mt-1.5">{items.length} gerechten · volledige CRUD</p>
          </div>
          <div className="flex items-center gap-2">
            <Link to="/assets" className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-border text-sm hover:bg-muted transition-colors">
              <ArrowLeft className="w-4 h-4" /> Beeldbank
            </Link>
            <button onClick={() => setEditing('new')} className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-primary text-primary-foreground text-sm hover:opacity-90 transition-opacity">
              <Plus className="w-4 h-4" /> Nieuw gerecht
            </button>
          </div>
        </div>

        {error && <p className="font-body text-sm text-destructive mb-4">{error}</p>}

        {loading ? (
          <div className="flex items-center justify-center py-24"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>
        ) : (
          <div className="space-y-8">
            {MENU_CATEGORIES.map((cat) => {
              const list = grouped[cat.key] || [];
              if (!list.length) return null;
              return (
                <section key={cat.key}>
                  <div className="flex items-center gap-3 mb-3">
                    <h2 className="font-heading text-lg font-semibold">{cat.label}</h2>
                    <span className="font-body text-xs text-muted-foreground">{list.length}</span>
                    <span className="h-px flex-1 bg-border" />
                  </div>
                  <div className="rounded-xl border border-border overflow-hidden divide-y divide-border">
                    {list.map((it) => (
                      <div key={it.id} className="flex items-start gap-4 px-4 py-3 hover:bg-muted/40 transition-colors">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <p className="font-body text-sm font-medium text-foreground">{it.item_name}</p>
                            {it.is_popular && <span className="inline-flex items-center gap-1 text-[10px] tracking-widest uppercase text-primary"><Star className="w-3 h-3" /> Populair</span>}
                            {it.is_new && <span className="inline-flex items-center gap-1 text-[10px] tracking-widest uppercase text-primary"><Sparkles className="w-3 h-3" /> Nieuw</span>}
                          </div>
                          {it.description && <p className="font-body text-xs text-muted-foreground mt-0.5 line-clamp-2">{it.description}</p>}
                          <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                            {it.pairing && <span className="font-body text-[10px] text-muted-foreground">Pairing: {it.pairing}</span>}
                            {(it.available_locations || []).length ? (
                              <span className="font-body text-[10px] text-muted-foreground">{it.available_locations.map((l) => LOC_LABEL[l] || l).join(' · ')}</span>
                            ) : <span className="font-body text-[10px] text-muted-foreground">Alle vestigingen</span>}
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-2 flex-shrink-0">
                          <span className="font-heading text-sm font-semibold text-primary">{priceStr(it.price)}</span>
                          <div className="flex gap-1">
                            <button onClick={() => setEditing(it)} className="w-8 h-8 rounded-lg flex items-center justify-center border border-border text-muted-foreground hover:text-primary hover:border-primary/40 transition-colors" title="Bewerken"><Pencil className="w-3.5 h-3.5" /></button>
                            <button onClick={() => setConfirmDel(it)} className="w-8 h-8 rounded-lg flex items-center justify-center border border-border text-muted-foreground hover:text-destructive hover:border-destructive/40 transition-colors" title="Verwijderen"><Trash2 className="w-3.5 h-3.5" /></button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              );
            })}
          </div>
        )}
      </div>

      {editing !== null && (
        <MenuItemEditor item={editing === 'new' ? null : editing} saving={saving} onSave={save} onCancel={() => setEditing(null)} />
      )}

      {confirmDel && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/55 backdrop-blur-sm" onClick={() => setConfirmDel(null)}>
          <div onClick={(e) => e.stopPropagation()} className="w-full max-w-sm rounded-2xl border border-border bg-background shadow-2xl p-6">
            <h3 className="font-heading text-lg font-bold mb-1">Gerecht verwijderen?</h3>
            <p className="font-body text-sm text-muted-foreground mb-5">"{confirmDel.item_name}" wordt definitief verwijderd van de menukaart.</p>
            <div className="flex gap-2 justify-end">
              <button onClick={() => setConfirmDel(null)} className="px-4 py-2 rounded-lg border border-border text-sm hover:bg-muted transition-colors">Annuleren</button>
              <button onClick={del} className="px-4 py-2 rounded-lg bg-destructive text-destructive-foreground text-sm hover:opacity-90 transition-opacity">Verwijderen</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}