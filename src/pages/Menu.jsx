import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useLang } from '@/lib/LangContext';
import { MENU_DATA, loc } from '@/lib/data';
import { PanelScrollContext } from '@/components/GlassPanel';
import PanelHero from '@/components/PanelHero';
import SectionReveal from '@/components/ui/SectionReveal';

function PageHero() {
  const { t } = useLang();
  return (
    <PanelHero label={t('menu_label')} title={t('menu_title')} titleAccent={t('menu_title_accent')} positionKey="menu.hero">
      <div className="inline-flex items-center gap-3 px-4 py-2.5 bg-primary/10 rounded-lg border border-primary/20 mt-5">
        <span className="font-body text-[10px] tracking-[0.2em] uppercase text-primary/80">{t('menu_formula_label')}</span>
        <span className="w-px h-3 bg-primary/30" />
        <span className="font-body text-sm text-foreground/90 font-medium">{t('menu_formula')}</span>
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
  const str = price.toFixed(2).replace('.', lang === 'en' ? '.' : ',');
  return `€${str}`;
}

function CategoryRow({ cat, index }) {
  const { t, lang } = useLang();
  const number = String(index + 1).padStart(2, '0');
  return (
    <div id={cat.id} className="scroll-mt-32 py-14 md:py-20 border-b border-border/50 last:border-0">
      <SectionReveal>
        {/* Header */}
        <div className="flex items-start gap-5 md:gap-7 mb-9">
          <span className="font-heading text-5xl md:text-6xl font-bold leading-none text-primary/25 select-none">
            {number}
          </span>
          <div className="flex-1 min-w-0">
            <h3 className="font-heading text-2xl md:text-4xl font-bold text-foreground leading-tight">
              {t(cat.key)}
            </h3>
            <div className="flex items-center gap-2 mt-4">
              <div className="w-14 h-px bg-primary/50" />
              <div className="w-1.5 h-1.5 rounded-full bg-primary/40" />
            </div>
          </div>
          {cat.image && (
            <div className="hidden md:block relative flex-shrink-0 w-28 h-28 rounded-xl overflow-hidden"
              style={{ border: '1px solid rgba(231,205,112,0.22)' }}>
              <img src={cat.image} alt={t(cat.key)} loading="lazy"
                className="w-full h-full object-cover"
                style={{ filter: 'saturate(0.85) brightness(0.92)' }} />
              <div className="absolute top-2 left-2 w-6 h-6 border-t border-l border-primary/50 rounded-tl-md" />
              <div className="absolute bottom-2 right-2 w-6 h-6 border-b border-r border-primary/50 rounded-br-md" />
            </div>
          )}
        </div>

        {/* Items */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-12">
          {cat.items.map(item => {
            const priceStr = formatPrice(item.price, lang);
            return (
              <div key={item.id} data-highlight={slugify(loc(item.name, 'nl'))}
                className="group py-4 border-b border-border/40 last:border-0 lg:[&:nth-last-child(1)]:border-0 lg:[&:nth-last-child(2)]:border-0">
                <div className="flex items-baseline gap-3">
                  <span className="font-heading text-base font-medium text-foreground group-hover:text-primary transition-colors duration-300">
                    {loc(item.name, lang)}
                  </span>
                  <span className="flex-1 border-b border-dotted border-border/60 translate-y-[-4px] opacity-70" />
                  {priceStr ? (
                    <span className="font-body text-sm font-semibold text-primary whitespace-nowrap">{priceStr}</span>
                  ) : (
                    <span className="font-body text-[10px] tracking-[0.15em] uppercase text-primary/80 whitespace-nowrap px-2 py-0.5 rounded-full border border-primary/25 bg-primary/5">
                      {t('menu_included')}
                    </span>
                  )}
                </div>
                {item.desc && (
                  <p className="font-body text-xs text-muted-foreground mt-1.5 italic leading-relaxed pr-2">
                    {loc(item.desc, lang)}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </SectionReveal>
    </div>
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
      const offset = elTop - containerTop + container.scrollTop - 80;
      container.scrollTo({ top: offset, behavior: 'smooth' });
    } else {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="w-full">
      <PageHero />

      {/* Sticky category nav — glassmorphism */}
      <div className="sticky top-0 z-30 bg-background/70 backdrop-blur-2xl border-b border-border/60">
        <div className="w-full px-6 md:px-10 lg:px-16 py-3.5 overflow-x-auto">
          <div className="flex gap-2 min-w-max">
            {MENU_DATA.map((cat, i) => (
              <button key={cat.id} onClick={() => scrollTo(cat.id)}
                className={`relative px-4 py-2 rounded-full font-body text-xs tracking-wide whitespace-nowrap transition-all duration-300 ${
                  activeId === cat.id
                    ? 'bg-primary text-primary-foreground shadow-md shadow-primary/20'
                    : 'text-muted-foreground hover:text-foreground hover:bg-secondary/60'
                }`}>
                <span className="opacity-50 mr-1.5 font-heading">{String(i + 1).padStart(2, '0')}</span>
                {t(cat.key)}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="w-full px-6 md:px-10 lg:px-16 pb-24">
        {MENU_DATA.map((cat, i) => <CategoryRow key={cat.id} cat={cat} index={i} />)}

        <SectionReveal className="text-center mt-16">
          <p className="font-body text-sm text-muted-foreground mb-5">{t('menu_formula')}</p>
          <Link to="/reserve"
            className="group inline-flex items-center gap-2 px-9 py-4 bg-primary text-primary-foreground font-body text-xs tracking-widest uppercase rounded-full hover:bg-primary/90 transition-all duration-500 shadow-lg shadow-primary/20">
            {t('btn_reserve')}
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform duration-300" />
          </Link>
        </SectionReveal>
      </div>
    </div>
  );
}