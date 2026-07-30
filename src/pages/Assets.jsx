import React, { useState, useEffect, useCallback } from 'react';
import { Images, Search, Loader2, X } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import AssetCard from '@/components/assets/AssetCard';
import AssetDetail from '@/components/assets/AssetDetail';
import AdminPanel from '@/components/assets/AdminPanel';
import AssetIntro from '@/components/assets/AssetIntro';
import { TAXONOMY_GROUPS, groupLabel, assetGroups } from '@/lib/assetTaxonomy';

const STOP_WORDS = new Set([
  'show', 'me', 'find', 'a', 'an', 'the', 'of', 'with', 'and', 'or', 'for', 'to', 'in', 'at', 'on', 'by',
  'photos', 'photo', 'pictures', 'picture', 'image', 'images', 'served', 'that', 'are', 'is', 'was',
  'van', 'een', 'de', 'het', 'met', 'en', 'of', 'fotos', 'foto', 'afbeelding', 'toon', 'laat', 'zien', 'vind', 'zoek',
  'montre', 'moi', 'une', 'des', 'un', 'le', 'la', 'les', 'avec', 'pour', 'de',
]);

export default function Assets() {
  const [view, setView] = useState('intro');
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [selectedGroups, setSelectedGroups] = useState(new Set());
  const [sort, setSort] = useState('quality');
  const [showAdmin, setShowAdmin] = useState(false);
  const [detailAsset, setDetailAsset] = useState(null);

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

  const toggleGroup = (g) => {
    setSelectedGroups((prev) => {
      const n = new Set(prev);
      if (n.has(g)) n.delete(g); else n.add(g);
      return n;
    });
  };

  // Group filter (multi-category aware, with legacy fallback)
  const groupFiltered = assets.filter((a) => {
    if (selectedGroups.size === 0) return true;
    const groups = assetGroups(a);
    for (const g of selectedGroups) if (groups.has(g)) return true;
    return false;
  });

  // Natural-language search across categories + tags + description + meta.
  const q = search.trim().toLowerCase();
  const tokens = q ? q.split(/\s+/).filter((t) => t.length > 1 && !STOP_WORDS.has(t)) : [];

  const hayOf = (a) => [
    ...(a.categories || []),
    ...(a.tags || []),
    a.description, a.subcategory, a.mood, a.source_platform, a.primary_category, a.location,
  ].join(' ').toLowerCase();

  let filtered;
  if (q && tokens.length) {
    filtered = groupFiltered
      .map((a) => {
        const hay = hayOf(a);
        const score = tokens.reduce((s, t) => s + (hay.includes(t) ? 1 : 0), 0);
        return { a, score };
      })
      .filter((x) => x.score > 0)
      .sort((x, y) => y.score - x.score || (y.a.quality_score || 0) - (x.a.quality_score || 0))
      .map((x) => x.a);
  } else {
    filtered = [...groupFiltered].sort((a, b) =>
      sort === 'quality'
        ? (b.quality_score || 0) - (a.quality_score || 0)
        : new Date(b.created_date || 0) - new Date(a.created_date || 0)
    );
  }

  const onSaved = (item) => {
    if (item) setAssets((prev) => prev.map((a) => (a.id === item.id ? item : a)));
    setDetailAsset(null);
  };
  const onDeleted = (id) => {
    setAssets((prev) => prev.filter((a) => a.id !== id));
    setDetailAsset(null);
  };

  if (view === 'intro') {
    return (
      <>
        <AssetIntro count={assets.length} onView={enterGallery} onAdmin={() => setShowAdmin(true)} />
        {showAdmin && <AdminPanel onClose={() => setShowAdmin(false)} onChanged={load} />}
      </>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-16 px-4 md:px-8 lg:px-12">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-start justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2 text-primary mb-2">
              <Images className="w-4 h-4" />
              <span className="font-body text-[10px] tracking-[0.3em] uppercase">Bogèst · Beeldbank</span>
            </div>
            <h1 className="font-heading text-3xl md:text-4xl font-bold text-foreground">Beeldbank</h1>
            <p className="font-body text-sm text-muted-foreground mt-2 max-w-xl">
              {assets.length} beelden · doorzoek natuurlijk — categorieën, tags en beschrijving samen.
            </p>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <button onClick={() => setView('intro')} className="px-4 py-2.5 rounded-lg border border-border bg-card/50 hover:bg-muted transition-colors text-sm text-muted-foreground">←</button>
            <button onClick={() => setShowAdmin(true)} className="px-4 py-2.5 rounded-lg border border-border bg-card/50 hover:bg-muted transition-colors text-sm">Beheer</button>
          </div>
        </div>

        {/* Natural-language search */}
        <div className="flex flex-col sm:flex-row gap-3 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="bv. toon Belgisch Blauw gerechten in de avond · romantic terrace · gezellig interieur met haard"
              className="w-full pl-10 pr-10 py-3 rounded-xl bg-card/60 border border-border focus:outline-none focus:border-primary text-sm"
            />
            {search && (
              <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
          {!q && (
            <div className="flex gap-2">
              <button onClick={() => setSort('quality')} className={`px-4 py-3 rounded-xl border text-sm transition-colors ${sort === 'quality' ? 'bg-primary/15 text-primary border-primary/30' : 'border-border text-muted-foreground hover:bg-muted'}`}>Kwaliteit</button>
              <button onClick={() => setSort('date')} className={`px-4 py-3 rounded-xl border text-sm transition-colors ${sort === 'date' ? 'bg-primary/15 text-primary border-primary/30' : 'border-border text-muted-foreground hover:bg-muted'}`}>Nieuwste</button>
            </div>
          )}
        </div>

        {/* Category group chips */}
        <div className="flex flex-wrap gap-2 mb-6">
          <button
            onClick={() => setSelectedGroups(new Set())}
            className={`px-4 py-1.5 rounded-full text-sm transition-colors ${selectedGroups.size === 0 ? 'bg-primary text-primary-foreground' : 'border border-border text-muted-foreground hover:bg-muted'}`}
          >
            Alle <span className="opacity-70 ml-1">{assets.length}</span>
          </button>
          {TAXONOMY_GROUPS.map((g) => {
            const count = assets.filter((a) => assetGroups(a).has(g)).length;
            if (count === 0) return null;
            const active = selectedGroups.has(g);
            return (
              <button
                key={g}
                onClick={() => toggleGroup(g)}
                className={`px-4 py-1.5 rounded-full text-sm transition-colors ${active ? 'bg-primary text-primary-foreground' : 'border border-border text-muted-foreground hover:bg-muted'}`}
              >
                {groupLabel(g)} <span className="opacity-70 ml-1">{count}</span>
              </button>
            );
          })}
        </div>

        {/* Gallery */}
        {loading ? (
          <div className="flex items-center justify-center py-24">
            <Loader2 className="w-6 h-6 animate-spin text-primary" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <Images className="w-10 h-10 text-muted-foreground/40 mb-3" />
            <p className="font-body text-sm text-muted-foreground">
              {search || selectedGroups.size ? 'Geen beelden gevonden. Pas uw zoekopdracht aan.' : 'Nog geen beelden. Open Beheer om de beeldbank te vullen.'}
            </p>
          </div>
        ) : (
          <div className="columns-1 sm:columns-2 xl:columns-3 gap-4">
            {filtered.map((a) => (
              <AssetCard key={a.id} asset={a} onClick={setDetailAsset} />
            ))}
          </div>
        )}
      </div>

      {showAdmin && <AdminPanel onClose={() => setShowAdmin(false)} onChanged={load} />}
      <AssetDetail asset={detailAsset} onClose={() => setDetailAsset(null)} onSaved={onSaved} onDeleted={onDeleted} />
    </div>
  );
}