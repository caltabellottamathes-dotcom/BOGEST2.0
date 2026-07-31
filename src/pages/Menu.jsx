import React, { useState, useRef, useContext } from 'react';
import { Link } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { useLang } from '@/lib/LangContext';
import { MENU_DATA, loc } from '@/lib/data';
import { PanelScrollContext } from '@/components/GlassPanel';
import PanelHero from '@/components/PanelHero';
import HostHint from '@/components/HostHint';
import { hostQuestion, hostHintLabel } from '@/lib/hostHint';

function PageHero() {
  const { t } = useLang();
  return (
    <PanelHero label={t('menu_label')} title={t('menu_title')} titleAccent={t('menu_title_accent')} positionKey="menu.hero">
      <div className="inline-flex items-center gap-3 px-4 py-2.5 bg-primary/8 rounded-lg border border-primary/15 mt-5">
        <span className="font-body text-xs text-muted-foreground">{t('menu_formula_label')}</span>
        <span className="font-body text-sm text-foreground font-medium">{t('menu_formula')}</span>
      </div>
    </PanelHero>
  );
}

function slugify(s) {
  return String(s || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function formatPrice(price, lang) {
  if (price == null) return null;
  return `€${price.toFixed(2).replace('.', lang === 'en' ? '.' : ',')}`;
}

function CategoryRow({ cat }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-40px' });
  const { t, lang } = useLang();
  return (
    <motion.div
      ref={ref}
      id={cat.id}
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className="scroll-mt-32 py-12 border-b border-border last:border-0"
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-4">
          <div className="lg:sticky lg:top-32">
            <h3 className="font-heading text-2xl md:text-3xl font-bold text-foreground">{t(cat.key)}</h3>
          </div>
        </div>
        <div className="lg:col-span-8">
          {cat.items.map(item => {
            const priceStr = formatPrice(item.price, lang);
            return (
              <div key={item.id} data-highlight={slugify(loc(item.name, 'nl'))} className="group relative flex items-baseline justify-between gap-4 py-3.5 border-b border-border/50 last:border-0">
                <div className="min-w-0 pr-2">
                  <span className="font-heading text-base font-medium text-foreground group-hover:text-primary transition-colors duration-300">
                    {loc(item.name, lang)}
                  </span>
                  {item.desc && <p className="font-body text-xs text-muted-foreground mt-0.5">{loc(item.desc, lang)}</p>}
                </div>
                <div className="relative flex-shrink-0">
                  {priceStr ? (
                    <span className="font-body text-sm font-medium text-primary whitespace-nowrap">{priceStr}</span>
                  ) : (
                    <span className="font-body text-[10px] tracking-[0.15em] uppercase text-primary/80 whitespace-nowrap px-2 py-0.5 rounded-full border border-primary/25 bg-primary/5">
                      {t('menu_included')}
                    </span>
                  )}
                  <HostHint question={hostQuestion(lang, loc(item.name, lang))} label={hostHintLabel(lang)} className="absolute right-0 top-1/2 -translate-y-1/2 z-10 opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}

export default function Menu() {
  const { t } = useLang();
  const [activeId, setActiveId] = useState(MENU_DATA[0].id);
  const panelRef = useContext(PanelScrollContext);

  const scrollTo = (id) => {
    setActiveId(id);
    const el = document.getElementById(id);
    if (!el) return;
    const container = panelRef?.current;
    if (container) {
      const containerTop = container.getBoundingClientRect().top;
      const elTop = el.getBoundingClientRect().top;
      const offset = elTop - containerTop + container.scrollTop - 72;
      container.scrollTo({ top: offset, behavior: 'smooth' });
    } else {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="w-full">
      <PageHero />

      <div className="sticky top-0 z-30 bg-background/60 backdrop-blur-2xl border-b border-white/8">
        <div className="w-full px-6 md:px-10 lg:px-16 py-3 overflow-x-auto">
          <div className="flex gap-1.5 min-w-max">
            {MENU_DATA.map((cat, i) => (
              <button key={cat.id} onClick={() => scrollTo(cat.id)}
                className={`px-4 py-2 rounded-full font-body text-xs tracking-wide whitespace-nowrap transition-all duration-200 ${
                  activeId === cat.id ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
                }`}>
                <span className="opacity-50 mr-1.5 font-heading">{String(i + 1).padStart(2, '0')}</span>
                {t(cat.key)}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="w-full px-6 md:px-10 lg:px-16 pb-24">
        {MENU_DATA.map(cat => <CategoryRow key={cat.id} cat={cat} />)}

        <div className="text-center mt-16">
          <Link to="/reserve"
            className="group inline-flex items-center gap-2 px-9 py-4 bg-primary text-primary-foreground font-body text-xs tracking-widest uppercase rounded-full hover:bg-primary/90 transition-all duration-500">
            {t('btn_reserve')}
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform duration-300" />
          </Link>
        </div>
      </div>
    </div>
  );
}