import React, { useState, useRef, useContext } from 'react';
import { motion, useInView } from 'framer-motion';
import { useLang } from '@/lib/LangContext';
import { MENU_DATA, loc } from '@/lib/data';
import { PanelScrollContext } from '@/components/GlassPanel';
import PanelHero from '@/components/PanelHero';
import HostHint from '@/components/HostHint';
import { hostQuestion, hostHintLabel } from '@/lib/hostHint';
import { SuggestionCard, SUGGESTIONS, MONTH_NAMES, SECTION_LABELS } from '@/components/home/SeasonalSection';
import ReserveCtaSection from '@/components/ReserveCtaSection';

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

function CategoryRow({ cat, idx }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-40px' });
  const { t, lang } = useLang();
  return (
    <motion.div
      ref={ref}
      id={cat.id}
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className="scroll-mt-32 py-12 border-b border-border last:border-0"
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-4">
          <div className="lg:sticky lg:top-32">
            <span className="font-heading text-5xl md:text-6xl font-bold text-primary/15 block leading-none mb-3">{String(idx + 1).padStart(2, '0')}</span>
            <h3 className="font-heading text-2xl md:text-3xl font-bold text-foreground">{t(cat.key)}</h3>
          </div>
        </div>
        <div className="lg:col-span-8">
          {cat.items.map(item => {
            const priceStr = formatPrice(item.price, lang);
            return (
              <div key={item.id} data-highlight={slugify(loc(item.name, 'nl'))} className="group relative py-3.5 border-b border-border/40 last:border-0">
                <div className="flex items-baseline gap-3">
                  <span className="font-heading text-base font-medium text-foreground group-hover:text-primary transition-colors duration-300">
                    {loc(item.name, lang)}
                  </span>
                  <span className="flex-1 border-b border-dotted border-border/50" />
                  {priceStr ? (
                    <span className="font-body text-sm font-medium text-primary whitespace-nowrap">{priceStr}</span>
                  ) : (
                    <span className="font-body text-[10px] tracking-[0.15em] uppercase text-primary/80 whitespace-nowrap px-2 py-0.5 rounded-full border border-primary/25 bg-primary/5">
                      {t('menu_included')}
                    </span>
                  )}
                  <HostHint variant="inline" question={hostQuestion(lang, loc(item.name, lang))} />
                </div>
                {item.desc && <p className="font-body text-xs text-muted-foreground mt-1.5">{loc(item.desc, lang)}</p>}
              </div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}

function Maandselectie() {
  const { lang } = useLang();
  const now = new Date();
  const monthLabel = (MONTH_NAMES[lang] || MONTH_NAMES.nl)[now.getMonth()];
  const suggestions = SUGGESTIONS[lang] || SUGGESTIONS.nl;
  return (
    <section className="w-full px-6 md:px-10 lg:px-16 pt-12 md:pt-16 pb-10">
      <div className="mb-7">
        <span className="font-body text-[10px] tracking-[0.35em] uppercase text-primary mb-2 block">{monthLabel} {now.getFullYear()}</span>
        <h2 className="font-heading text-2xl md:text-3xl font-bold text-foreground">{(SECTION_LABELS[lang] || SECTION_LABELS.nl).title}</h2>
      </div>
      <div className="flex gap-5 overflow-x-auto pb-4 snap-x snap-mandatory" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
        {suggestions.map((item) => (
          <div key={item.id} className="snap-start flex-shrink-0">
            <SuggestionCard item={item} showFade={false} />
          </div>
        ))}
        <div className="flex-shrink-0 w-6" />
      </div>
    </section>
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

      <Maandselectie />

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

      <div className="w-full px-6 md:px-10 lg:px-16 pb-10">
        {MENU_DATA.map((cat, idx) => <CategoryRow key={cat.id} cat={cat} idx={idx} />)}
      </div>

      <ReserveCtaSection />
    </div>
  );
}