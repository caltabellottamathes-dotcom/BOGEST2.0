import React, { useState, useEffect } from 'react';
import { MapPin, ArrowUpRight, Navigation } from 'lucide-react';
import OverlayPanelShell from '@/components/OverlayPanelShell';
import { useLang } from '@/lib/LangContext';
import { getLocations } from '@/lib/data';

// Slide-in Google Maps panel — opens from the right when a visitor clicks
// "Route" in a location panel, or when a host (chat / voice) asks to show a
// location on the map or a route. Uses the keyless Google Maps embed so no
// API key is required, styled to match the site's frosted-glass panels.
export default function MapPanel() {
  const { lang } = useLang();
  const [open, setOpen] = useState(false);
  const [slug, setSlug] = useState(null);

  useEffect(() => {
    const handler = (e) => {
      const s = String(e.detail?.slug || '').toLowerCase();
      if (!s) return;
      setSlug(s);
      setOpen(true);
    };
    window.addEventListener('bogest:open-map', handler);
    return () => window.removeEventListener('bogest:open-map', handler);
  }, []);

  const close = () => setOpen(false);
  const loc = slug ? getLocations(lang).find((l) => l.slug === slug) : null;

  const q = loc ? `${loc.name}, ${loc.address}` : 'Bogèst Hasselt';
  const hl = lang === 'fr' ? 'fr' : lang === 'en' ? 'en' : 'nl';
  const embed = `https://maps.google.com/maps?q=${encodeURIComponent(q)}&output=embed&hl=${hl}`;
  const route = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(loc?.address || q)}`;

  const L = lang === 'fr'
    ? { route: 'Itinéraire', address: 'Adresse', label: 'Bogèst · carte' }
    : lang === 'en'
      ? { route: 'Directions', address: 'Address', label: 'Bogèst · map' }
      : { route: 'Route', address: 'Adres', label: 'Bogèst · kaart' };

  return (
    <OverlayPanelShell
      isOpen={open}
      onClose={close}
      maxWidth="min(92vw, 560px)"
      header={
        <div className="flex items-center gap-3">
          <span className="w-9 h-9 rounded-full bg-primary/15 border border-primary/40 flex items-center justify-center">
            <MapPin className="w-4 h-4 text-primary" />
          </span>
          <div>
            <p className="font-body text-[10px] tracking-[0.3em] uppercase text-primary">{L.label}</p>
            <h2 className="font-heading text-lg font-bold text-foreground leading-tight">{loc ? `${loc.city}.` : 'Route'}</h2>
          </div>
        </div>
      }
    >
      <div className="p-5 md:p-6 flex flex-col gap-5">
        <div className="rounded-2xl overflow-hidden border border-white/10 shadow-xl" style={{ height: 'min(52vh, 380px)' }}>
          <iframe
            title="Bogèst kaart"
            src={embed}
            className="w-full h-full"
            style={{ border: 0, filter: 'grayscale(0.15) contrast(1.05) saturate(0.95)' }}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            allowFullScreen
          />
        </div>
        <div className="flex flex-col gap-4">
          {loc?.address && (
            <div className="flex items-start gap-3">
              <MapPin className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-body text-[10px] tracking-[0.25em] uppercase text-muted-foreground">{L.address}</p>
                <p className="font-body text-sm text-foreground/90 leading-snug">{loc.address}</p>
              </div>
            </div>
          )}
          <a
            href={route}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-primary/15 text-primary border border-primary/40 backdrop-blur-md hover:bg-primary/25 hover:border-primary/60 font-body text-xs tracking-[0.2em] uppercase rounded-full transition-all duration-300"
          >
            <Navigation className="w-3.5 h-3.5" /> {L.route}
            <ArrowUpRight className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </OverlayPanelShell>
  );
}