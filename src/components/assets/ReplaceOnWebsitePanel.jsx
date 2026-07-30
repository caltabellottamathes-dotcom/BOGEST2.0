import React, { useState, useMemo } from 'react';
import { X, Globe, Check, RotateCcw, Loader2 } from 'lucide-react';
import { useSiteImages } from '@/lib/SiteImageContext';
import { SITE_PAGES } from '@/lib/siteImages';

// "Vervang op website" — structured map of every replaceable image position
// on the live site. A page selector at the top filters the positions to just
// that page. The admin clicks a position to place the selected Beeldbank
// photo there; the live site reflects it immediately.
export default function ReplaceOnWebsitePanel({ asset, onClose }) {
  const { positions, setOverride, clearOverride } = useSiteImages();
  const [page, setPage] = useState('all');
  const [busy, setBusy] = useState(null);
  const [justSet, setJustSet] = useState(null);
  const [resetting, setResetting] = useState(null);

  const filtered = useMemo(
    () => (page === 'all' ? positions : positions.filter((p) => p.pages.includes(page))),
    [positions, page],
  );

  // Group by the page each position belongs to (first page, or the selected one).
  const grouped = useMemo(() => {
    if (page !== 'all') {
      const pg = SITE_PAGES.find((p) => p.key === page);
      return [{ page: pg?.label || page, items: filtered }];
    }
    const map = new Map();
    for (const p of filtered) {
      const pk = p.pages[0];
      const pg = SITE_PAGES.find((s) => s.key === pk);
      const label = pg?.label || pk;
      if (!map.has(label)) map.set(label, []);
      map.get(label).push(p);
    }
    return Array.from(map, ([page, items]) => ({ page, items }));
  }, [filtered, page]);

  const assign = async (pos) => {
    setBusy(pos.key);
    try {
      await setOverride(pos.key, asset.image_url, asset.id);
      setJustSet(pos.key);
      setTimeout(() => setJustSet(null), 1800);
    } catch { alert('Vervangen mislukt'); }
    setBusy(null);
  };

  const reset = async (pos) => {
    setResetting(pos.key);
    try { await clearOverride(pos.key); } catch { alert('Reset mislukt'); }
    setResetting(null);
  };

  return (
    <>
      <div className="fixed inset-0 z-[114] bg-black/55 backdrop-blur-sm" onClick={onClose} />
      <div className="fixed top-0 right-0 bottom-0 z-[115] w-full max-w-lg bg-background border-l border-border overflow-y-auto flex flex-col">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-background/90 backdrop-blur px-5 py-3 border-b border-border flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Globe className="w-4 h-4 text-primary" />
            <div>
              <h3 className="font-heading text-lg font-bold leading-none">Vervang op website</h3>
              <p className="font-body text-[11px] text-muted-foreground mt-0.5">Kies waar deze foto verschijnt</p>
            </div>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-muted transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Chosen photo preview */}
        <div className="px-5 py-4 border-b border-border bg-card/30">
          <p className="font-body text-[10px] tracking-[0.2em] uppercase text-primary mb-2">Uw gekozen foto</p>
          <div className="flex gap-3">
            <div className="w-20 h-20 rounded-lg overflow-hidden border border-border flex-shrink-0 bg-muted">
              <img src={asset.image_url} alt={asset.description || 'Bogèst'} className="w-full h-full object-cover" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-body text-sm text-foreground line-clamp-2 leading-snug">{asset.description || 'Beeldbank-foto'}</p>
              <p className="font-body text-[11px] text-muted-foreground mt-1">
                Kies eerst een pagina hieronder, en klik op de positie waar u deze foto wilt plaatsen.
              </p>
            </div>
          </div>
        </div>

        {/* Page selector */}
        <div className="px-5 py-3 border-b border-border bg-background/60">
          <p className="font-body text-[10px] tracking-[0.2em] uppercase text-muted-foreground mb-2">Pagina</p>
          <div className="flex gap-1.5 overflow-x-auto pb-1 -mx-1 px-1">
            <button
              onClick={() => setPage('all')}
              className={`whitespace-nowrap px-3 py-1.5 rounded-full text-xs transition-colors ${page === 'all' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-muted border border-border'}`}
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
                  className={`whitespace-nowrap px-3 py-1.5 rounded-full text-xs transition-colors ${active ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-muted border border-border'}`}
                >
                  {p.label} <span className={`ml-0.5 ${active ? 'opacity-70' : 'opacity-50'}`}>{count}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Structured map */}
        <div className="flex-1 px-5 py-4 space-y-6">
          {grouped.length === 0 && (
            <p className="font-body text-sm text-muted-foreground text-center py-12">Geen posities op deze pagina.</p>
          )}
          {grouped.map(({ page: pg, items }) => (
            <div key={pg}>
              <p className="font-body text-[10px] tracking-[0.25em] uppercase text-muted-foreground mb-2.5">{pg}</p>
              <div className="grid grid-cols-2 gap-2.5">
                {items.map((pos) => {
                  const isBusy = busy === pos.key;
                  const isReset = resetting === pos.key;
                  const justDone = justSet === pos.key;
                  return (
                    <button
                      key={pos.key}
                      onClick={() => assign(pos)}
                      disabled={isBusy}
                      className="group relative text-left rounded-xl overflow-hidden border border-border bg-card/40 hover:border-primary/50 hover:shadow-md transition-all disabled:opacity-60"
                    >
                      <div className="relative w-full aspect-[4/3] bg-muted">
                        <img src={pos.image_url} alt={pos.label} className="w-full h-full object-cover" loading="lazy" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />
                        {pos.overridden && (
                          <span className="absolute top-1.5 left-1.5 inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-primary text-primary-foreground text-[9px] font-medium tracking-wide">
                            <Check className="w-2.5 h-2.5" /> Aangepast
                          </span>
                        )}
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
                        {pos.overridden && !isBusy && !justDone && (
                          <span
                            role="button"
                            tabIndex={0}
                            onClick={(e) => { e.stopPropagation(); reset(pos); }}
                            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); e.stopPropagation(); reset(pos); } }}
                            className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full flex items-center justify-center bg-background/80 backdrop-blur text-muted-foreground hover:text-foreground hover:bg-background transition-colors"
                            title="Terugzetten naar standaard"
                          >
                            {isReset ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <RotateCcw className="w-3.5 h-3.5" />}
                          </span>
                        )}
                      </div>
                      <div className="px-2.5 py-2">
                        <p className="font-body text-xs text-foreground leading-tight line-clamp-2">{pos.label}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        <div className="sticky bottom-0 bg-background/90 backdrop-blur px-5 py-3 border-t border-border">
          <p className="font-body text-[11px] text-muted-foreground text-center leading-relaxed">
            De wijziging is direct zichtbaar op de live website. Standaardfoto's herstelt u met de ↺-knop.
          </p>
        </div>
      </div>
    </>
  );
}