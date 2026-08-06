import React, { useState, useCallback } from 'react';
import { Search, Loader2, X, Layers, SlidersHorizontal, ArrowLeft } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import AssetCard from '@/components/assets/AssetCard';
import AssetDetail from '@/components/assets/AssetDetail';
import AdminPanel from '@/components/assets/AdminPanel';
import AssetIntro from '@/components/assets/AssetIntro';
import { ASSET_VIEWS, LOCATIONS } from '@/lib/assetViews';
import { assetGroups } from '@/lib/assetTaxonomy';

const STOP_WORDS = new Set([
  'show', 'me', 'find', 'a', 'an', 'the', 'of', 'with', 'and', 'or', 'for', 'to', 'in', 'at', 'on', 'by',
  'photos', 'photo', 'pictures', 'picture', 'image', 'images', 'served', 'that', 'are', 'is', 'was',
  'van', 'een', 'de', 'het', 'met', 'en', 'fotos', 'foto', 'afbeelding', 'toon', 'laat', 'zien', 'vind', 'zoek',
  'montre', 'moi', 'une', 'des', 'un', 'le', 'la', 'les', 'avec', 'pour', 'de',
]);

export default function Assets() {
  const [view, setView] = useState('intro');
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [activeView, setActiveView] = useState('all');
  const [activeLoc, setActiveLoc] = useState('all');
  const [sort, setSort] = useState('quality');
  const [showAdmin, setShowAdmin] = useState(false);
  const [detailAsset, setDetailAsset] = useState(null);
  const [deduping, setDeduping] = useState(false);
  const [dedupMsg, setDedupMsg] = useState('');

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

  const enterGallery = useCallback(() => {
    setView('gallery');
    if (assets.length === 0 && !loading) load();
  }, [assets.length, loading, load]);

  const runDedupe = async () => {
    setDeduping(true);
    try {
      const res = await base44.functions.invoke('dedupeAssets', {});
      setDedupMsg(`${res.data?.removed ?? 0} dubbele verwijderd`);
      load();
    } catch {
      setDedupMsg('Ontdubbeling mislukt');
    }
    setDeduping(false);
    setTimeout(() => setDedupMsg(''), 4500);
  };

  // View + location filter (multi-category aware)
  let filtered = assets;
  if (activeView !== 'all') {
    const v = ASSET_VIEWS.find((x) => x.key === activeView);
    if (v?.groups) {
      filtered = filtered.filter((a) => {
        const g = assetGroups(a);
        return v.groups.some((gr) => g.has(gr));
      });
    } else if (activeView === 'videos') {
      filtered = filtered.filter((a) => a.media_type === 'video');
    }
  }
  if (activeLoc !== 'all') filtered = filtered.filter((a) => a.location === activeLoc);

  // Natural-language search across categories + tags + description + meta
  const q = search.trim().toLowerCase();
  const tokens = q ? q.split(/\s+/).filter((t) => t.length > 1 && !STOP_WORDS.has(t)) : [];
  const hayOf = (a) => [
    ...(a.categories || []),
    ...(a.tags || []),
    a.description, a.mood, a.source_platform, a.primary_category, a.location,
  ].join(' ').toLowerCase();

  if (q && tokens.length) {
    filtered = filtered
      .map((a) => {
        const hay = hayOf(a);
        const s = tokens.reduce((acc, t) => acc + (hay.includes(t) ? 1 : 0), 0);
        return { a, s };
      })
      .filter((x) => x.s > 0)
      .sort((x, y) => y.s - x.s || (y.a.quality_score || 0) - (x.a.quality_score || 0))
      .map((x) => x.a);
  } else {
    filtered = [...filtered].sort((a, b) =>
      sort === 'quality'
        ? (b.quality_score || 0) - (a.quality_score || 0)
        : new Date(b.created_date || 0) - new Date(a.created_date || 0)
    );
  }

  if (view === 'intro') {
    return (
      <>
        <AssetIntro count={assets.length} onView={enterGallery} onAdmin={() => setShowAdmin(true)} />
        {showAdmin && <AdminPanel onClose={() => setShowAdmin(false)} onChanged={load} />}
      </>
    );
  }

  const activeViewLabel = ASSET_VIEWS.find((v) => v.key === activeView)?.label;
  const activeLocLabel = LOCATIONS.find((l) => l.key === activeLoc)?.label;

  return (
    <div className="min-h-screen md:pt-16">
      <div className="md:flex">
        {/* Sidebar */}
        <aside className="md:w-72 md:flex-shrink-0 md:sticky md:top-16 md:h-[calc(100vh-4rem)] md:overflow-y-auto border-b md:border-b-0 md:border-r border-border/70 bg-background/60 backdrop-blur p-5 md:p-6 flex flex-col gap-7 bogest-scroll">
          <div className="flex items-start justify-between gap-2">
            <div>
              <span className="font-body text-[10px] tracking-[0.3em] uppercase text-primary block mb-1">Bogèst</span>
              <h1 className="font-heading text-2xl font-bold leading-none">Beeldbank</h1>
              <p className="font-body text-xs text-muted-foreground mt-1.5">{assets.length} beelden</p>
            </div>
            <button onClick={() => setView('intro')} className="w-8 h-8 rounded-lg flex items-center justify-center text-muted-foreground hover:bg-muted transition-colors" title="Terug">
              <ArrowLeft className="w-4 h-4" />
            </button>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Zoek beelden…"
              className="w-full pl-9 pr-8 py-3 rounded-xl bg-card/40 border border-border focus:outline-none focus:border-primary text-sm"
            />
            {search && (
              <button onClick={() => setSearch('')} className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Category views */}
          <div>
            <p className="font-body text-[10px] tracking-[0.2em] uppercase text-muted-foreground mb-2">Categorie</p>
            <div className="flex md:flex-col gap-1 overflow-x-auto md:overflow-visible -mx-1 px-1 md:mx-0 md:px-0">
              {ASSET_VIEWS.map((v) => {
                const count = v.key === 'all'
                  ? assets.length
                  : v.key === 'videos'
                    ? assets.filter((a) => a.media_type === 'video').length
                    : assets.filter((a) => { const g = assetGroups(a); return v.groups.some((gr) => g.has(gr)); }).length;
                const active = activeView === v.key;
                return (
                  <button
                    key={v.key}
                    onClick={() => setActiveView(v.key)}
                    className={`flex items-center justify-between gap-2 whitespace-nowrap px-3.5 py-2 rounded-xl text-sm transition-colors ${active ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-muted/60'}`}
                  >
                    <span>{v.label}</span>
                    <span className={`text-xs ${active ? 'opacity-70' : 'opacity-50'}`}>{count}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Locations */}
          <div>
            <p className="font-body text-[10px] tracking-[0.2em] uppercase text-muted-foreground mb-2">Locatie</p>
            <div className="flex md:flex-col gap-1 overflow-x-auto md:overflow-visible -mx-1 px-1 md:mx-0 md:px-0">
              {LOCATIONS.map((l) => {
                const count = l.key === 'all' ? assets.length : assets.filter((a) => a.location === l.key).length;
                const active = activeLoc === l.key;
                return (
                  <button
                    key={l.key}
                    onClick={() => setActiveLoc(l.key)}
                    className={`flex items-center justify-between gap-2 whitespace-nowrap px-3.5 py-2 rounded-xl text-sm transition-colors border ${active ? 'bg-primary/15 text-primary border-primary/30' : 'text-muted-foreground hover:bg-muted/60 border-transparent'}`}
                  >
                    <span>{l.label}</span>
                    <span className="text-xs opacity-50">{count}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Admin actions */}
          <div className="mt-auto pt-4 border-t border-border flex flex-col gap-2">
            <button onClick={runDedupe} disabled={deduping} className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg border border-border text-sm hover:bg-muted disabled:opacity-50 transition-colors">
              {deduping ? <Loader2 className="w-4 h-4 animate-spin" /> : <Layers className="w-4 h-4 text-primary" />} Ontdubbel
            </button>
            <button onClick={() => setShowAdmin(true)} className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm hover:opacity-90 transition-opacity">
              <SlidersHorizontal className="w-4 h-4" /> Beheer
            </button>
            {dedupMsg && <p className="font-body text-xs text-primary text-center">{dedupMsg}</p>}
          </div>
        </aside>

        {/* Main gallery */}
        <main className="flex-1 p-6 md:p-10 min-w-0">
          <div className="flex items-center justify-between mb-5 gap-3">
            <p className="font-body text-sm text-muted-foreground truncate">
              {filtered.length} beelden{activeView !== 'all' && ` · ${activeViewLabel}`}{activeLoc !== 'all' && ` · ${activeLocLabel}`}
            </p>
            {!q && (
              <div className="flex gap-1.5 flex-shrink-0">
                <button onClick={() => setSort('quality')} className={`px-3 py-1.5 rounded-lg text-xs transition-colors ${sort === 'quality' ? 'bg-primary/15 text-primary' : 'text-muted-foreground hover:bg-muted'}`}>Kwaliteit</button>
                <button onClick={() => setSort('date')} className={`px-3 py-1.5 rounded-lg text-xs transition-colors ${sort === 'date' ? 'bg-primary/15 text-primary' : 'text-muted-foreground hover:bg-muted'}`}>Nieuweste</button>
              </div>
            )}
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-32">
              <Loader2 className="w-6 h-6 animate-spin text-primary" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-32 text-center">
              <p className="font-body text-sm text-muted-foreground">
                {search || activeView !== 'all' || activeLoc !== 'all' ? 'Geen beelden gevonden. Pas uw filter aan.' : 'Nog geen beelden. Open Beheer om de beeldbank te vullen.'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-5">
              {filtered.map((a) => (
                <AssetCard key={a.id} asset={a} onClick={setDetailAsset} />
              ))}
            </div>
          )}
        </main>
      </div>

      {showAdmin && <AdminPanel onClose={() => setShowAdmin(false)} onChanged={load} />}
      <AssetDetail
        asset={detailAsset}
        onClose={() => setDetailAsset(null)}
        onSaved={(item) => { if (item) setAssets((prev) => prev.map((a) => (a.id === item.id ? item : a))); setDetailAsset(null); }}
        onDeleted={(id) => { setAssets((prev) => prev.filter((a) => a.id !== id)); setDetailAsset(null); }}
      />
    </div>
  );
}