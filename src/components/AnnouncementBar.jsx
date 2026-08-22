import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { X, Sparkles } from 'lucide-react';
import { useAnnouncements } from '@/lib/useAnnouncements';

// Dismissible, slim meldingenlint bovenaan de pagina.
// Wordt automatisch verborgen na de einddatum (useAnnouncements) en bij dismiss.
export default function AnnouncementBar() {
  const location = useLocation();
  const m = location.pathname.match(/^\/locations\/(.+)$/);
  const cur = m ? m[1] : null;
  const items = useAnnouncements(cur);

  const [dismissed, setDismissed] = useState(() => {
    try { return JSON.parse(sessionStorage.getItem('bogest-ann-dismissed') || '[]'); } catch { return []; }
  });

  const visible = items.find((i) => !dismissed.includes(i.id));

  useEffect(() => {
    const h = visible ? '42px' : '0px';
    document.documentElement.style.setProperty('--bogest-banner-h', h);
    return () => {
      document.documentElement.style.setProperty('--bogest-banner-h', '0px');
    };
  }, [visible]);

  // Reset dismissed-set bij routewissel naar een andere vestiging-context
  useEffect(() => {
    setDismissed((prev) => prev); // behoud, geen reset nodig
  }, [cur]);

  if (!visible) return null;

  const dismiss = () => {
    const next = [...dismissed, visible.id];
    setDismissed(next);
    try { sessionStorage.setItem('bogest-ann-dismissed', JSON.stringify(next)); } catch {}
  };

  const isInternal = visible.link_url && visible.link_url.startsWith('/');
  const label = visible.link_label;

  return (
    <div
      className="fixed top-0 inset-x-0 z-[72] flex items-center gap-3 px-4 sm:px-6"
      style={{
        height: '42px',
        background: 'linear-gradient(90deg, hsl(var(--primary) / 0.16), hsl(var(--primary) / 0.06))',
        backdropFilter: 'blur(28px) saturate(160%)',
        WebkitBackdropFilter: 'blur(28px) saturate(160%)',
        borderBottom: '1px solid hsl(var(--primary) / 0.28)',
      }}
    >
      <Sparkles className="w-3.5 h-3.5 text-primary flex-shrink-0" />
      <p className="flex-1 min-w-0 font-body text-xs sm:text-sm text-foreground/90 truncate">
        <span className="font-semibold text-primary mr-2">{visible.title}</span>
        {visible.message}
      </p>
      {label && isInternal && (
        <Link to={visible.link_url} className="font-body text-[10px] tracking-[0.18em] uppercase text-primary font-semibold whitespace-nowrap hover:underline">
          {label}
        </Link>
      )}
      {label && visible.link_url && !isInternal && (
        <a href={visible.link_url} target="_blank" rel="noopener noreferrer" className="font-body text-[10px] tracking-[0.18em] uppercase text-primary font-semibold whitespace-nowrap hover:underline">
          {label}
        </a>
      )}
      <button
        type="button"
        onClick={dismiss}
        aria-label="Melding sluiten"
        className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-foreground/60 hover:text-foreground transition-colors"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}