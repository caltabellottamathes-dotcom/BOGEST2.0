import React from 'react';
import { PlayCircle, Film } from 'lucide-react';
import { categoryLabel } from '@/lib/assetTaxonomy';

const LOC_LABELS = {
  hasselt: 'Hasselt',
  borgloon: 'Borgloon',
  'heusden-zolder': 'Heusden-Zolder',
};

// Lighter, more spacious card — one calm meta row at the bottom instead of
// four corner badges. Keeps the essentials: category, location, "new" flag.
// Video assets render a thumbnail frame with a play badge instead of an <img>.
export default function AssetCard({ asset, onClick }) {
  const cats = Array.isArray(asset.categories) && asset.categories.length
    ? asset.categories
    : (asset.primary_category ? [asset.primary_category] : []);
  const badgeLabel = cats[0] ? categoryLabel(cats[0]) : (asset.primary_category || '');
  const loc = asset.location && asset.location !== 'unknown' ? (LOC_LABELS[asset.location] || asset.location) : null;
  const isVideo = asset.media_type === 'video';

  return (
    <button
      type="button"
      onClick={() => onClick?.(asset)}
      className="group relative aspect-[4/5] rounded-2xl overflow-hidden border border-border/60 bg-card/30 focus:outline-none focus:ring-2 focus:ring-primary/40 transition-colors duration-300 hover:border-primary/40"
    >
      {isVideo ? (
        <>
          {/* #t=0.1 forces the browser to decode and show a real first frame */}
          <video
            src={`${asset.image_url}#t=0.1`}
            muted
            playsInline
            preload="metadata"
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.06]"
          />
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <span className="w-12 h-12 rounded-full flex items-center justify-center" style={{ background: 'rgba(12,11,9,0.45)', backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.22)' }}>
              <PlayCircle className="w-7 h-7 text-white/95" />
            </span>
          </div>
        </>
      ) : (
        <img
          src={asset.image_url}
          alt={asset.description || badgeLabel}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.06]"
        />
      )}
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

      {isVideo && (
        <span className="absolute top-2.5 left-2.5 inline-flex items-center gap-1 text-[9px] px-2 py-0.5 rounded-full bg-black/50 text-primary backdrop-blur-sm border border-primary/30">
          <Film className="w-2.5 h-2.5" /> Video
        </span>
      )}

      {!isVideo && asset.ai_analyzed !== true && (
        <span className="absolute top-2.5 right-2.5 text-[9px] px-2 py-0.5 rounded-full bg-black/45 text-amber-200/90 backdrop-blur-sm">
          Nieuw
        </span>
      )}
    </button>
  );
}