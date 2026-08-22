import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Menu } from 'lucide-react';
import BogestLogo from '@/components/BogestLogo';
import { useTheme } from '@/lib/ThemeContext';
import { useLang } from '@/lib/LangContext';
import { LANGUAGES } from '@/lib/i18n';


export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [visible, setVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const { theme } = useTheme();
  const { lang, t, changeLang } = useLang();
  const location = useLocation();
  const navigate = useNavigate();
  const langRef = useRef(null);

  const isHome = location.pathname === '/';

  useEffect(() => {
    const handleScroll = () => {
      const y = window.scrollY;
      // Show/hide based on scroll direction
      if (y < 80) {
        setVisible(true);
        setScrolled(false);
      } else {
        setScrolled(true);
        if (y > lastScrollY + 10) {
          setVisible(false); // scrolling down
        } else if (y < lastScrollY - 5) {
          setVisible(true); // scrolling up
        }
      }
      setLastScrollY(y);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  useEffect(() => {
    setMobileOpen(false);
    setLangOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  useEffect(() => {
    const handleClick = (e) => {
      if (langRef.current && !langRef.current.contains(e.target)) setLangOpen(false);
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const navLinks = [
    { label: t('nav_menu'), path: '/menu' },
    { label: t('nav_locations'), path: '/locations' },
    { label: t('nav_about'), path: '/about' },
    { label: t('nav_takeaway'), path: '/takeaway' },
    { label: t('nav_giftcards'), path: '/gift-cards' },
    { label: t('nav_jobs'), path: '/jobs' },
    { label: t('nav_groups'), path: '/groups' },
    { label: t('nav_contact'), path: '/contact' },
  ];

  const isTransparent = isHome && !scrolled;

  return (
    <>
      <motion.header
       initial={{ y: 0 }}
       animate={{ y: 0 }}
       transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
       className={`fixed left-0 right-0 z-[70] transition-all duration-500 rounded-b-2xl ${
         isTransparent
           ? 'bg-transparent'
           : 'bg-background/30 backdrop-blur-2xl border-b border-white/10 shadow-sm'
       }`}
       style={{ top: 'var(--bogest-banner-h, 0px)', ...(!isTransparent ? { boxShadow: '0 1px 0 rgba(255,255,255,0.08)' } : {}) }}
      >
        <nav className="w-full px-6 md:px-10 lg:px-16 h-16 md:h-20 flex items-center justify-between gap-6">
          {/* Logo — wordmark only, hide when mobile menu is open to avoid overlap */}
          <button
            type="button"
            onClick={() => {
              setMobileOpen(false);
              if (location.pathname === '/') {
                window.scrollTo({ top: 0, behavior: 'smooth' });
              } else {
                navigate('/');
              }
            }}
            className={`flex-shrink-0 flex items-center transition-opacity duration-200 ${mobileOpen ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
          >
            <BogestLogo className="text-xl tracking-wide" />
          </button>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-7">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`font-body text-xs tracking-widest uppercase transition-colors duration-300 hover:text-primary ${
                  isTransparent
                    ? (location.pathname === link.path ? 'text-white' : 'text-white/60')
                    : (location.pathname === link.path ? 'text-primary' : 'text-foreground/70')
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right controls */}
          <div className="flex items-center gap-1 md:gap-2">
            {/* Mobile / tablet menu — opens the footer as the site menu */}
            <button
              onClick={() => window.dispatchEvent(new CustomEvent('bogest:open-footer'))}
              aria-label={lang === 'fr' ? 'Navigation' : lang === 'en' ? 'Navigation' : 'Navigatie'}
              className={`lg:hidden flex items-center justify-center w-9 h-9 -mr-1 rounded-full transition-colors duration-300 ${isTransparent ? 'text-white/80 hover:text-white' : 'text-foreground/70 hover:text-primary'}`}
            >
              <Menu className="w-5 h-5" strokeWidth={1.75} />
            </button>
            {/* Language switcher */}
            <div className="relative" ref={langRef}>
              <button
                onClick={() => setLangOpen(!langOpen)}
                className={`hidden md:flex items-center gap-1 px-2.5 py-1.5 rounded-md font-body text-xs tracking-widest uppercase transition-colors duration-300 ${
                  isTransparent ? 'text-white/60 hover:text-white' : 'text-primary/70 hover:text-primary'
                }`}
              >
                {lang.toUpperCase()}
                <ChevronDown className={`w-3 h-3 transition-transform duration-300 ${langOpen ? 'rotate-180' : ''}`} />
              </button>
              <AnimatePresence>
                {langOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.15 }}
                    className="absolute top-full right-0 mt-2 bg-background/60 backdrop-blur-2xl border border-white/10 rounded-xl shadow-xl overflow-hidden min-w-[110px]"
                  >
                    {LANGUAGES.map((l) => (
                      <button
                        key={l.code}
                        onClick={() => { changeLang(l.code); setLangOpen(false); }}
                        className={`w-full text-left px-4 py-2.5 font-body text-xs hover:bg-white/5 transition-colors duration-200 ${
                          lang === l.code ? 'text-primary font-medium' : 'text-foreground/80'
                        }`}
                      >
                        {l.name}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Reserve CTA */}
            <Link
              to="/reserve"
              className={`inline-flex px-4 py-2 rounded-full font-body text-xs tracking-widest uppercase transition-all duration-500 ${
                isTransparent
                  ? 'border border-white/30 text-white hover:bg-white/10'
                  : 'bg-primary text-primary-foreground hover:bg-primary/90'
              }`}
            >
              {t('nav_reserve')}
            </Link>

          </div>
        </nav>
      </motion.header>

      {/* Mobile menu is now the footer — opened via bogest:open-footer */}
    </>
  );
}