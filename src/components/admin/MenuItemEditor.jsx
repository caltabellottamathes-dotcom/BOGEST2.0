import { useState } from 'react';
import { X, Check } from 'lucide-react';
import { MENU_CATEGORIES, MENU_LOCATIONS } from '@/lib/menuCategories';

const inputCls = 'w-full px-3 py-2.5 rounded-lg border border-border bg-background/60 font-body text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all duration-200';
const labelCls = 'font-body text-[10px] tracking-[0.2em] uppercase text-muted-foreground mb-2 block';

// Modale editor voor één MenuKnowledge-gerecht. Volledige CRUD-velden:
// categorie, naam, beschrijving, prijs (leeg = inbegrepen in formule), pairing,
// beschikbaarheid per vestiging (niets = alle), populair/nieuw en volgorde.
export default function MenuItemEditor({ item, saving, onSave, onCancel }) {
  const [form, setForm] = useState(() => ({
    category: item?.category || 'beef',
    item_name: item?.item_name || '',
    description: item?.description || '',
    price: item?.price ?? '',
    pairing: item?.pairing || '',
    is_popular: !!item?.is_popular,
    is_new: !!item?.is_new,
    available_locations: item?.available_locations || [],
    sort_order: item?.sort_order ?? 0,
  }));

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));
  const toggleLoc = (k) => setForm((f) => {
    const has = f.available_locations.includes(k);
    return { ...f, available_locations: has ? f.available_locations.filter((x) => x !== k) : [...f.available_locations, k] };
  });

  const submit = (e) => {
    e.preventDefault();
    onSave({
      ...form,
      price: form.price === '' || form.price === null ? null : Number(form.price),
      sort_order: Number(form.sort_order) || 0,
    });
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/55 backdrop-blur-sm" onClick={onCancel}>
      <div onClick={(e) => e.stopPropagation()} className="w-full max-w-lg max-h-[88vh] overflow-y-auto rounded-2xl border border-border bg-background shadow-2xl bogest-scroll">
        <div className="flex items-center justify-between px-6 py-4 border-b border-border sticky top-0 bg-background/95 backdrop-blur z-10">
          <h2 className="font-heading text-lg font-bold">{item ? 'Gerecht bewerken' : 'Nieuw gerecht'}</h2>
          <button onClick={onCancel} className="w-8 h-8 rounded-full flex items-center justify-center text-muted-foreground hover:bg-muted transition-colors"><X className="w-4 h-4" /></button>
        </div>

        <form onSubmit={submit} className="px-6 py-5 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Categorie</label>
              <select value={form.category} onChange={(e) => set('category', e.target.value)} className={inputCls}>
                {MENU_CATEGORIES.map((c) => <option key={c.key} value={c.key}>{c.label}</option>)}
              </select>
            </div>
            <div>
              <label className={labelCls}>Volgorde</label>
              <input type="number" value={form.sort_order} onChange={(e) => set('sort_order', e.target.value)} className={inputCls} />
            </div>
          </div>

          <div>
            <label className={labelCls}>Naam *</label>
            <input value={form.item_name} onChange={(e) => set('item_name', e.target.value)} className={inputCls} placeholder="bijv. Ribeye" required />
          </div>

          <div>
            <label className={labelCls}>Beschrijving</label>
            <textarea value={form.description} onChange={(e) => set('description', e.target.value)} rows={3} className={inputCls} placeholder="Korte omschrijving…" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Prijs (€)</label>
              <input type="number" step="0.01" value={form.price} onChange={(e) => set('price', e.target.value)} className={inputCls} placeholder="leeg = inbegrepen" />
            </div>
            <div>
              <label className={labelCls}>Pairing</label>
              <input value={form.pairing} onChange={(e) => set('pairing', e.target.value)} className={inputCls} placeholder="bijv. Malbec" />
            </div>
          </div>

          <div>
            <label className={labelCls}>Beschikbaarheid</label>
            <div className="flex flex-wrap gap-2">
              {MENU_LOCATIONS.map((l) => {
                const on = form.available_locations.includes(l.key);
                return (
                  <button key={l.key} type="button" onClick={() => toggleLoc(l.key)} className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs border transition-colors ${on ? 'bg-primary/15 text-primary border-primary/40' : 'text-muted-foreground border-border hover:bg-muted'}`}>
                    {on && <Check className="w-3 h-3" />}{l.label}
                  </button>
                );
              })}
            </div>
            <p className="font-body text-[10px] text-muted-foreground/70 mt-1.5">Niets aangevinkt = beschikbaar in alle vestigingen.</p>
          </div>

          <div className="flex gap-5">
            <label className="flex items-center gap-2.5 cursor-pointer select-none">
              <button type="button" onClick={() => set('is_popular', !form.is_popular)} className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${form.is_popular ? 'bg-primary border-primary' : 'border-border bg-background/60'}`} aria-pressed={form.is_popular}>{form.is_popular && <Check className="w-3 h-3 text-primary-foreground" />}</button>
              <span className="font-body text-xs text-muted-foreground">Populair</span>
            </label>
            <label className="flex items-center gap-2.5 cursor-pointer select-none">
              <button type="button" onClick={() => set('is_new', !form.is_new)} className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${form.is_new ? 'bg-primary border-primary' : 'border-border bg-background/60'}`} aria-pressed={form.is_new}>{form.is_new && <Check className="w-3 h-3 text-primary-foreground" />}</button>
              <span className="font-body text-xs text-muted-foreground">Nieuw</span>
            </label>
          </div>

          <div className="flex gap-2 justify-end pt-2 border-t border-border">
            <button type="button" onClick={onCancel} className="px-4 py-2.5 rounded-lg border border-border text-sm hover:bg-muted transition-colors">Annuleren</button>
            <button type="submit" disabled={saving} className="px-4 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm hover:opacity-90 transition-opacity disabled:opacity-60">{saving ? 'Opslaan…' : 'Opslaan'}</button>
          </div>
        </form>
      </div>
    </div>
  );
}