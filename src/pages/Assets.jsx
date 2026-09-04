import React, { useState, useEffect, useCallback } from 'react';
import { Search, Loader2, X, Layers, SlidersHorizontal } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import AssetCard from '@/components/assets/AssetCard';
import AssetDetail from '@/components/assets/AssetDetail';
import AdminPanel from '@/components/assets/AdminPanel';
import { ASSET_VIEWS, LOCATIONS } from '@/lib/assetViews';
import { assetGroups } from '@/lib/assetTaxonomy';

const STOP_WORDS = new Set([
  'show', 'me', 'find', 'a', 'an', 'the', 'of', 'with', 'and', 'or', 'for', 'to', 'in', 'at', 'on', 'by',
  'photos', 'photo', 'pictures', 'picture', 'image', 'images', 'served', 'that', 'are', 'is', 'was',
  'van', 'een', 'de', 'het', 'met', 'en', 'fotos', 'foto', 'afbeelding', 'toon', 'laat', 'zien', 'vind', 'zoek',
  'montre', 'moi', 'une', 'des', 'un', 'le', 'la', 'les', 'avec', 'pour', 'de',
]);

// Beeldbank — minimalistisch: meteen de galerij, een zoekbalk, twee filters
// en een raster. Detail- en beheerpanelen schuiven via een portal zuiver over
// het scherm. data-bb-ui houdt de site-brede afbeeldingen-override buiten de
// galerij, zodat het archief altijd de originele beelden toont.
export default function Assets() {
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);
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

  // Direct laden — geen intro-scherm, meteen de beelden.
  useEffect(() => { load(); }, [load]);

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

  // Categorie- en locatiefilter (multi-categorie bewust)
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

  // Natuurlijke taal-zoekopdracht over categorieën, tags, beschrijving en meta
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

  const viewCount = (v) =>
    v.key === 'all'
      ? assets.length
      : v.key === 'videos'
        ? assets.filter((a) => a.media_type === 'video').length
        : assets.filter((a) => { const g = assetGroups(a); return v.groups.some((gr) => g.has(gr)); }).length;
  const locCount = (l) => (l.key === 'all' ? assets.length : assets.filter((a) => a.location === l.key).length);

  return (
    <div data-bb-ui className="max-w-6xl">
      {/* Kop */}
      <div className="flex flex-wrap items-end justify-between gap-3 mb-5">
        <div>
          <span className="font-body text-[10px] tracking-[0.3em] uppercase text-primary block mb-1">Bogèst</span>
          <h2 className="font-heading text-2xl font-bold leading-none">Beeldbank</h2>
          <p className="font-body text-xs text-muted-foreground mt-1.5">{assets.length} beelden</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={runDedupe} disabled={deduping} className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-border text-sm hover:bg-muted disabled:opacity-50 transition-colors">
            {deduping ? <Loader2 className="w-4 h-4 animate-spin" /> : <Layers className="w-4 h-4 text-primary" />} Ontdubbel
          </button>
          <button onClick={() => setShowAdmin(true)} className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-primary text-primary-foreground text-sm hover:opacity-90 transition-opacity">
            <SlidersHorizontal className="w-4 h-4" /> Beheer
          </button>
        </div>
      </div>
      {dedupMsg && <p className="font-body text-xs text-primary -mt-3 mb-4">{dedupMsg}</p>}

      {/* Zoeken + filters */}
      <div className="flex flex-col sm:flex-row gap-2.5 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Zoek beelden…"
            className="bogest-input pl-9 pr-8"
          />
          {search && (
            <button onClick={() => setSearch('')} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
        <select value={activeView} onChange={(e) => setActiveView(e.target.value)} className="bogest-input sm:w-48">
          {ASSET_VIEWS.map((v) => (
            <option key={v.key} value={v.key}>{v.label} ({viewCount(v)})</option>
          ))}
        </select>
        <select value={activeLoc} onChange={(e) => setActiveLoc(e.target.value)} className="bogest-input sm:w-44">
          {LOCATIONS.map((l) => (
            <option key={l.key} value={l.key}>{l.label} ({locCount(l)})</option>
          ))}
        </select>
        {!q && (
          <select value={sort} onChange={(e) => setSort(e.target.value)} className="bogest-input sm:w-36">
            <option value="quality">Op kwaliteit</option>
            <option value="date">Nieuwste eerst</option>
          </select>
        )}
      </div>

      {/* Raster */}
      {loading ? (
        <div className="flex items-center justify-center py-32">
          <Loader2 className="w-6 h-6 animate-spin text-primary" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-32 text-center gap-3">
          <p className="font-body text-sm text-muted-foreground">
            {search || activeView !== 'all' || activeLoc !== 'all'
              ? 'Geen beelden gevonden. Pas uw filter of zoekopdracht aan.'
              : 'Nog geen beelden. Open Beheer om de beeldbank te vullen.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-5">
          {filtered.map((a) => (
            <AssetCard key={a.id} asset={a} onClick={setDetailAsset} />
          ))}
        </div>
      )}

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