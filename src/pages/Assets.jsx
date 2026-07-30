import React, { useState, useEffect, useCallback } from 'react';
import { Images, Sparkles, Loader2, Filter, Link2, ArrowDownWideNarrow, Rocket, Globe } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import AssetCard from '@/components/assets/AssetCard';

const CATEGORIES = ['interiors', 'gastronomy', 'atmosphere', 'architecture', 'branding'];
const CATEGORY_LABELS = {
  interiors: 'Interieur',
  gastronomy: 'Gastronomie',
  atmosphere: 'Sfeer',
  architecture: 'Architectuur',
  branding: 'Branding',
};
const THEMES = ['all', ...CATEGORIES];

export default function Assets() {
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(new Set()); // empty = Alle beelden
  const [sort, setSort] = useState('quality');
  const [showExport, setShowExport] = useState(false);
  const [discovery, setDiscovery] = useState({ theme: 'gastronomy', limit: 3, useWebSearch: false, running: false, result: null, error: null });
  const [kickstart, setKickstart] = useState({ limit: 15, running: false, result: null, error: null });
  const [webDiscovery, setWebDiscovery] = useState({ running: false, result: null, error: null });

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await base44.functions.invoke('assetsApi', { limit: 200 });
      setAssets(res.data?.items || []);
    } catch {
      setAssets([]);
    }
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const toggleCat = (c) => {
    setSelected((prev) => {
      const n = new Set(prev);
      if (n.has(c)) n.delete(c); else n.add(c);
      return n;
    });
  };

  const filtered = assets
    .filter((a) => selected.size === 0 || selected.has(a.primary_category))
    .sort((a, b) => sort === 'quality'
      ? (b.quality_score || 0) - (a.quality_score || 0)
      : new Date(b.created_date || 0) - new Date(a.created_date || 0));

  const runDiscovery = async () => {
    setDiscovery((d) => ({ ...d, running: true, result: null, error: null }));
    try {
      const res = await base44.functions.invoke('discoverAssets', { theme: discovery.theme, limit: discovery.limit, useWebSearch: discovery.useWebSearch, dryRun: false });
      setDiscovery((d) => ({ ...d, result: res.data, running: false }));
      load();
    } catch (e) {
      const msg = e?.response?.data?.error || e?.message || 'Zoekopdracht mislukt';
      setDiscovery((d) => ({ ...d, error: msg, running: false }));
    }
  };

  const runKickstart = async () => {
    setKickstart((k) => ({ ...k, running: true, result: null, error: null }));
    try {
      const res = await base44.functions.invoke('discoverAssets', { kickstart: true, limit: kickstart.limit });
      setKickstart((k) => ({ ...k, result: res.data, running: false }));
      load();
    } catch (e) {
      const msg = e?.response?.data?.error || e?.message || 'Kickstart mislukt';
      setKickstart((k) => ({ ...k, error: msg, running: false }));
    }
  };

  const runWebDiscovery = async () => {
    setWebDiscovery((w) => ({ ...w, running: true, result: null, error: null }));
    try {
      const res = await base44.functions.invoke('discoverAssets', { web: true, limit: 8 });
      setWebDiscovery((w) => ({ ...w, result: res.data, running: false }));
      load();
    } catch (e) {
      const msg = e?.response?.data?.error || e?.message || 'Zoekopdracht mislukt';
      setWebDiscovery((w) => ({ ...w, error: msg, running: false }));
    }
  };

  const deleteAsset = async (id) => {
    try {
      await base44.functions.invoke('assetsApi', { action: 'delete', id });
      setAssets((prev) => prev.filter((a) => a.id !== id));
    } catch {
      alert('Verwijderen mislukt');
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-16 px-4 md:px-8 lg:px-12">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="flex items-center gap-2 text-primary mb-2">
          <Images className="w-4 h-4" />
          <span className="font-body text-[10px] tracking-[0.3em] uppercase">Bogèst · Universele Beeldbank</span>
        </div>
        <h1 className="font-heading text-3xl md:text-4xl font-bold text-foreground">Merk &amp; Beeldbank</h1>
        <p className="font-body text-sm text-muted-foreground mt-2 max-w-xl">
          Zelfonderhoudend archief dat Bogèst-beelden ontdekt, analyseert en categoriseert — interieur, gastronomie, sfeer, architectuur en branding. Alleen voor intern gebruik.
        </p>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-6">
        {/* Sidebar */}
        <aside className="space-y-6">
          {/* Kickstart */}
          <div className="rounded-xl p-4 bg-primary/10 border border-primary/30">
            <div className="flex items-center gap-2 mb-2">
              <Rocket className="w-3.5 h-3.5 text-primary" />
              <h3 className="font-body text-[10px] tracking-[0.25em] uppercase text-primary">Bibliotheek kickstarten</h3>
            </div>
            <p className="font-body text-xs text-muted-foreground mb-3 leading-relaxed">
              Importeert alle afbeeldingen van de website + gekende seeds en voert een grondige zoekopdracht uit om de beeldbank direct te vullen.
            </p>
            <label className="block font-body text-xs text-muted-foreground mb-1">Aantal toevoegen</label>
            <input
              type="number" min={1} max={40} value={kickstart.limit}
              onChange={(e) => setKickstart((k) => ({ ...k, limit: Math.max(1, Math.min(40, Number(e.target.value) || 1)) }))}
              className="w-full mb-3 bg-background border border-border rounded-lg px-3 py-2 text-sm"
            />
            <button
              onClick={runKickstart}
              disabled={kickstart.running}
              className="w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground text-sm py-2.5 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {kickstart.running ? <><Loader2 className="w-4 h-4 animate-spin" /> Vullen…</> : <><Rocket className="w-4 h-4" /> Bibliotheek vullen</>}
            </button>
            {kickstart.running && <p className="font-body text-[11px] text-muted-foreground mt-2">Dit kan een minuut duren…</p>}
            {kickstart.result && (
              <p className="font-body text-[11px] text-primary mt-2">
                {kickstart.result.stored != null
                  ? `${kickstart.result.stored} toegevoegd · ${kickstart.result.candidates} kandidaten`
                  : 'Klaar'}
              </p>
            )}
            {kickstart.error && <p className="font-body text-[11px] text-destructive mt-2">{kickstart.error}</p>}
          </div>

          {/* Categories */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Filter className="w-3.5 h-3.5 text-primary" />
              <h3 className="font-body text-[10px] tracking-[0.25em] uppercase text-primary">Categorie</h3>
            </div>
            <button
              onClick={() => setSelected(new Set())}
              className={`w-full text-left font-body text-sm px-3 py-2 rounded-lg transition-colors mb-1 ${selected.size === 0 ? 'bg-primary/15 text-primary' : 'text-foreground/70 hover:bg-muted'}`}
            >
              Alle beelden <span className="text-xs text-muted-foreground">({assets.length})</span>
            </button>
            {CATEGORIES.map((c) => {
              const count = assets.filter((a) => a.primary_category === c).length;
              const active = selected.has(c);
              return (
                <label key={c} className="flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-muted cursor-pointer transition-colors">
                  <span className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${active ? 'bg-primary border-primary' : 'border-border'}`}>
                    {active && <span className="w-2 h-2 rounded-sm bg-primary-foreground" />}
                  </span>
                  <input type="checkbox" checked={active} onChange={() => toggleCat(c)} className="sr-only" />
                  <span className={`font-body text-sm ${active ? 'text-foreground' : 'text-foreground/70'}`}>{CATEGORY_LABELS[c]}</span>
                  <span className="text-xs text-muted-foreground ml-auto">{count}</span>
                </label>
              );
            })}
          </div>

          {/* Sort + Export */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <ArrowDownWideNarrow className="w-3.5 h-3.5 text-primary" />
              <h3 className="font-body text-[10px] tracking-[0.25em] uppercase text-primary">Sorteren</h3>
            </div>
            <div className="flex gap-2">
              <button onClick={() => setSort('quality')} className={`flex-1 text-xs py-1.5 rounded-lg border transition-colors ${sort === 'quality' ? 'bg-primary/15 text-primary border-primary/30' : 'border-border text-foreground/70'}`}>Kwaliteit</button>
              <button onClick={() => setSort('date')} className={`flex-1 text-xs py-1.5 rounded-lg border transition-colors ${sort === 'date' ? 'bg-primary/15 text-primary border-primary/30' : 'border-border text-foreground/70'}`}>Nieuwste</button>
            </div>
            <button
              onClick={() => setShowExport((s) => !s)}
              className={`w-full flex items-center justify-center gap-2 text-xs py-2 rounded-lg border transition-colors ${showExport ? 'bg-primary/15 text-primary border-primary/30' : 'border-border text-foreground/70 hover:bg-muted'}`}
            >
              <Link2 className="w-3.5 h-3.5" /> Auto-export CDN-links
            </button>
          </div>

          {/* Run Discovery (light top-up) */}
          <div className="rounded-xl border border-border p-4 bg-card/40">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-3.5 h-3.5 text-primary" />
              <h3 className="font-body text-[10px] tracking-[0.25em] uppercase text-primary">Discovery draaien</h3>
            </div>
            <p className="font-body text-[11px] text-muted-foreground mb-3">Lichte zoekopdracht per thema — om de beeldbank aan te vullen.</p>
            <label className="block font-body text-xs text-muted-foreground mb-1">Thema</label>
            <select
              value={discovery.theme}
              onChange={(e) => setDiscovery((d) => ({ ...d, theme: e.target.value }))}
              className="w-full mb-3 bg-background border border-border rounded-lg px-3 py-2 text-sm"
            >
              {THEMES.map((t) => <option key={t} value={t}>{t === 'all' ? 'Alle thema\'s' : CATEGORY_LABELS[t]}</option>)}
            </select>
            <label className="block font-body text-xs text-muted-foreground mb-1">Aantal toevoegen</label>
            <input
              type="number" min={1} max={10} value={discovery.limit}
              onChange={(e) => setDiscovery((d) => ({ ...d, limit: Math.max(1, Math.min(10, Number(e.target.value) || 1)) }))}
              className="w-full mb-3 bg-background border border-border rounded-lg px-3 py-2 text-sm"
            />
            <label className="flex items-center gap-2.5 px-1 mb-3 cursor-pointer">
              <input
                type="checkbox"
                checked={discovery.useWebSearch}
                onChange={(e) => setDiscovery((d) => ({ ...d, useWebSearch: e.target.checked }))}
                className="w-4 h-4 rounded border-border accent-primary"
              />
              <span className="font-body text-xs text-foreground/70">Diep web-zoeken (trager, breder)</span>
            </label>
            <button
              onClick={runDiscovery}
              disabled={discovery.running}
              className="w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground text-sm py-2 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {discovery.running ? <><Loader2 className="w-4 h-4 animate-spin" /> Bezig…</> : <><Sparkles className="w-4 h-4" /> Uitvoeren</>}
            </button>
            {discovery.result && (
              <p className="font-body text-[11px] text-primary mt-2">
                {discovery.result.stored != null
                  ? `${discovery.result.stored} toegevoegd · ${discovery.result.candidates} kandidaten`
                  : 'Klaar'}
              </p>
            )}
            {discovery.error && <p className="font-body text-[11px] text-destructive mt-2">{discovery.error}</p>}
          </div>

          {/* Openbaar web doorzoeken */}
          <div className="rounded-xl border border-border p-4 bg-card/40">
            <div className="flex items-center gap-2 mb-2">
              <Globe className="w-3.5 h-3.5 text-primary" />
              <h3 className="font-body text-[10px] tracking-[0.25em] uppercase text-primary">Openbaar web doorzoeken</h3>
            </div>
            <p className="font-body text-[11px] text-muted-foreground mb-3">Zoekt op het openbare internet (reviews, blogs, nieuws, social) naar nieuwe Bogèst-foto's.</p>
            <button
              onClick={runWebDiscovery}
              disabled={webDiscovery.running}
              className="w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground text-sm py-2 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {webDiscovery.running ? <><Loader2 className="w-4 h-4 animate-spin" /> Bezig…</> : <><Globe className="w-4 h-4" /> Doorzoeken</>}
            </button>
            {webDiscovery.running && <p className="font-body text-[11px] text-muted-foreground mt-2">Dit kan een minuut duren…</p>}
            {webDiscovery.result && (
              <p className="font-body text-[11px] text-primary mt-2">
                {webDiscovery.result.stored != null
                  ? `${webDiscovery.result.stored} toegevoegd · ${webDiscovery.result.candidates} kandidaten`
                  : 'Klaar'}
              </p>
            )}
            {webDiscovery.error && <p className="font-body text-[11px] text-destructive mt-2">{webDiscovery.error}</p>}
          </div>
        </aside>

        {/* Gallery */}
        <div>
          {loading ? (
            <div className="flex items-center justify-center py-24">
              <Loader2 className="w-6 h-6 animate-spin text-primary" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <Images className="w-10 h-10 text-muted-foreground/40 mb-3" />
              <p className="font-body text-sm text-muted-foreground">Nog geen beelden. Klik op ‘Bibliotheek vullen’ om de beeldbank te kickstarten.</p>
            </div>
          ) : (
            <div className="columns-1 sm:columns-2 xl:columns-3 gap-4">
              {filtered.map((a) => (
                <AssetCard key={a.id} asset={a} showExport={showExport} onDelete={deleteAsset} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}