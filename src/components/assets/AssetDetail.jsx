import React, { useState, useEffect } from 'react';
import { X, Download, Save, Trash2, ExternalLink, Copy, Check, Loader2 } from 'lucide-react';
import { base44 } from '@/api/base44Client';

const CATEGORIES = ['interiors', 'gastronomy', 'atmosphere', 'architecture', 'branding'];
const CAT_LABELS = { interiors: 'Interieur', gastronomy: 'Gastronomie', atmosphere: 'Sfeer', architecture: 'Architectuur', branding: 'Branding' };
const LOCATIONS = ['unknown', 'hasselt', 'borgloon', 'heusden-zolder'];
const LOC_LABELS = { unknown: 'Onbekend', hasselt: 'Hasselt', borgloon: 'Borgloon', 'heusden-zolder': 'Heusden-Zolder' };
const STATUSES = ['active', 'pending', 'rejected'];

// "Acties" — assign this photo to a collection for reuse across the site.
const COLLECTIONS = [
  { key: 'seasonal_dishes', label: 'Seizoensgerechten' },
  { key: 'signature', label: 'Signature dishes' },
  { key: 'atmosphere', label: 'Sfeerbeelden' },
  { key: 'terrace', label: 'Terras' },
  { key: 'interior', label: 'Interieur' },
  { key: 'events', label: 'Events' },
  { key: 'hero', label: 'Hero / spotlight' },
];

function Field({ label, children }) {
  return (
    <div>
      <label className="block font-body text-[10px] tracking-[0.2em] uppercase text-muted-foreground mb-1.5">{label}</label>
      {children}
    </div>
  );
}

const inputCls = 'w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary';

export default function AssetDetail({ asset, onClose, onSaved, onDeleted }) {
  const [form, setForm] = useState({});
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!asset) return;
    setForm({
      description: asset.description || '',
      primary_category: asset.primary_category || 'branding',
      subcategory: asset.subcategory || '',
      location: asset.location || 'unknown',
      tags: (asset.tags || []).join(', '),
      mood: asset.mood || '',
      colors: (asset.colors || []).join(', '),
      quality_score: asset.quality_score ?? '',
      is_relevant: asset.is_relevant !== false,
      status: asset.status || 'active',
      source_url: asset.source_url || '',
      collections: asset.collections || [],
    });
    setConfirming(false);
  }, [asset?.id]);

  if (!asset) return null;

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const toggleCollection = (key) => {
    setForm((f) => {
      const has = (f.collections || []).includes(key);
      return { ...f, collections: has ? f.collections.filter((c) => c !== key) : [...(f.collections || []), key] };
    });
  };

  const copyLink = () => {
    navigator.clipboard.writeText(asset.image_url);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const save = async () => {
    setSaving(true);
    try {
      const data = {
        description: form.description,
        primary_category: form.primary_category,
        subcategory: form.subcategory,
        location: form.location,
        tags: form.tags.split(',').map((t) => t.trim()).filter(Boolean),
        mood: form.mood,
        colors: form.colors.split(',').map((t) => t.trim()).filter(Boolean),
        quality_score: form.quality_score === '' ? null : Number(form.quality_score),
        is_relevant: form.is_relevant,
        status: form.status,
        source_url: form.source_url,
        collections: form.collections,
      };
      const res = await base44.functions.invoke('assetsApi', { action: 'update', id: asset.id, data });
      onSaved?.(res.data?.item);
    } catch {
      alert('Opslaan mislukt');
    }
    setSaving(false);
  };

  const handleDelete = () => {
    if (!confirming) { setConfirming(true); setTimeout(() => setConfirming(false), 3000); return; }
    setDeleting(true);
    base44.functions.invoke('assetsApi', { action: 'delete', id: asset.id })
      .then(() => onDeleted?.(asset.id))
      .catch(() => alert('Verwijderen mislukt'))
      .finally(() => { setDeleting(false); setConfirming(false); });
  };

  return (
    <>
      <div className="fixed inset-0 z-[110] bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="fixed top-0 right-0 bottom-0 z-[111] w-full max-w-xl bg-background border-l border-border overflow-y-auto flex flex-col">
        <div className="sticky top-0 z-10 bg-background/90 backdrop-blur px-5 py-3 border-b border-border flex items-center justify-between">
          <h3 className="font-heading text-lg font-bold">Beeld bewerken</h3>
          <button onClick={onClose} className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-muted transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex-1 p-5">
          <div className="rounded-xl overflow-hidden border border-border mb-3 bg-muted">
            <img src={asset.image_url} alt={form.description || asset.primary_category} className="w-full h-auto object-contain max-h-[36vh]" />
          </div>
          <div className="flex gap-2 mb-6">
            <a href={asset.image_url} download className="flex-1 flex items-center justify-center gap-2 bg-primary text-primary-foreground text-sm py-2.5 rounded-lg hover:opacity-90 transition-opacity">
              <Download className="w-4 h-4" /> Downloaden
            </a>
            <button onClick={copyLink} className="flex items-center justify-center gap-2 px-3 text-sm py-2.5 rounded-lg border border-border hover:bg-muted transition-colors">
              {copied ? <><Check className="w-4 h-4 text-primary" /> Gekopieerd</> : <><Copy className="w-4 h-4" /> CDN link</>}
            </button>
            <a href={asset.image_url} target="_blank" rel="noreferrer" className="flex items-center justify-center w-11 rounded-lg border border-border hover:bg-muted transition-colors">
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>

          {/* Acties — add this photo to a collection */}
          <div className="mb-6">
            <p className="font-body text-[10px] tracking-[0.2em] uppercase text-primary mb-2">Acties · toevoegen aan</p>
            <div className="flex flex-wrap gap-2">
              {COLLECTIONS.map((c) => {
                const active = (form.collections || []).includes(c.key);
                return (
                  <button
                    key={c.key}
                    type="button"
                    onClick={() => toggleCollection(c.key)}
                    className={`text-xs py-1.5 px-3 rounded-full border transition-all ${active ? 'bg-primary text-primary-foreground border-primary' : 'border-border text-muted-foreground hover:bg-muted'}`}
                  >
                    {active && '✓ '}{c.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="space-y-4">
            <Field label="Beschrijving">
              <textarea value={form.description} onChange={(e) => set('description', e.target.value)} rows={2} className={inputCls} />
            </Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Categorie">
                <select value={form.primary_category} onChange={(e) => set('primary_category', e.target.value)} className={inputCls}>
                  {CATEGORIES.map((c) => <option key={c} value={c}>{CAT_LABELS[c]}</option>)}
                </select>
              </Field>
              <Field label="Subcategorie">
                <input value={form.subcategory} onChange={(e) => set('subcategory', e.target.value)} className={inputCls} />
              </Field>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Locatie">
                <select value={form.location} onChange={(e) => set('location', e.target.value)} className={inputCls}>
                  {LOCATIONS.map((l) => <option key={l} value={l}>{LOC_LABELS[l]}</option>)}
                </select>
              </Field>
              <Field label="Status">
                <select value={form.status} onChange={(e) => set('status', e.target.value)} className={inputCls}>
                  {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </Field>
            </div>
            <Field label="Tags (komma-gescheiden)">
              <input value={form.tags} onChange={(e) => set('tags', e.target.value)} className={inputCls} placeholder="terras, zomer, witte wijn" />
            </Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Sfeer / mood">
                <input value={form.mood} onChange={(e) => set('mood', e.target.value)} className={inputCls} />
              </Field>
              <Field label="Kleuren (komma)">
                <input value={form.colors} onChange={(e) => set('colors', e.target.value)} className={inputCls} placeholder="groen, crème" />
              </Field>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Kwaliteitsscore (0-100)">
                <input type="number" min={0} max={100} value={form.quality_score} onChange={(e) => set('quality_score', e.target.value)} className={inputCls} />
              </Field>
              <Field label="Relevant">
                <label className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg border border-border cursor-pointer">
                  <input type="checkbox" checked={form.is_relevant} onChange={(e) => set('is_relevant', e.target.checked)} className="w-4 h-4 accent-primary" />
                  <span className="font-body text-sm">Toont Bogèst</span>
                </label>
              </Field>
            </div>
            <Field label="Bron-URL">
              <input value={form.source_url} onChange={(e) => set('source_url', e.target.value)} className={inputCls} />
            </Field>

            {asset.source_urls?.length > 1 && (
              <Field label={`${asset.source_urls.length} bron-URL's`}>
                <div className="space-y-1 max-h-24 overflow-y-auto">
                  {asset.source_urls.map((u, i) => (
                    <a key={i} href={u} target="_blank" rel="noreferrer" className="block font-body text-[11px] text-muted-foreground hover:text-primary truncate">{u}</a>
                  ))}
                </div>
              </Field>
            )}
          </div>
        </div>

        <div className="sticky bottom-0 bg-background/90 backdrop-blur px-5 py-3 border-t border-border flex gap-2">
          <button onClick={handleDelete} disabled={deleting} className={`flex items-center gap-2 px-4 py-2.5 rounded-lg border text-sm transition-colors ${confirming ? 'border-destructive bg-destructive/10 text-destructive' : 'border-border text-muted-foreground hover:bg-muted'}`}>
            {deleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
            {confirming ? 'Bevestig' : 'Verwijderen'}
          </button>
          <button onClick={save} disabled={saving} className="flex-1 flex items-center justify-center gap-2 bg-primary text-primary-foreground text-sm py-2.5 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50">
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} Opslaan
          </button>
        </div>
      </div>
    </>
  );
}