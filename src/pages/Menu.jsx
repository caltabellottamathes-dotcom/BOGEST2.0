import React, { useState, useRef, useContext, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';
import { useLang } from '@/lib/LangContext';
import { MENU_DATA, loc } from '@/lib/data';
import { PanelScrollContext } from '@/components/GlassPanel';
import PanelHero from '@/components/PanelHero';
import PanelContent from '@/components/PanelContent';
import HostHint from '@/components/HostHint';
import { hostQuestion } from '@/lib/hostHint';
import { SuggestionCard, SUGGESTIONS, MONTH_NAMES, SECTION_LABELS } from '@/components/home/SeasonalSection';
import ReserveCtaSection from '@/components/ReserveCtaSection';
import KidsMenu from '@/components/menu/KidsMenu';

function PageHero() {
  const { t } = useLang();
  return (
    <PanelHero label={t('menu_label')} title={t('menu_title')} titleAccent={t('menu_title_accent')} subtitle={t('menu_panel_subtitle')} positionKey="menu.hero" bgImage="https://images.squarespace-cdn.com/content/v1/68b84525485ccc7e15a25577/1756906793880-RYMZN9OWYYUERUL16C6K/B4E94C22-3656-4874-A66B-CEA4D674F86D.jpeg">
      <p className="font-body text-sm text-white/75 mt-4 max-w-xl leading-relaxed" style={{ textShadow: '0 1px 12px rgba(0,0,0,0.5)' }}>
        <span className="text-primary font-medium">{t('menu_formula_label')} — </span>{t('menu_formula')}.
      </p>
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
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="scroll-mt-32 py-12 border-b border-border last:border-0"
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-4">
          <div className="lg:sticky lg:top-32">
            <span className="font-heading font-bold text-primary/20 block leading-none mb-4 text-7xl md:text-8xl">{String(idx + 1).padStart(2, '0')}</span>
            <h3 className="font-heading text-3xl md:text-5xl font-bold leading-[0.95] text-foreground">{t(cat.key)}<span className="text-primary">.</span></h3>
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
    <section id="maandselectie" className="w-full px-6 md:px-10 lg:px-16 pt-12 md:pt-16 pb-10">
      <div className="mb-8 md:mb-10">
        <div className="flex items-center gap-3 mb-4">
          <span className="h-px w-10 bg-primary" />
          <span className="font-body text-[10px] tracking-[0.35em] uppercase text-primary">{monthLabel} {now.getFullYear()}</span>
        </div>
        <h2 className="font-heading text-3xl md:text-5xl font-bold leading-[0.95] text-foreground">{(SECTION_LABELS[lang] || SECTION_LABELS.nl).title}<span className="text-primary">.</span></h2>
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
  const tabsScrollRef = useRef(null);
  const tabRefs = useRef({});
  const programmaticRef = useRef(false);

  const scrollTo = (id) => {
    setActiveId(id);
    programmaticRef.current = true;
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
    window.setTimeout(() => { programmaticRef.current = false; }, 850);
  };

  // Scroll-spy — the tab of the section currently in view lights up (gold).
  useEffect(() => {
    const container = panelRef?.current;
    if (!container) return;
    const onScroll = () => {
      if (programmaticRef.current) return;
      const trigger = container.getBoundingClientRect().top + 150;
      let current = MENU_DATA[0].id;
      for (const cat of MENU_DATA) {
        const el = document.getElementById(cat.id);
        if (!el) continue;
        if (el.getBoundingClientRect().top <= trigger) current = cat.id;
      }
      setActiveId((prev) => (prev !== current ? current : prev));
    };
    onScroll();
    container.addEventListener('scroll', onScroll, { passive: true });
    return () => container.removeEventListener('scroll', onScroll);
  }, [panelRef]);

  // Keep the active tab centred inside the horizontal tabs scroller.
  useEffect(() => {
    const scroller = tabsScrollRef.current;
    const btn = tabRefs.current[activeId];
    if (!scroller || !btn) return;
    const target = btn.offsetLeft - scroller.clientWidth / 2 + btn.offsetWidth / 2;
    scroller.scrollTo({ left: Math.max(0, target), behavior: 'smooth' });
  }, [activeId]);

  return (
    <div className="w-full">
      <PageHero />

      <PanelContent>
      <Maandselectie />

      <div className="sticky top-0 z-30 bg-background/92 backdrop-blur-sm border-b border-white/8">
        <div ref={tabsScrollRef} className="w-full px-6 md:px-10 lg:px-16 py-4 overflow-x-auto" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
          <div className="flex gap-6 min-w-max">
            {MENU_DATA.map((cat, i) => {
              const active = activeId === cat.id;
              return (
                <button key={cat.id} ref={(el) => { if (el) tabRefs.current[cat.id] = el; }} onClick={() => scrollTo(cat.id)}
                  className={`inline-flex items-center gap-2 font-body text-[11px] tracking-[0.25em] uppercase whitespace-nowrap transition-colors duration-200 ${active ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}`}>
                  <span className={`font-heading text-sm font-bold ${active ? 'text-primary' : 'text-muted-foreground/50'}`}>{String(i + 1).padStart(2, '0')}</span>
                  <span>{t(cat.key)}</span>
                  <span className={`h-1 w-1 rounded-full bg-primary transition-opacity duration-200 ${active ? 'opacity-100' : 'opacity-0'}`} />
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="w-full px-6 md:px-10 lg:px-16 pb-10">
        {MENU_DATA.map((cat, idx) => cat.id === 'kinderen' ? <KidsMenu key={cat.id} idx={idx} /> : <CategoryRow key={cat.id} cat={cat} idx={idx} />)}
      </div>

      <ReserveCtaSection />
      </PanelContent>
    </div>
  );
}