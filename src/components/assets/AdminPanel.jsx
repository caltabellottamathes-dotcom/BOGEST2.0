import React, { useState } from 'react';
import { X, Rocket, Sparkles, Globe, Loader2, Download, Check } from 'lucide-react';
import { base44 } from '@/api/base44Client';

const CATEGORIES = ['interiors', 'gastronomy', 'atmosphere', 'architecture', 'branding'];
const CAT_LABELS = { interiors: 'Interieur', gastronomy: 'Gastronomie', atmosphere: 'Sfeer', architecture: 'Architectuur', branding: 'Branding' };

function Section({ icon: Icon, title, children }) {
  return (
    <div className="rounded-xl border border-border p-4 bg-card/40">
      <div className="flex items-center gap-2 mb-3">
        <Icon className="w-4 h-4 text-primary" />
        <h3 className="font-body text-[10px] tracking-[0.25em] uppercase text-primary">{title}</h3>
      </div>
      {children}
    </div>
  );
}

const inputCls = 'w-full bg-background border border-border rounded-lg px-3 py-2 text-sm';

export default function AdminPanel({ onClose, onChanged }) {
  const [kickstart, setKickstart] = useState({ limit: 15, running: false, result: null, error: null });
  const [discovery, setDiscovery] = useState({ theme: 'gastronomy', limit: 3, useWebSearch: false, running: false, result: null, error: null });
  const [google, setGoogle] = useState({ term: 'Bogèst restaurant', running: false, results: [], selected: new Set(), error: null });
  const [importing, setImporting] = useState(false);
  const [importResult, setImportResult] = useState(null);

  const runKickstart = async () => {
    setKickstart((k) => ({ ...k, running: true, result: null, error: null }));
    try {
      const res = await base44.functions.invoke('discoverAssets', { kickstart: true, limit: kickstart.limit });
      setKickstart((k) => ({ ...k, result: res.data, running: false }));
      onChanged?.();
    } catch (e) {
      setKickstart((k) => ({ ...k, error: e?.response?.data?.error || e?.message || 'Kickstart mislukt', running: false }));
    }
  };

  const runDiscovery = async () => {
    setDiscovery((d) => ({ ...d, running: true, result: null, error: null }));
    try {
      const res = await base44.functions.invoke('discoverAssets', { theme: discovery.theme, limit: discovery.limit, useWebSearch: discovery.useWebSearch });
      setDiscovery((d) => ({ ...d, result: res.data, running: false }));
      onChanged?.();
    } catch (e) {
      setDiscovery((d) => ({ ...d, error: e?.response?.data?.error || e?.message || 'Zoekopdracht mislukt', running: false }));
    }
  };

  const runGoogle = async () => {
    setGoogle((g) => ({ ...g, running: true, results: [], error: null }));
    try {
      const res = await base44.functions.invoke('googleImageSearch', { query: google.term || 'all', num: 10 });
      const imgs = res.data?.images || [];
      const all = new Set(imgs.map((i) => i.url));
      setGoogle((g) => ({ ...g, results: imgs, selected: all, running: false, error: res.data?.error || null }));
    } catch (e) {
      setGoogle((g) => ({ ...g, error: e?.response?.data?.error || e?.message || 'Google zoekopdracht mislukt', running: false }));
    }
  };

  const toggleSel = (url) => {
    setGoogle((g) => {
      const n = new Set(g.selected);
      if (n.has(url)) n.delete(url); else n.add(url);
      return { ...g, selected: n };
    });
  };

  const importSelected = async () => {
    const urls = Array.from(google.selected);
    if (!urls.length) return;
    setImporting(true);
    setImportResult(null);
    try {
      // 1) Vision-filter — alleen relevante Bogèst-foto's behouden
      const filterRes = await base44.functions.invoke('visionFilterAssets', { urls });
      const good = (filterRes.data?.goede_fotos || []).map((g) => g.url);
      if (!good.length) {
        setImportResult({ error: `Geen relevante Bogèst-foto's na vision-filter (${filterRes.data?.errors?.length || 0} fouten).`, filtered: 0, total: urls.length });
        setImporting(false);
        return;
      }
      // 2) Importeer de goedgekeurde foto's in de beeldbank
      const res = await base44.functions.invoke('discoverAssets', { importUrls: good });
      setImportResult({ ...res.data, filtered: good.length, total: urls.length, skippedFilter: urls.length - good.length });
      onChanged?.();
    } catch (e) {
      setImportResult({ error: e?.response?.data?.error || e?.message || 'Importeren mislukt' });
    }
    setImporting(false);
  };

  return (
    <>
      <div className="fixed inset-0 z-[110] bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="fixed top-0 left-0 bottom-0 z-[111] w-full max-w-md bg-background border-r border-border overflow-y-auto flex flex-col">
        <div className="sticky top-0 z-10 bg-background/90 backdrop-blur px-5 py-3 border-b border-border flex items-center justify-between">
          <h3 className="font-heading text-lg font-bold">Beheer</h3>
          <button onClick={onClose} className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-muted transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex-1 p-5 space-y-4">
          <Section icon={Rocket} title="Bibliotheek vullen">
            <p className="font-body text-xs text-muted-foreground mb-3 leading-relaxed">
              Importeert alle afbeeldingen van de website + gekende seeds en categoriseert ze.
            </p>
            <label className="block font-body text-xs text-muted-foreground mb-1">Aantal</label>
            <input type="number" min={1} max={40} value={kickstart.limit}
              onChange={(e) => setKickstart((k) => ({ ...k, limit: Math.max(1, Math.min(40, Number(e.target.value) || 1)) }))}
              className={inputCls + ' mb-3'} />
            <button onClick={runKickstart} disabled={kickstart.running}
              className="w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground text-sm py-2.5 rounded-lg hover:opacity-90 disabled:opacity-50">
              {kickstart.running ? <><Loader2 className="w-4 h-4 animate-spin" /> Vullen…</> : <><Rocket className="w-4 h-4" /> Vullen</>}
            </button>
            {kickstart.result && <p className="font-body text-[11px] text-primary mt-2">{kickstart.result.stored} toegevoegd · {kickstart.result.candidates} kandidaten</p>}
            {kickstart.error && <p className="font-body text-[11px] text-destructive mt-2">{kickstart.error}</p>}
          </Section>

          <Section icon={Sparkles} title="Thematische discovery">
            <p className="font-body text-xs text-muted-foreground mb-3">Lichte zoekopdracht per thema.</p>
            <label className="block font-body text-xs text-muted-foreground mb-1">Thema</label>
            <select value={discovery.theme} onChange={(e) => setDiscovery((d) => ({ ...d, theme: e.target.value }))} className={inputCls + ' mb-3'}>
              {CATEGORIES.map((c) => <option key={c} value={c}>{CAT_LABELS[c]}</option>)}
            </select>
            <label className="block font-body text-xs text-muted-foreground mb-1">Aantal</label>
            <input type="number" min={1} max={10} value={discovery.limit}
              onChange={(e) => setDiscovery((d) => ({ ...d, limit: Math.max(1, Math.min(10, Number(e.target.value) || 1)) }))}
              className={inputCls + ' mb-3'} />
            <label className="flex items-center gap-2.5 mb-3 cursor-pointer">
              <input type="checkbox" checked={discovery.useWebSearch} onChange={(e) => setDiscovery((d) => ({ ...d, useWebSearch: e.target.checked }))} className="w-4 h-4 accent-primary" />
              <span className="font-body text-xs text-foreground/70">Diep web-zoeken (trager)</span>
            </label>
            <button onClick={runDiscovery} disabled={discovery.running}
              className="w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground text-sm py-2.5 rounded-lg hover:opacity-90 disabled:opacity-50">
              {discovery.running ? <><Loader2 className="w-4 h-4 animate-spin" /> Bezig…</> : <><Sparkles className="w-4 h-4" /> Uitvoeren</>}
            </button>
            {discovery.result && <p className="font-body text-[11px] text-primary mt-2">{discovery.result.stored} toegevoegd · {discovery.result.candidates} kandidaten</p>}
            {discovery.error && <p className="font-body text-[11px] text-destructive mt-2">{discovery.error}</p>}
          </Section>

          <Section icon={Globe} title="Google afbeeldingen zoeken">
            <p className="font-body text-xs text-muted-foreground mb-3">Zoekt via Google Custom Search (searchType=image) naar Bogèst-foto's en importeert uw selectie in de beeldbank.</p>
            <label className="block font-body text-xs text-muted-foreground mb-1">Zoekterm</label>
            <input value={google.term} onChange={(e) => setGoogle((g) => ({ ...g, term: e.target.value }))} className={inputCls + ' mb-3'} placeholder="bv. Bogèst interieur" />
            <button onClick={runGoogle} disabled={google.running}
              className="w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground text-sm py-2.5 rounded-lg hover:opacity-90 disabled:opacity-50">
              {google.running ? <><Loader2 className="w-4 h-4 animate-spin" /> Zoeken…</> : <><Globe className="w-4 h-4" /> Zoeken</>}
            </button>
            {google.error && <p className="font-body text-[11px] text-destructive mt-2">{google.error}</p>}

            {google.results.length > 0 && (
              <div className="mt-4">
                <div className="flex items-center justify-between mb-2">
                  <p className="font-body text-[11px] text-muted-foreground">{google.results.length} resultaten · {google.selected.size} geselecteerd</p>
                  <button onClick={importSelected} disabled={importing || google.selected.size === 0}
                    className="flex items-center gap-1.5 text-xs bg-primary text-primary-foreground px-3 py-1.5 rounded-lg hover:opacity-90 disabled:opacity-50">
                    {importing ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Download className="w-3.5 h-3.5" />} Importeer
                  </button>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {google.results.map((img) => {
                    const sel = google.selected.has(img.url);
                    return (
                      <button key={img.url} onClick={() => toggleSel(img.url)} className="relative aspect-square rounded-lg overflow-hidden border-2 transition-colors"
                        style={{ borderColor: sel ? 'hsl(var(--primary))' : 'transparent' }}>
                        <img src={img.url} alt={img.title} className="w-full h-full object-cover" loading="lazy" />
                        <span className="absolute top-1 right-1 w-4 h-4 rounded-full flex items-center justify-center"
                          style={{ background: sel ? 'hsl(var(--primary))' : 'rgba(0,0,0,0.5)' }}>
                          {sel && <Check className="w-3 h-3 text-primary-foreground" />}
                        </span>
                      </button>
                    );
                  })}
                </div>
                {importResult && (
                  <p className="font-body text-[11px] mt-2 text-primary">
                    {importResult.error
                      ? importResult.error
                      : `${importResult.stored} geïmporteerd · ${importResult.skippedDup || 0} duplicaten · ${importResult.filtered}/${importResult.total} door vision-filter`}
                  </p>
                )}
              </div>
            )}
          </Section>
        </div>
      </div>
    </>
  );
}