import React from 'react';
import { categoryLabel } from '@/lib/assetTaxonomy';

const LOC_LABELS = {
  hasselt: 'Hasselt',
  borgloon: 'Borgloon',
  'heusden-zolder': 'Heusden-Zolder',
};

export default function AssetCard({ asset, onClick }) {
  const cats = Array.isArray(asset.categories) && asset.categories.length
    ? asset.categories
    : (asset.primary_category ? [asset.primary_category] : []);
  const badgeLabel = cats[0] ? categoryLabel(cats[0]) : (asset.primary_category || '');

  return (
    <button
      type="button"
      onClick={() => onClick?.(asset)}
      className="group relative aspect-square rounded-xl overflow-hidden border border-border bg-card/40 focus:outline-none"
    >
      <img
        src={asset.image_url}
        alt={asset.description || badgeLabel}
        loading="lazy"
        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.05]"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      <span className="absolute top-2 left-2 text-[10px] px-2 py-0.5 rounded-full bg-black/45 text-foreground backdrop-blur-sm max-w-[70%] truncate">
        {badgeLabel}
      </span>
      {asset.location && asset.location !== 'unknown' && (
        <span className="absolute top-2 right-2 text-[10px] px-2 py-0.5 rounded-full bg-black/45 text-primary backdrop-blur-sm">
          {LOC_LABELS[asset.location] || asset.location}
        </span>
      )}
      {asset.quality_score != null && (
        <span className="absolute bottom-2 right-2 text-[10px] px-1.5 py-0.5 rounded-full bg-black/50 text-amber-200 backdrop-blur-sm">
          {Math.round(asset.quality_score)}
        </span>
      )}
      {asset.collections?.length > 0 && (
        <span className="absolute bottom-2 left-2 text-[9px] px-1.5 py-0.5 rounded-full bg-primary text-primary-foreground backdrop-blur-sm">
          ★ {asset.collections.length}
        </span>
      )}
    </button>
  );
}