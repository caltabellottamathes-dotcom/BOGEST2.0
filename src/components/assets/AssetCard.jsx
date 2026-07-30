import React, { useState } from 'react';
import { Copy, Check, ExternalLink } from 'lucide-react';

const CATEGORY_COLORS = {
  interiors: 'bg-sky-500/15 text-sky-300 border-sky-500/20',
  gastronomy: 'bg-amber-500/15 text-amber-300 border-amber-500/20',
  atmosphere: 'bg-pink-500/15 text-pink-300 border-pink-500/20',
  architecture: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/20',
  branding: 'bg-violet-500/15 text-violet-300 border-violet-500/20',
};

export default function AssetCard({ asset, showExport }) {
  const [copied, setCopied] = useState(false);
  const copy = (e) => {
    e.stopPropagation();
    navigator.clipboard.writeText(asset.image_url);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="break-inside-avoid mb-4 rounded-2xl overflow-hidden border border-border bg-card/60 backdrop-blur-sm group">
      <div className="relative">
        <img
          src={asset.image_url}
          alt={asset.description || asset.primary_category}
          loading="lazy"
          className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-[1.02]"
        />
        <span className={`absolute top-2 left-2 text-[10px] px-2 py-0.5 rounded-full capitalize border ${CATEGORY_COLORS[asset.primary_category] || 'bg-primary/15 text-primary border-primary/20'}`}>
          {asset.primary_category}
        </span>
        {asset.quality_score != null && (
          <span className="absolute top-2 right-2 text-[10px] px-2 py-0.5 rounded-full bg-black/50 text-amber-200 backdrop-blur-sm">
            {Math.round(asset.quality_score)}
          </span>
        )}
      </div>
      <div className="p-3">
        {asset.description && (
          <p className="font-body text-xs text-muted-foreground line-clamp-2 mb-2">{asset.description}</p>
        )}
        {asset.tags?.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {asset.tags.slice(0, 4).map((t, i) => (
              <span key={i} className="text-[9px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground">{t}</span>
            ))}
          </div>
        )}
        {showExport && (
          <div className="mt-3 flex items-center gap-2">
            <button
              onClick={copy}
              className="flex-1 flex items-center justify-center gap-1.5 text-[10px] py-1.5 rounded-lg border border-border hover:bg-muted transition-colors"
            >
              {copied ? <><Check className="w-3 h-3 text-primary" /> Copied</> : <><Copy className="w-3 h-3" /> CDN link</>}
            </button>
            <a
              href={asset.image_url}
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-center w-8 h-8 rounded-lg border border-border hover:bg-muted transition-colors"
            >
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        )}
      </div>
    </div>
  );
}