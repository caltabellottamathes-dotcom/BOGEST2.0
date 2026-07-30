import React, { useState, useEffect, useMemo } from 'react';
import { X, Globe, Check, RotateCcw, Loader2, Search, ArrowLeft, ImageOff } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { useSiteImages } from '@/lib/SiteImageContext';
import { SITE_PAGES } from '@/lib/siteImages';

// Reverse flow: browse every page of the website with the photo currently
// shown on the live site. Click a photo to replace it with another image from
// the Beeldbank library.
export default function WebsiteImagesPanel({ onClose, onChanged }) {
  const { positions, setOverride, clearOverride } = useSiteImages();
  const [page, setPage] = useState('all');
  const [picker, setPicker] = useState(null);
  const [assets, setAssets] = useState([]);
  const [loadingLib, setLoadingLib] = useState(false);
  const [search, setSearch] = useState('');
  const [busy, setBusy] = useState(null);
  const [justSet, setJustSet] = useState(null);

  const grouped = useMemo(() => {
    const list = page === 'all' ? positions : positions.filter((p) => p.pages.includes(page));
    const map = new Map();
    for (const p of list) {
      const pk = page !== 'all' ? page : p.pages[0];
      const pg = SITE_PAGES.find((s) => s.key === pk);
      const label = pg?.label || pk;
      if (!map.has(label)) map.set(label, []);
      map.get(label).push(p);
    }
    return Array.from(map, ([pg, items]) => ({ page: pg, items }));
  }, [positions, page]);

  const openPicker = async (pos) => {
    setPicker(pos);
    setSearch('');
    if (assets.length === 0) {
      setLoadingLib(true);
      try {
        const res = await base44.functions.invoke('assetsApi', { limit: 200 });
        setAssets(res.data?.items || []);
      } catch {
        setAssets([]);
      }
      setLoadingLib(false);
    }
  };

  const choose = async (asset) => {
    if (!picker) return;
    setBusy(picker.key);
    try {
      await setOverride(picker.key, asset.image_url, asset.id);
      setJustSet(picker.key);
      setTimeout(() => setJustSet(null), 1500);
      setPicker(null);
      onChanged?.();
    } catch {
      alert('Vervangen mislukt');
    }
    setBusy(null);
  };

  const reset = async (pos) => {
    setBusy(pos.key);
    try {
      await clearOverride(pos.key);
      onChanged?.();
    } catch {
      alert('Reset mislukt');
    }
    setBusy(null);
  };

  const q = search.trim().toLowerCase();
  const lib = useMemo(() => {
    if (!q) return assets;
    return assets.filter((a) =>
      [a.description, ...(a.tags || []), ...(a.categories || []), a.location]
        .join(' ')
        .toLowerCase()
        .includes(q),
    );
  }, [assets, q]);

  return (
    <>
      <div className="fixed inset-0 z-[114] bg-black/55 backdrop-blur-sm" onClick={onClose} />
      <div className="fixed top-0 left-0 bottom-0 z-[115] w-full max-w-lg bg-background border-r border-border overflow-y-auto flex flex-col">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-background/90 backdrop-blur px-5 py-3 border-b border-border flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Globe className="w-4 h-4 text-primary" />
            <div>
              <h3 className="font-heading text-lg font-bold leading-none">Website beelden</h3>
              <p className="font-body text-[11px] text-muted-foreground mt-0.5">
                Klik een foto om deze te vervangen
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-muted transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Page selector */}
        <div className="px-5 py-3 border-b border-border bg-background/60">
          <p className="font-body text-[10px] tracking-[0.2em] uppercase text-muted-foreground mb-2">
            Pagina
          </p>
          <div className="flex gap-1.5 overflow-x-auto pb-1 -mx-1 px-1">
            <button
              onClick={() => setPage('all')}
              className={`whitespace-nowrap px-3 py-1.5 rounded-full text-xs transition-colors ${
                page === 'all'
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:bg-muted border border-border'
              }`}
            >
              Alle pagina's
            </button>
            {SITE_PAGES.map((p) => {
              const count = positions.filter((pos) => pos.pages.includes(p.key)).length;
              if (!count) return null;
              const active = page === p.key;
              return (
                <button
                  key={p.key}
                  onClick={() => setPage(p.key)}
                  className={`whitespace-nowrap px-3 py-1.5 rounded-full text-xs transition-colors ${
                    active
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:bg-muted border border-border'
                  }`}
                >
                  {p.label}{' '}
                  <span className={`ml-0.5 ${active ? 'opacity-70' : 'opacity-50'}`}>{count}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Grouped current images */}
        <div className="flex-1 px-5 py-4 space-y-6">
          {grouped.length === 0 && (
            <p className="font-body text-sm text-muted-foreground text-center py-12">
              Geen beelden op deze pagina.
            </p>
          )}
          {grouped.map(({ page: pg, items }) => (
            <div key={pg}>
              <p className="font-body text-[10px] tracking-[0.25em] uppercase text-muted-foreground mb-2.5">
                {pg}
              </p>
              <div className="grid grid-cols-2 gap-2.5">
                {items.map((pos) => {
                  const isBusy = busy === pos.key;
                  const justDone = justSet === pos.key;
                  return (
                    <div
                      key={pos.key}
                      className="group relative rounded-xl overflow-hidden border border-border bg-card/40 hover:border-primary/50 hover:shadow-md transition-all"
                    >
                      <button
                        onClick={() => openPicker(pos)}
                        disabled={isBusy}
                        className="block w-full text-left disabled:opacity-60"
                        title="Kies een nieuwe foto"
                      >
                        <div className="relative w-full aspect-[4/3] bg-muted">
                          <img
                            src={pos.image_url}
                            alt={pos.label}
                            className="w-full h-full object-cover"
                            loading="lazy"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                          {pos.overridden && (
                            <span className="absolute top-1.5 left-1.5 inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-primary text-primary-foreground text-[9px] font-medium tracking-wide">
                              <Check className="w-2.5 h-2.5" /> Aangepast
                            </span>
                          )}
                          <span className="absolute bottom-1.5 left-1.5 right-1.5 flex items-center justify-between">
                            <span className="font-body text-[10px] text-white/90 leading-tight line-clamp-2 drop-shadow">
                              {pos.label}
                            </span>
                            <span className="ml-1.5 flex-shrink-0 inline-flex items-center gap-1 px-2 py-1 rounded-full bg-white/15 backdrop-blur text-white text-[9px] tracking-wide uppercase opacity-0 group-hover:opacity-100 transition-opacity">
                              Vervang
                            </span>
                          </span>
                          {justDone && (
                            <span className="absolute inset-0 flex items-center justify-center bg-primary/70 text-primary-foreground font-body text-xs font-medium">
                              <Check className="w-4 h-4 mr-1" /> Geplaatst
                            </span>
                          )}
                          {isBusy && (
                            <span className="absolute inset-0 flex items-center justify-center bg-background/70">
                              <Loader2 className="w-5 h-5 animate-spin text-primary" />
                            </span>
                          )}
                        </div>
                      </button>
                      {pos.overridden && !isBusy && !justDone && (
                        <button
                          onClick={() => reset(pos)}
                          className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full flex items-center justify-center bg-background/80 backdrop-blur text-muted-foreground hover:text-foreground hover:bg-background transition-colors"
                          title="Terugzetten naar standaard"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        <div className="sticky bottom-0 bg-background/90 backdrop-blur px-5 py-3 border-t border-border">
          <p className="font-body text-[11px] text-muted-foreground text-center leading-relaxed">
            Klik een foto om een nieuwe afbeelding uit de beeldbank te kiezen. Standaardfoto's
            herstelt u met de ↺-knop.
          </p>
        </div>
      </div>

      {/* Library picker */}
      {picker && (
        <div
          className="fixed inset-0 z-[116] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setPicker(null)}
        >
          <div
            className="bg-background border border-border rounded-2xl w-full max-w-2xl max-h-[82vh] flex flex-col overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-5 py-3 border-b border-border">
              <div className="flex items-center gap-2.5">
                <button
                  onClick={() => setPicker(null)}
                  className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-muted transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                </button>
                <div>
                  <h3 className="font-heading text-base font-bold leading-none">Kies een foto</h3>
                  <p className="font-body text-[11px] text-muted-foreground mt-0.5">{picker.label}</p>
                </div>
              </div>
              <button
                onClick={() => setPicker(null)}
                className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-muted transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="px-5 py-3 border-b border-border">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Zoek in beeldbank…"
                  className="w-full pl-9 pr-3 py-2.5 rounded-lg bg-card/60 border border-border focus:outline-none focus:border-primary text-sm"
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4">
              {loadingLib ? (
                <div className="flex items-center justify-center py-16">
                  <Loader2 className="w-6 h-6 animate-spin text-primary" />
                </div>
              ) : lib.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-center text-muted-foreground">
                  <ImageOff className="w-6 h-6 mb-2 opacity-50" />
                  <p className="font-body text-sm">Geen beelden gevonden.</p>
                </div>
              ) : (
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2.5">
                  {lib.map((a) => (
                    <button
                      key={a.id}
                      onClick={() => choose(a)}
                      className="group relative rounded-lg overflow-hidden border border-border hover:border-primary hover:ring-2 hover:ring-primary/40 transition-all aspect-square"
                    >
                      <img
                        src={a.image_url}
                        alt={a.description || 'Bogèst'}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                      <span className="absolute bottom-1 left-1 right-1 font-body text-[9px] text-white line-clamp-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        {a.description || 'Bogèst'}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}