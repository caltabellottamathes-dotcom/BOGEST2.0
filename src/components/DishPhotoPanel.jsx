import React, { useState, useEffect } from 'react';
import { MapPin } from 'lucide-react';
import OverlayPanelShell from '@/components/OverlayPanelShell';
import { useLang } from '@/lib/LangContext';

// Slide-in dish photo panel — when a host (chat or voice) wants to show a
// photo of a dish, a smaller panel slides in from the right with the photo,
// its name and a short description. Styled to match the site's glass panels.
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
      maxWidth="min(92vw, 460px)"
      compact
      header={
        <div className="flex items-center gap-3">
          <span className="w-9 h-9 rounded-full bg-primary/15 border border-primary/40 flex items-center justify-center">
            <span className="w-2 h-2 rounded-full bg-primary" />
          </span>
          <div>
            <p className="font-body text-[10px] tracking-[0.3em] uppercase text-primary">{L.label}</p>
            <h2 className="font-heading text-lg font-bold text-foreground leading-tight">{name ? `${name}.` : 'Bogèst.'}</h2>
          </div>
        </div>
      }
    >
      <div className="p-5 md:p-6 flex flex-col gap-5">
        {photo?.url && (
          <div className="relative rounded-2xl overflow-hidden border border-white/10 shadow-xl" style={{ aspectRatio: '4 / 3' }}>
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
          <p className="font-body text-sm text-foreground/85 leading-relaxed">{photo.description}</p>
        )}
      </div>
    </OverlayPanelShell>
  );
}