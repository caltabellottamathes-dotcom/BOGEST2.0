import React, { useState, useEffect } from 'react';
import { X, Download, Save, Trash2, ExternalLink, Copy, Check, Loader2, Globe, Sparkles } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import ReplaceOnWebsitePanel from '@/components/assets/ReplaceOnWebsitePanel';
import {
  ASSET_TAXONOMY,
  TAXONOMY_GROUPS,
  groupLabel,
  categoryLabel,
  deriveOrientation,
} from '@/lib/assetTaxonomy';
import { SUGGESTIONS } from '@/components/home/SeasonalSection';

const LOCATIONS = ['unknown', 'hasselt', 'borgloon', 'heusden-zolder'];
const LOC_LABELS = { unknown: 'Onbekend', hasselt: 'Hasselt', borgloon: 'Borgloon', 'heusden-zolder': 'Heusden-Zolder' };
const STATUSES = ['active', 'pending', 'rejected'];
const SOURCE_PLATFORMS = ASSET_TAXONOMY.source.items;

const COLLECTIONS = [
  { key: 'seasonal_dishes', label: 'Seizoensgerechten' },
  { key: 'signature', label: 'Signature dishes' },
  { key: 'atmosphere', label: 'Sfeerbeelden' },
  { key: 'terrace', label: 'Terras' },
  { key: 'interior', label: 'Interieur' },
  { key: 'events', label: 'Events' },
  { key: 'hero', label: 'Hero / spotlight' },
];

// Menu categories for the matched_dish dropdown (Dutch labels, admin only)
const CAT_LABELS = {
  signature: 'Signature', beef: 'Runds', chicken: 'Kip', fish: 'Vis & Veggie',
  veggie: 'Veggie', sides: 'Bijgerechten', sauces: 'Sauzen', wines: 'Wijnen',
  beers: 'Bieren', drinks: 'Dranken', desserts: 'Desserts', kids: 'Kinderen',
};

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
  const [activeGroup, setActiveGroup] = useState('food');
  const [showReplace, setShowReplace] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [menuItems, setMenuItems] = useState([]);

  // Load the full restaurant menu so each food photo can be assigned to
  // exactly one menu item (single-select, all items available).
  useEffect(() => {
    base44.entities.MenuKnowledge.list('-sort_order', 250)
      .then((rows) => setMenuItems(rows || []))
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (!asset) return;
    const cats = Array.isArray(asset.categories) && asset.categories.length
      ? asset.categories
      : (asset.primary_category ? [asset.primary_category] : []);
    setForm({
      description: asset.description || '',
      categories: cats,
      location: asset.location || 'unknown',
      tags: (asset.tags || []).join(', '),
      mood: asset.mood || '',
      colors: (asset.colors || []).join(', '),
      quality_score: asset.quality_score ?? '',
      is_relevant: asset.is_relevant !== false,
      status: asset.status || 'active',
      source_url: asset.source_url || '',
      source_platform: asset.source_platform || '',
      collections: asset.collections || [],
      matched_dish: asset.matched_dish || '',
    });
    setConfirming(false);
  }, [asset?.id]);

  if (!asset) return null;

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const analyze = async () => {
    setAnalyzing(true);
    try {
      const res = await base44.functions.invoke('analyzeAsset', { asset_id: asset.id });
      onSaved?.(res.data?.asset);
    } catch {
      alert('Analyse mislukt');
    }
    setAnalyzing(false);
  };

  const toggleCategory = (path) => {
    setForm((f) => {
      const has = (f.categories || []).includes(path);
      return { ...f, categories: has ? f.categories.filter((c) => c !== path) : [...(f.categories || []), path] };
    });
  };

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

  const orientation = deriveOrientation(asset.width, asset.height);

  const save = async () => {
    setSaving(true);
    try {
      const data = {
        description: form.description,
        categories: form.categories || [],
        location: form.location,
        tags: (form.tags || '').split(',').map((t) => t.trim()).filter(Boolean),
        mood: form.mood,
        colors: (form.colors || '').split(',').map((t) => t.trim()).filter(Boolean),
        is_relevant: form.is_relevant,
        status: form.status,
        source_url: form.source_url,
        source_platform: form.source_platform,
        collections: form.collections,
        matched_dish: form.matched_dish || '',
      };
      // Only send quality_score when it's a real number — sending null on a
      // number field was what made saves fail.
      if (form.quality_score !== '' && form.quality_score != null && !Number.isNaN(Number(form.quality_score))) {
        data.quality_score = Number(form.quality_score);
      }
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
            {asset.media_type === 'video' ? (
              <video src={asset.image_url} controls playsInline preload="metadata" className="w-full h-auto max-h-[36vh] bg-black" />
            ) : (
              <img src={asset.image_url} alt={form.description || 'Bogèst'} className="w-full h-auto object-contain max-h-[36vh]" />
            )}
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

          {asset.media_type !== 'video' && asset.ai_analyzed !== true && (
            <button onClick={analyze} disabled={analyzing} className="w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground text-sm py-2.5 rounded-lg hover:bg-primary/90 transition-colors mb-3 disabled:opacity-50">
              {analyzing ? <><Loader2 className="w-4 h-4 animate-spin" /> Bezig met analyseren…</> : <><Sparkles className="w-4 h-4" /> Analyseer nu</>}
            </button>
          )}

          <button onClick={() => setShowReplace(true)} className="w-full flex items-center justify-center gap-2 bg-primary/10 border border-primary/40 text-primary text-sm py-2.5 rounded-lg hover:bg-primary/15 transition-colors mb-6">
            <Globe className="w-4 h-4" /> Vervang op website
          </button>

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

            {/* Multi-category assignment */}
            <Field label={`Categorieën (${(form.categories || []).length})`}>
              <div className="flex flex-wrap gap-1.5 mb-2 min-h-[28px]">
                {(form.categories || []).map((c) => (
                  <span key={c} className="inline-flex items-center gap-1 text-xs py-1 px-2.5 rounded-full bg-primary/15 text-primary border border-primary/30">
                    {categoryLabel(c)}
                    <button type="button" onClick={() => toggleCategory(c)} className="opacity-60 hover:opacity-100">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
                {(form.categories || []).length === 0 && <span className="text-xs text-muted-foreground">Nog geen categorieën</span>}
              </div>
              <div className="flex flex-wrap gap-1 mb-2">
                {TAXONOMY_GROUPS.map((g) => (
                  <button key={g} type="button" onClick={() => setActiveGroup(g)}
                    className={`text-[10px] py-1 px-2.5 rounded-full border transition-colors ${activeGroup === g ? 'bg-primary text-primary-foreground border-primary' : 'border-border text-muted-foreground hover:bg-muted'}`}>
                    {groupLabel(g)}
                  </button>
                ))}
              </div>
              <div className="flex flex-wrap gap-1.5">
                {ASSET_TAXONOMY[activeGroup].items.map((it) => {
                  const path = `${activeGroup}/${it}`;
                  const active = (form.categories || []).includes(path);
                  return (
                    <button key={it} type="button" onClick={() => toggleCategory(path)}
                      className={`text-xs py-1 px-2.5 rounded-full border transition-all ${active ? 'bg-primary text-primary-foreground border-primary' : 'border-border text-muted-foreground hover:bg-muted'}`}>
                      {active && '✓ '}{it}
                    </button>
                  );
                })}
              </div>
            </Field>

            <Field label="Gerecht (menu-item · max 1)">
              <select value={form.matched_dish} onChange={(e) => set('matched_dish', e.target.value)} className={inputCls}>
                <option value="">— Geen gerecht —</option>
                {Object.entries(
                  menuItems.reduce((acc, it) => { const c = it.category || 'overig'; (acc[c] = acc[c] || []).push(it); return acc; }, {})
                ).map(([cat, items]) => (
                  <optgroup key={cat} label={CAT_LABELS[cat] || cat}>
                    {items.map((it) => <option key={it.id} value={it.item_name}>{it.item_name}</option>)}
                  </optgroup>
                ))}
                {(SUGGESTIONS.nl || []).length > 0 && (
                  <optgroup label="Seizoensselectie (chef)">
                    {(SUGGESTIONS.nl || []).map((s) => (
                      <option key={'seasonal-' + s.id} value={s.name}>{s.name}</option>
                    ))}
                  </optgroup>
                )}
              </select>
            </Field>

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

            <Field label="Tags (komma-gescheiden · onbeperkt)">
              <input value={form.tags} onChange={(e) => set('tags', e.target.value)} className={inputCls} placeholder="terras, zomer, witte wijn, belgian blue, fine dining" />
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
              <Field label="Oriëntatie (auto)">
                <div className="px-3 py-2.5 rounded-lg border border-border text-sm text-muted-foreground capitalize">{orientation}</div>
              </Field>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Field label="Relevant">
                <label className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg border border-border cursor-pointer">
                  <input type="checkbox" checked={form.is_relevant} onChange={(e) => set('is_relevant', e.target.checked)} className="w-4 h-4 accent-primary" />
                  <span className="font-body text-sm">Toont Bogèst</span>
                </label>
              </Field>
              <Field label="Bron-platform">
                <input list="source-platforms" value={form.source_platform} onChange={(e) => set('source_platform', e.target.value)} className={inputCls} placeholder="Tripadvisor" />
                <datalist id="source-platforms">
                  {SOURCE_PLATFORMS.map((s) => <option key={s} value={s} />)}
                </datalist>
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
      {showReplace && <ReplaceOnWebsitePanel asset={asset} onClose={() => setShowReplace(false)} />}
    </>
  );
}