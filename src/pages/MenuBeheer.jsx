import { useState, useEffect, useCallback } from 'react';
import { Plus, Pencil, Trash2, Loader2, Star, Sparkles, ChevronDown } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { MENU_CATEGORIES, MENU_LOCATIONS } from '@/lib/menuCategories';
import MenuItemEditor from '@/components/admin/MenuItemEditor';

const LOC_LABEL = Object.fromEntries(MENU_LOCATIONS.map((l) => [l.key, l.label]));

function slugify(s) {
  return String(s || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// Menukaart-beheer: volledige CRUD op gerechten (MenuKnowledge) én op de
// menusecties (MenuCategory). De statische MENU_CATEGORIES dienen als fallback
// zodat de bestaande secties altijd zichtbaar/bewerkbaar blijven, zelfs als de
// MenuCategory-entiteit (nog) leeg is. Admin-gemaakte secties overschrijven de
// statische label en volgorde.
export default function MenuBeheer() {
  const [items, setItems] = useState([]);
  const [catRows, setCatRows] = useState([]); // MenuCategory-entity records
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null); // null | 'new' | item
  const [newCatPreselect, setNewCatPreselect] = useState(null);
  const [saving, setSaving] = useState(false);
  const [confirmDel, setConfirmDel] = useState(null);
  const [error, setError] = useState('');

  // Categorie-beheer state
  const [catPanelOpen, setCatPanelOpen] = useState(false);
  const [newCatLabel, setNewCatLabel] = useState('');
  const [catDrafts, setCatDrafts] = useState({}); // key -> { label, sort_order }
  const [catSaving, setCatSaving] = useState(false);

  const load = useCallback(() => {
    setLoading(true);
    setError('');
    Promise.all([
      base44.entities.MenuKnowledge.list('sort_order', 500),
      base44.entities.MenuCategory.list('sort_order', 200),
    ])
      .then(([rows, cats]) => {
        setItems(rows || []);
        setCatRows(cats || []);
        // Seed drafts met huidige waarden
        const drafts = {};
        mergedCats(cats || []).forEach((c) => { drafts[c.key] = { label: c.label, sort_order: c.sort_order }; });
        setCatDrafts(drafts);
      })
      .catch(() => setError('Menu kon niet geladen worden.'))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { load(); }, [load]);

  // Merge statische categorieën met entity-records. Entity wint (label/volgorde).
  // Nieuwe entity-categorieën (niet in statisch) worden toegevoegd.
  const mergedCats = (cats) => {
    const map = {};
    MENU_CATEGORIES.forEach((c, i) => {
      map[c.key] = { key: c.key, label: c.label, sort_order: c.sort_order ?? i, entityId: null };
    });
    (cats || []).forEach((c) => {
      map[c.key] = { key: c.key, label: c.label, sort_order: c.sort_order ?? 0, entityId: c.id };
    });
    return Object.values(map).sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0));
  };

  const cats = mergedCats(catRows);

  const grouped = {};
  cats.forEach((c) => { grouped[c.key] = []; });
  items.forEach((it) => {
    const k = it.category && grouped[it.category] ? it.category : (cats[0]?.key || 'signature');
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
      setNewCatPreselect(null);
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

  // Categorie toevoegen
  const addCategory = async () => {
    const label = newCatLabel.trim();
    if (!label) return;
    const key = slugify(label);
    if (!key) return;
    if (cats.some((c) => c.key === key)) {
      setError('Er bestaat al een sectie met deze naam.');
      return;
    }
    setCatSaving(true);
    setError('');
    try {
      const sortOrder = (cats.length ? Math.max(...cats.map((c) => c.sort_order || 0)) : 0) + 1;
      await base44.entities.MenuCategory.create({ key, label, sort_order: sortOrder, active: true });
      setNewCatLabel('');
      load();
    } catch (e) {
      setError('Sectie aanmaken mislukt: ' + (e?.message || 'onbekende fout'));
    } finally {
      setCatSaving(false);
    }
  };

  // Categorie hernoemen / volgorde opslaan
  const saveCategory = async (key) => {
    const draft = catDrafts[key];
    if (!draft) return;
    setCatSaving(true);
    setError('');
    try {
      const existing = catRows.find((c) => c.key === key);
      if (existing) {
        await base44.entities.MenuCategory.update(existing.id, {
          label: draft.label,
          sort_order: Number(draft.sort_order) || 0,
        });
      } else {
        await base44.entities.MenuCategory.create({
          key,
          label: draft.label,
          sort_order: Number(draft.sort_order) || 0,
          active: true,
        });
      }
      load();
    } catch (e) {
      setError('Sectie opslaan mislukt: ' + (e?.message || 'onbekende fout'));
    } finally {
      setCatSaving(false);
    }
  };

  const deleteCategory = async (key) => {
    const existing = catRows.find((c) => c.key === key);
    if (!existing) return; // statische secties kunnen niet verwijderd worden
    if ((grouped[key] || []).length) {
      setError('Verplaats of verwijder eerst de gerechten in deze sectie.');
      return;
    }
    setCatSaving(true);
    try {
      await base44.entities.MenuCategory.delete(existing.id);
      load();
    } catch (e) {
      setError('Sectie verwijderen mislukt.');
    } finally {
      setCatSaving(false);
    }
  };

  const priceStr = (p) => (p === null || p === undefined || p === '' ? 'Inbegrepen' : `€${Number(p).toFixed(2).replace('.', ',')}`);

  return (
    <div className="pt-8 md:pt-10">
      <div className="max-w-5xl mx-auto px-6 md:px-10 pb-8">
        <div className="flex items-start justify-between gap-4 mb-6">
          <div>
            <span className="font-body text-[10px] tracking-[0.3em] uppercase text-primary block mb-1">Bogèst</span>
            <h1 className="font-heading text-3xl font-bold leading-none">Menukaart beheer</h1>
            <p className="font-body text-xs text-muted-foreground mt-1.5">{items.length} gerechten · {cats.length} secties</p>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => setCatPanelOpen((v) => !v)} className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-border text-sm hover:bg-muted transition-colors">
              <ChevronDown className={`w-4 h-4 transition-transform ${catPanelOpen ? 'rotate-180' : ''}`} /> Secties
            </button>
            <button onClick={() => { setNewCatPreselect(null); setEditing('new'); }} className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-primary text-primary-foreground text-sm hover:opacity-90 transition-opacity">
              <Plus className="w-4 h-4" /> Nieuw gerecht
            </button>
          </div>
        </div>

        {error && <p className="font-body text-sm text-destructive mb-4">{error}</p>}

        {catPanelOpen && (
          <div className="mb-8 rounded-xl border border-border bg-card/40 p-4 space-y-3">
            <p className="font-body text-xs text-muted-foreground">Beheer de menusecties (Signature, Voorgerechten, …). Hernoem, wijzig de volgorde of voeg een nieuwe sectie toe.</p>
            <div className="space-y-2">
              {cats.map((c) => {
                const draft = catDrafts[c.key] || { label: c.label, sort_order: c.sort_order };
                const isStatic = !c.entityId;
                return (
                  <div key={c.key} className="flex items-center gap-2">
                    <input
                      value={draft.label}
                      onChange={(e) => setCatDrafts((p) => ({ ...p, [c.key]: { ...draft, label: e.target.value } }))}
                      className="bogest-input flex-1"
                    />
                    <input
                      type="number"
                      value={draft.sort_order ?? 0}
                      onChange={(e) => setCatDrafts((p) => ({ ...p, [c.key]: { ...draft, sort_order: e.target.value } }))}
                      className="bogest-input w-20"
                      title="Volgorde"
                    />
                    <button onClick={() => saveCategory(c.key)} disabled={catSaving} className="px-3 py-2 rounded-lg border border-border text-xs hover:bg-muted transition-colors disabled:opacity-40">Opslaan</button>
                    {!isStatic && (
                      <button onClick={() => deleteCategory(c.key)} disabled={catSaving} className="w-9 h-9 rounded-lg border border-border flex items-center justify-center text-muted-foreground hover:text-destructive hover:border-destructive/40 transition-colors disabled:opacity-40" title="Sectie verwijderen">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
            <div className="flex items-center gap-2 pt-2 border-t border-border/50">
              <input
                value={newCatLabel}
                onChange={(e) => setNewCatLabel(e.target.value)}
                placeholder="Nieuwe sectie (bijv. Lunch)"
                className="bogest-input flex-1"
                onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addCategory(); } }}
              />
              <button onClick={addCategory} disabled={catSaving} className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-primary text-primary-foreground text-sm hover:opacity-90 disabled:opacity-40">
                <Plus className="w-4 h-4" /> Toevoegen
              </button>
            </div>
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center py-24"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>
        ) : (
          <div className="space-y-8">
            {cats.map((cat) => {
              const list = grouped[cat.key] || [];
              return (
                <section key={cat.key}>
                  <div className="flex items-center gap-3 mb-3">
                    <h2 className="font-heading text-lg font-semibold">{cat.label}</h2>
                    <span className="font-body text-xs text-muted-foreground">{list.length}</span>
                    <span className="h-px flex-1 bg-border" />
                    <button onClick={() => { setNewCatPreselect(cat.key); setEditing('new'); }} className="w-7 h-7 rounded-lg flex items-center justify-center border border-border text-muted-foreground hover:text-primary hover:border-primary/40 transition-colors" title="Gerecht toevoegen aan deze sectie">
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <div className="rounded-xl border border-border overflow-hidden divide-y divide-border">
                    {list.length === 0 ? (
                      <div className="px-4 py-4 font-body text-xs text-muted-foreground">Nog geen gerechten in deze sectie.</div>
                    ) : list.map((it) => (
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
        <MenuItemEditor
          item={editing === 'new' ? null : editing}
          categories={cats}
          defaultCategory={newCatPreselect}
          saving={saving}
          onSave={save}
          onCancel={() => { setEditing(null); setNewCatPreselect(null); }}
        />
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