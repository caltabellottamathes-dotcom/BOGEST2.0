import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, Phone, ArrowRight, X } from 'lucide-react';
import BogestLogo from '@/components/BogestLogo';
import { useLang } from '@/lib/LangContext';
import { LANGUAGES } from '@/lib/i18n';
import { useTheme } from '@/lib/ThemeContext';
import { getLocations } from '@/lib/data';
import { openCookiePreferences } from '@/lib/consentStore';

// Brand logo is now the BogestLogo text wordmark

export default function Footer() {
  const { t, lang, changeLang } = useLang();
  const { theme } = useTheme();
  const LOCATIONS_DATA = getLocations(lang);
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [pinned, setPinned] = useState(false);

  useEffect(() => {
    const openFooter = () => { setPinned(true); setVisible(true); setDismissed(false); };
    window.addEventListener('bogest:open-footer', openFooter);
    return () => window.removeEventListener('bogest:open-footer', openFooter);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (pinned) return;
      const isHomePage = window.location.pathname === '/';
      if (!isHomePage) { setVisible(false); return; }

      // Only reveal the footer when the visitor has truly reached the end
      // of the page — within ~30% of a viewport of the very bottom.
      const docEl = document.documentElement;
      const distFromBottom = docEl.scrollHeight - (window.scrollY + window.innerHeight);
      const nearEnd = distFromBottom < window.innerHeight * 0.3;

      if (nearEnd && !dismissed) {
        setVisible(true);
      } else if (!nearEnd) {
        setVisible(false);
        setDismissed(false);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [dismissed, pinned]);

  // After a manual close, the footer can be brought back by swiping up from
  // the bottom part of the page (mobile).
  useEffect(() => {
    let startY = 0, startX = 0, startedBottom = false;
    const onStart = (e) => {
      const t = e.touches[0];
      startY = t.clientY; startX = t.clientX;
      startedBottom = (window.innerHeight - startY) < window.innerHeight * 0.22;
    };
    const onEnd = (e) => {
      if (!startedBottom) return;
      if (window.location.pathname !== '/') return;
      const t = e.changedTouches[0];
      const dy = t.clientY - startY;
      const dx = Math.abs(t.clientX - startX);
      if (dy < -55 && dx < 70) { setVisible(true); setDismissed(false); }
    };
    window.addEventListener('touchstart', onStart, { passive: true });
    window.addEventListener('touchend', onEnd, { passive: true });
    return () => {
      window.removeEventListener('touchstart', onStart);
      window.removeEventListener('touchend', onEnd);
    };
  }, []);

  const closeFooter = () => { setVisible(false); setPinned(false); setDismissed(true); };

  const quickLinks = [
    { label: t('nav_menu'), path: '/menu' },
    { label: t('nav_locations'), path: '/locations' },
    { label: t('nav_about'), path: '/about' },
    { label: t('nav_reserve'), path: '/reserve' },
    { label: t('nav_takeaway'), path: '/takeaway' },
    { label: t('nav_giftcards'), path: '/gift-cards' },
    { label: t('nav_groups'), path: '/groups' },
  ];

  const cookiesLabel = lang === 'fr' ? 'Cookies' : lang === 'en' ? 'Cookies' : 'Cookiebeleid';
  const aiLabel = lang === 'fr' ? 'Avertissement IA' : lang === 'en' ? 'AI Disclaimer' : 'AI-disclaimer';
  const legalLinks = [
    { label: t('footer_privacy'), path: '/privacy' },
    { label: t('footer_terms'), path: '/terms' },
    { label: cookiesLabel, path: '/cookies' },
    { label: aiLabel, path: '/ai-disclaimer' },
    { label: t('nav_jobs'), path: '/jobs' },
    { label: t('nav_contact'), path: '/contact' },
  ];

  return (
    <motion.footer
      initial={{ y: '100%' }}
      animate={{ y: visible ? 0 : '100%' }}
      transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
      className="fixed bottom-0 left-0 right-0 z-[90] flex flex-col"
      style={{
        background: theme === 'light' ? 'hsl(var(--background) / 0.30)' : 'rgba(255,255,255,0.06)',
        backdropFilter: 'blur(24px) saturate(150%)',
        WebkitBackdropFilter: 'blur(24px) saturate(150%)',
        borderTop: theme === 'light' ? '1px solid hsl(78 35% 28% / 0.25)' : '1px solid rgba(255,255,255,0.14)',
        borderLeft: theme === 'light' ? '1px solid hsl(78 35% 28% / 0.12)' : 'none',
        borderRight: theme === 'light' ? '1px solid hsl(78 35% 28% / 0.12)' : 'none',
        borderRadius: '24px 24px 0 0',
        boxShadow: theme === 'light' ? '0 -24px 60px rgba(0,0,0,0.10)' : '0 -30px 90px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.10)',
      }}
    >
      {/* Close button */}
      <button
        onClick={closeFooter}
        className="absolute top-4 right-5 w-7 h-7 rounded-full flex items-center justify-center transition-all duration-200 bg-black/[0.06] border border-black/10 hover:bg-black/10 dark:bg-white/[0.07] dark:border-white/10 z-10"
      >
        <X className="w-3.5 h-3.5 text-foreground/40" />
      </button>
      <div className="flex-1">
      <div className="w-full px-6 md:px-10 lg:px-16 pt-6 md:pt-12 pb-4">
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-12 gap-4 lg:gap-6 mb-6">
          {/* Brand — full width on mobile, 3 cols on lg */}
          <div className="col-span-2 md:col-span-2 lg:col-span-3">
            <Link to="/" className="mb-1">
              <BogestLogo className="text-3xl tracking-wide" />
            </Link>
            <p className="font-body text-[10px] tracking-[0.25em] uppercase text-primary mt-3 max-w-xs">
              {t('footer_tagline')}
            </p>
            <div className="flex gap-4 mt-4">
              <a href="https://www.facebook.com/dEntrecote" target="_blank" rel="noopener noreferrer"
                className="font-heading text-sm font-semibold text-foreground hover:text-primary transition-colors duration-300">
                Facebook
              </a>
              <a href="https://www.instagram.com/dentrecoteborgloon/" target="_blank" rel="noopener noreferrer"
                className="font-heading text-sm font-semibold text-foreground hover:text-primary transition-colors duration-300">
                Instagram
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="lg:col-span-2">
            <h4 className="font-body text-[10px] tracking-[0.25em] uppercase text-primary mb-2">{t('footer_quick_links')}</h4>
            <div className="flex flex-col gap-1.5">
              {quickLinks.map(link => (
                <Link key={link.path} to={link.path} onClick={closeFooter}
                  className="group inline-flex items-center gap-1 font-body text-sm text-foreground/60 hover:text-primary transition-colors duration-300">
                  {link.label}
                  <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all duration-300" />
                </Link>
              ))}
            </div>
          </div>

          {/* Legal Links */}
          <div className="lg:col-span-2">
            <h4 className="font-body text-[10px] tracking-[0.25em] uppercase text-primary mb-2">{t('footer_legal')}</h4>
            <div className="flex flex-col gap-1.5">
              {legalLinks.map(link => (
                <Link key={link.path} to={link.path} onClick={closeFooter}
                  className="group inline-flex items-center gap-1 font-body text-sm text-foreground/60 hover:text-primary transition-colors duration-300">
                  {link.label}
                  <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all duration-300" />
                </Link>
              ))}
            </div>
          </div>

          {/* Locations — tablet: 2cols, desktop: 4cols */}
          <div className="col-span-2 md:col-span-2 lg:col-span-5">
            <h4 className="font-body text-[10px] tracking-[0.25em] uppercase text-primary mb-2">{t('nav_locations')}</h4>
            <div className="grid grid-cols-2 lg:grid-cols-2 gap-3 lg:gap-3">
              {LOCATIONS_DATA.map(loc => (
                <Link key={loc.slug} to={loc.phone ? `/locations/${loc.slug}` : '#'} onClick={closeFooter}
                  className={`group ${!loc.phone ? 'cursor-default' : ''}`}>
                  <h5 className="font-heading text-sm font-semibold text-foreground mb-1 group-hover:text-primary transition-colors duration-300">
                    {loc.city}
                    {!loc.phone && (
                      <span className="ml-2 text-[9px] font-body tracking-widest uppercase text-primary/60 font-normal">{t('loc_coming_soon')}</span>
                    )}
                  </h5>
                  {loc.phone ? (
                    <div className="space-y-0.5">
                      <p className="font-body text-xs text-muted-foreground flex items-start gap-1.5">
                        <MapPin className="w-3 h-3 mt-0.5 flex-shrink-0 text-primary/60" />{loc.address}
                      </p>
                      <p className="font-body text-xs text-muted-foreground flex items-center gap-1.5">
                        <Phone className="w-3 h-3 flex-shrink-0 text-primary/60" />{loc.phone}
                      </p>
                    </div>
                  ) : (
                    <p className="font-body text-xs text-muted-foreground/60">{t('footer_info_soon')}</p>
                  )}
                </Link>
              ))}
            </div>
          </div>
        </div>

        <div className="md:hidden flex items-center justify-center gap-3 mb-4">
          {LANGUAGES.map(l => (
            <button
              key={l.code}
              onClick={() => changeLang(l.code)}
              className="font-body text-[10px] tracking-widest uppercase px-3.5 py-1.5 rounded-full transition-colors duration-300"
              style={{
                color: lang === l.code ? 'hsl(var(--primary))' : 'hsl(var(--muted-foreground))',
                border: lang === l.code ? '1px solid hsl(var(--primary) / 0.55)' : '1px solid hsl(var(--border))',
                background: lang === l.code ? 'hsl(var(--primary) / 0.10)' : 'transparent',
              }}
            >
              {l.code}
            </button>
          ))}
        </div>

        <div className="border-t border-border/40 pt-4 flex flex-col md:flex-row items-center justify-between gap-3">
          <div className="flex flex-col gap-1">
            <p className="font-body text-xs text-muted-foreground">
              © {new Date().getFullYear()}{' '}
              <Link to="/yellow-preview" className="hover:text-primary transition-colors duration-300">Ardan & Tylwyth Boffé</Link>
              ,{' '}
              <Link to="/burgundy-preview" className="hover:text-primary transition-colors duration-300">Patrick Leniere</Link>
              {' '}en{' '}
              <Link to="/powder-blue-preview" className="hover:text-primary transition-colors duration-300">Bogèst team</Link>.
            </p>
            <p className="font-body text-xs text-muted-foreground">
              Designed by{' '}
              <a href="https://www.stdio-stdio.com" target="_blank" rel="noopener noreferrer"
                className="hover:text-primary transition-colors duration-300">
                STDIO-STDIO
              </a>.
            </p>
          </div>
          <div className="flex items-center gap-4 flex-wrap justify-center md:justify-end md:pr-32">
            <Link
              to="/assets"
              className="font-body text-[10px] tracking-widest uppercase text-foreground/20 hover:text-foreground/40 transition-colors duration-300"
            >
              Beeldbank
            </Link>
            <Link to="/privacy" className="font-body text-xs text-muted-foreground hover:text-primary transition-colors duration-300">
              {t('footer_privacy')}
            </Link>
            <Link to="/terms" className="font-body text-xs text-muted-foreground hover:text-primary transition-colors duration-300">
              {t('footer_terms')}
            </Link>
            <button
              onClick={() => { closeFooter(); openCookiePreferences(); }}
              className="font-body text-xs text-muted-foreground hover:text-primary transition-colors duration-300 text-left"
            >
              Cookievoorkeuren
            </button>
            <Link
              to="/admin-login"
              className="font-body text-[10px] tracking-widest uppercase text-foreground/20 hover:text-foreground/40 transition-colors duration-300"
            >
              Admin
            </Link>
          </div>
        </div>
      </div>
      </div>
    </motion.footer>
  );
}