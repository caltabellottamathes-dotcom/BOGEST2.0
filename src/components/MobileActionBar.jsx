import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Phone, CalendarDays } from 'lucide-react';
import { useLang } from '@/lib/LangContext';
import { getLocations } from '@/lib/data';

// Vaste onderste actiebalk op mobiel: Reserveren + Bellen.
// Bellen gebruikt de voorkeursvestiging uit het gastenprofiel (fallback Hasselt).
export default function MobileActionBar() {
  const { t, lang } = useLang();
  const location = useLocation();
  const [phone, setPhone] = useState('');

  useEffect(() => {
    const locations = getLocations(lang);
    let pref = 'hasselt';
    try {
      const raw = localStorage.getItem('bogest-visitor');
      if (raw) {
        const prof = JSON.parse(raw);
        if (prof && prof.preferred_location) pref = prof.preferred_location;
      }
    } catch {}
    const loc =
      locations.find((l) => l.slug === pref && l.active !== false) ||
      locations.find((l) => l.slug === 'hasselt') ||
      locations.find((l) => l.active !== false);
    setPhone(loc?.phone || '');
  }, [lang]);

  // Verberg op de reserveerpagina zelf, op beheer-tools en op de Beeldbank.
  const hideOn = ['/reserve', '/assets', '/menu-beheer', '/meldingen-beheer', '/admin'];
  if (hideOn.includes(location.pathname)) return null;

  const telHref = phone ? `tel:${phone.replace(/\s/g, '')}` : null;

  return (
    <div
      className="bogest-mobile-bar lg:hidden fixed left-3 right-[88px] bottom-3 z-[70] flex items-center gap-2 rounded-full px-2.5 py-2 transition-transform duration-500"
      style={{
        background: 'rgba(255,255,255,0.08)',
        backdropFilter: 'blur(40px) saturate(160%)',
        WebkitBackdropFilter: 'blur(40px) saturate(160%)',
        border: '1px solid rgba(255,255,255,0.16)',
        boxShadow: '0 12px 32px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.10)',
      }}
    >
      <Link
        to="/reserve"
        className="flex-1 inline-flex items-center justify-center gap-2 py-2.5 rounded-full bg-primary text-primary-foreground font-body text-xs tracking-[0.18em] uppercase font-semibold transition-colors duration-300 hover:bg-primary/90"
      >
        <CalendarDays className="w-4 h-4" strokeWidth={1.75} />
        {t('btn_reserve')}
      </Link>
      {telHref ? (
        <a
          href={telHref}
          className="flex-1 inline-flex items-center justify-center gap-2 py-2.5 rounded-full border border-white/25 text-foreground font-body text-xs tracking-[0.18em] uppercase font-semibold transition-colors duration-300 hover:border-primary hover:text-primary"
          style={{ color: 'hsl(var(--foreground))' }}
        >
          <Phone className="w-4 h-4 text-primary" strokeWidth={1.75} />
          {lang === 'fr' ? 'Appeler' : lang === 'en' ? 'Call' : 'Bellen'}
        </a>
      ) : null}
    </div>
  );
}