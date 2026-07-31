import React, { useState, useRef, useContext } from 'react';
import { Link } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { useLang } from '@/lib/LangContext';
import { useSiteImages } from '@/lib/SiteImageContext';
import { MENU_DATA, loc } from '@/lib/data';
import { PanelScrollContext } from '@/components/GlassPanel';
import PanelHero from '@/components/PanelHero';
import HostHint from '@/components/HostHint';
import { hostQuestion, hostHintLabel } from '@/lib/hostHint';
import { SuggestionCard, SUGGESTIONS, MONTH_NAMES, SECTION_LABELS } from '@/components/home/SeasonalSection';

const RESERVE_IMG = 'https://images.squarespace-cdn.com/content/v1/68b84525485ccc7e15a25577/1756906798149-17KHS8RDD2FJIZI179ZQ/EF6D9D08-F3ED-41E2-9392-96AB73DEF2E6.jpeg';

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
  const { siteImg } = useSiteImages();
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
          <div className="lg:sticky lg:top-32 group/cat">
            <h3 className="font-heading text-2xl md:text-3xl font-bold text-foreground">{t(cat.key)}</h3>
            {cat.image && (
              <div className="mt-4 overflow-hidden rounded-2xl border border-border/60 max-w-xs max-h-0 opacity-0 group-hover/cat:max-h-56 group-hover/cat:opacity-100 transition-all duration-500">
                <img src={siteImg('menucat.' + cat.id) || cat.image} alt={t(cat.key)} className="w-full h-44 object-cover" loading="lazy" />
              </div>
            )}
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
                <div className="flex items-center gap-2 flex-shrink-0">
                  <div>
                    {priceStr ? (
                      <span className="font-body text-sm font-medium text-primary whitespace-nowrap">{priceStr}</span>
                    ) : (
                      <span className="font-body text-[10px] tracking-[0.15em] uppercase text-primary/80 whitespace-nowrap px-2 py-0.5 rounded-full border border-primary/25 bg-primary/5">
                        {t('menu_included')}
                      </span>
                    )}
                  </div>
                  <HostHint question={hostQuestion(lang, loc(item.name, lang))} label={hostHintLabel(lang)} />
                </div>
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
  const { siteImg } = useSiteImages();
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

      <div className="w-full px-6 md:px-10 lg:px-16 pb-24">
        {MENU_DATA.map(cat => <CategoryRow key={cat.id} cat={cat} />)}

        <div className="mt-20 relative overflow-hidden rounded-3xl border border-border">
          <img src={siteImg('menu.reserve') || RESERVE_IMG} alt="" aria-hidden="true" className="absolute inset-0 w-full h-full object-cover" loading="lazy" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/55 to-black/25" />
          <div className="relative z-10 px-6 md:px-12 py-14 md:py-20 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <span className="font-body text-[10px] tracking-[0.35em] uppercase text-primary mb-3 block">{t('section_reserve')}</span>
              <h2 className="font-heading text-2xl md:text-4xl font-bold text-white max-w-xl leading-tight">{t('res_title')}</h2>
            </div>
            <Link to="/reserve" className="group inline-flex items-center gap-2 px-9 py-4 bg-primary text-primary-foreground font-body text-xs tracking-widest uppercase rounded-full hover:opacity-90 transition-opacity duration-300 self-start md:self-auto flex-shrink-0">
              {t('btn_reserve')}
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform duration-300" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}