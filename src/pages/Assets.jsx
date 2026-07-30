import React, { useState, useEffect, useCallback } from 'react';
import { Images, Search, SlidersHorizontal, Loader2, X } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import AssetCard from '@/components/assets/AssetCard';
import AssetDetail from '@/components/assets/AssetDetail';
import AdminPanel from '@/components/assets/AdminPanel';

const CATEGORIES = ['interiors', 'gastronomy', 'atmosphere', 'architecture', 'branding'];
const CATEGORY_LABELS = {
  interiors: 'Interieur',
  gastronomy: 'Gastronomie',
  atmosphere: 'Sfeer',
  architecture: 'Architectuur',
  branding: 'Branding',
};

export default function Assets() {
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCats, setSelectedCats] = useState(new Set());
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

  useEffect(() => { load(); }, [load]);

  const toggleCat = (c) => {
    setSelectedCats((prev) => {
      const n = new Set(prev);
      if (n.has(c)) n.delete(c); else n.add(c);
      return n;
    });
  };

  const filtered = assets
    .filter((a) => selectedCats.size === 0 || selectedCats.has(a.primary_category))
    .filter((a) => {
      if (!search.trim()) return true;
      const q = search.toLowerCase();
      return (
        (a.description || '').toLowerCase().includes(q) ||
        (a.subcategory || '').toLowerCase().includes(q) ||
        (a.mood || '').toLowerCase().includes(q) ||
        (a.primary_category || '').toLowerCase().includes(q) ||
        (a.tags || []).some((t) => t.toLowerCase().includes(q)) ||
        (a.collections || []).some((c) => c.toLowerCase().includes(q))
      );
    })
    .sort((a, b) => sort === 'quality'
      ? (b.quality_score || 0) - (a.quality_score || 0)
      : new Date(b.created_date || 0) - new Date(a.created_date || 0));

  const onSaved = (item) => {
    if (item) setAssets((prev) => prev.map((a) => (a.id === item.id ? item : a)));
    setDetailAsset(null);
  };
  const onDeleted = (id) => {
    setAssets((prev) => prev.filter((a) => a.id !== id));
    setDetailAsset(null);
  };

  return (
    <div className="min-h-screen pt-24 pb-16 px-4 md:px-8 lg:px-12">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2 text-primary mb-2">
              <Images className="w-4 h-4" />
              <span className="font-body text-[10px] tracking-[0.3em] uppercase">Bogèst · Beeldbank</span>
            </div>
            <h1 className="font-heading text-3xl md:text-4xl font-bold text-foreground">Beeldbank</h1>
            <p className="font-body text-sm text-muted-foreground mt-2 max-w-xl">
              {assets.length} beelden · interieur, gastronomie, sfeer, architectuur en branding. Klik een beeld om alle info te bekijken en aan te passen.
            </p>
          </div>
          <button
            onClick={() => setShowAdmin(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-border bg-card/50 hover:bg-muted transition-colors text-sm flex-shrink-0"
          >
            <SlidersHorizontal className="w-4 h-4 text-primary" /> Beheer
          </button>
        </div>

        {/* Toolbar — search + sort */}
        <div className="flex flex-col sm:flex-row gap-3 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Zoek op beschrijving, tag, sfeer…"
              className="w-full pl-10 pr-10 py-3 rounded-xl bg-card/60 border border-border focus:outline-none focus:border-primary text-sm"
            />
            {search && (
              <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
          <div className="flex gap-2">
            <button onClick={() => setSort('quality')} className={`px-4 py-3 rounded-xl border text-sm transition-colors ${sort === 'quality' ? 'bg-primary/15 text-primary border-primary/30' : 'border-border text-muted-foreground hover:bg-muted'}`}>Kwaliteit</button>
            <button onClick={() => setSort('date')} className={`px-4 py-3 rounded-xl border text-sm transition-colors ${sort === 'date' ? 'bg-primary/15 text-primary border-primary/30' : 'border-border text-muted-foreground hover:bg-muted'}`}>Nieuwste</button>
          </div>
        </div>

        {/* Category chips */}
        <div className="flex flex-wrap gap-2 mb-6">
          <button
            onClick={() => setSelectedCats(new Set())}
            className={`px-4 py-1.5 rounded-full text-sm transition-colors ${selectedCats.size === 0 ? 'bg-primary text-primary-foreground' : 'border border-border text-muted-foreground hover:bg-muted'}`}
          >
            Alle <span className="opacity-70 ml-1">{assets.length}</span>
          </button>
          {CATEGORIES.map((c) => {
            const count = assets.filter((a) => a.primary_category === c).length;
            const active = selectedCats.has(c);
            return (
              <button
                key={c}
                onClick={() => toggleCat(c)}
                className={`px-4 py-1.5 rounded-full text-sm transition-colors ${active ? 'bg-primary text-primary-foreground' : 'border border-border text-muted-foreground hover:bg-muted'}`}
              >
                {CATEGORY_LABELS[c]} <span className="opacity-70 ml-1">{count}</span>
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
              {search || selectedCats.size ? 'Geen beelden gevonden. Pas uw zoekopdracht aan.' : 'Nog geen beelden. Open Beheer om de beeldbank te vullen.'}
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