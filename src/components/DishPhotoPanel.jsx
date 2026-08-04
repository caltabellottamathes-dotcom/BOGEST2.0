import React, { useState, useEffect } from 'react';
import { MapPin } from 'lucide-react';
import OverlayPanelShell from '@/components/OverlayPanelShell';
import { useLang } from '@/lib/LangContext';

// Slide-in dish photo panel — when a host (chat or voice) wants to show a
// photo of a dish, the panel slides in from the right with the photo, its
// name and a short description. Same proportions (full height, 920px) as the
// reserve / Zenchef widget panel so all overlay panels feel consistent.
export default function DishPhotoPanel() {
  const { lang } = useLang();
  const [open, setOpen] = useState(false);
  const [photo, setPhoto] = useState(null);

  useEffect(() => {
    const handler = (e) => {
      const p = e.detail || {};
      if (!p?.url) return;
      setPhoto(p);
      setOpen(true);
    };
    window.addEventListener('bogest:show-dish-photo', handler);
    return () => window.removeEventListener('bogest:show-dish-photo', handler);
  }, []);

  const close = () => setOpen(false);
  const L = lang === 'fr'
    ? { label: 'Bogèst · cuisine' }
    : lang === 'en'
      ? { label: 'Bogèst · dish' }
      : { label: 'Bogèst · gerecht' };

  const name = (photo?.name || '').replace(/\.$/, '');

  return (
    <OverlayPanelShell
      isOpen={open}
      onClose={close}
      maxWidth="min(90vw, 920px)"
      scrollable={false}
      header={
        <div className="flex items-center gap-3">
          <span className="w-10 h-10 rounded-full bg-primary/15 border border-primary/40 flex items-center justify-center flex-shrink-0">
            <span className="w-2 h-2 rounded-full bg-primary" />
          </span>
          <div className="flex-1 min-w-0">
            <p className="font-body text-[10px] tracking-[0.3em] uppercase text-primary">{L.label}</p>
            <h2 className="font-heading text-base md:text-lg font-semibold text-foreground leading-tight">{name ? `${name}.` : 'Bogèst.'}</h2>
          </div>
        </div>
      }
    >
      <div className="flex-1 min-h-0 flex flex-col p-4 md:p-6 gap-4">
        {photo?.url && (
          <div className="flex-1 min-h-0 relative rounded-2xl overflow-hidden border border-white/10 shadow-xl bg-black/20">
            <img src={photo.url} alt={photo.name || 'Bogèst'} className="w-full h-full object-cover" style={{ filter: 'saturate(0.92) brightness(0.97)' }} />
            <div className="absolute inset-0 pointer-events-none" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.5), transparent 45%)' }} />
            {photo?.location && (
              <div className="absolute left-4 bottom-4 inline-flex items-center gap-2 px-3 py-1.5 rounded-full" style={{ background: 'rgba(12,11,9,0.55)', border: '1px solid rgba(255,255,255,0.16)', backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)' }}>
                <MapPin className="w-3 h-3 text-primary" />
                <span className="font-body text-[10px] tracking-[0.25em] uppercase text-white">Bogèst · {photo.location}</span>
              </div>
            )}
          </div>
        )}
        {photo?.description && (
          <p className="font-body text-sm text-foreground/85 leading-relaxed flex-shrink-0">{photo.description}</p>
        )}
      </div>
    </OverlayPanelShell>
  );
}