import React from 'react';
import { categoryLabel } from '@/lib/assetTaxonomy';

const LOC_LABELS = {
  hasselt: 'Hasselt',
  borgloon: 'Borgloon',
  'heusden-zolder': 'Heusden-Zolder',
};

// Lighter, more spacious card — one calm meta row at the bottom instead of
// four corner badges. Keeps the essentials: category, location, "new" flag.
export default function AssetCard({ asset, onClick }) {
  const cats = Array.isArray(asset.categories) && asset.categories.length
    ? asset.categories
    : (asset.primary_category ? [asset.primary_category] : []);
  const badgeLabel = cats[0] ? categoryLabel(cats[0]) : (asset.primary_category || '');
  const loc = asset.location && asset.location !== 'unknown' ? (LOC_LABELS[asset.location] || asset.location) : null;

  return (
    <button
      type="button"
      onClick={() => onClick?.(asset)}
      className="group relative aspect-[4/5] rounded-2xl overflow-hidden border border-border/60 bg-card/30 focus:outline-none focus:ring-2 focus:ring-primary/40 transition-colors duration-300 hover:border-primary/40"
    >
      <img
        src={asset.image_url}
        alt={asset.description || badgeLabel}
        loading="lazy"
        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.06]"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60 group-hover:opacity-90 transition-opacity duration-300" />

      <div className="absolute left-0 right-0 bottom-0 p-3 flex items-center justify-between gap-2">
        {badgeLabel ? (
          <span className="text-[10px] px-2.5 py-1 rounded-full bg-black/35 text-foreground/90 backdrop-blur-sm max-w-[65%] truncate">
            {badgeLabel}
          </span>
        ) : <span />}
        {loc && (
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-black/35 text-primary backdrop-blur-sm">
            {loc}
          </span>
        )}
      </div>

      {asset.ai_analyzed !== true && (
        <span className="absolute top-2.5 right-2.5 text-[9px] px-2 py-0.5 rounded-full bg-black/45 text-amber-200/90 backdrop-blur-sm">
          Nieuw
        </span>
      )}
    </button>
  );
}