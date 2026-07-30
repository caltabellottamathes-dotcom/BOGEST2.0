import React from 'react';

const CATEGORY_COLORS = {
  interiors: 'bg-sky-500/15 text-sky-300 border-sky-500/20',
  gastronomy: 'bg-amber-500/15 text-amber-300 border-amber-500/20',
  atmosphere: 'bg-pink-500/15 text-pink-300 border-pink-500/20',
  architecture: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/20',
  branding: 'bg-violet-500/15 text-violet-300 border-violet-500/20',
};

const LOC_LABELS = {
  hasselt: 'Hasselt',
  borgloon: 'Borgloon',
  'heusden-zolder': 'Heusden-Zolder',
};

export default function AssetCard({ asset, onClick }) {
  return (
    <button
      type="button"
      onClick={() => onClick?.(asset)}
      className="block text-left w-full break-inside-avoid mb-4 rounded-2xl overflow-hidden border border-border bg-card/60 backdrop-blur-sm group relative focus:outline-none"
    >
      <div className="relative overflow-hidden">
        <img
          src={asset.image_url}
          alt={asset.description || asset.primary_category}
          loading="lazy"
          className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-[1.04]"
        />
        <span className={`absolute top-2 left-2 text-[10px] px-2 py-0.5 rounded-full capitalize border ${CATEGORY_COLORS[asset.primary_category] || 'bg-primary/15 text-primary border-primary/20'}`}>
          {asset.primary_category}
        </span>
        <div className="absolute top-2 right-2 flex items-center gap-1.5">
          {asset.quality_score != null && (
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-black/50 text-amber-200 backdrop-blur-sm">
              {Math.round(asset.quality_score)}
            </span>
          )}
          {asset.location && asset.location !== 'unknown' && (
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-black/50 text-primary backdrop-blur-sm">
              {LOC_LABELS[asset.location] || asset.location}
            </span>
          )}
        </div>
        {asset.collections?.length > 0 && (
          <span className="absolute bottom-2 left-2 text-[9px] px-1.5 py-0.5 rounded-full bg-primary text-primary-foreground backdrop-blur-sm flex items-center gap-1">
            ★ {asset.collections.length}
          </span>
        )}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
      </div>
      {asset.description && (
        <div className="p-3">
          <p className="font-body text-xs text-muted-foreground line-clamp-2">{asset.description}</p>
        </div>
      )}
    </button>
  );
}