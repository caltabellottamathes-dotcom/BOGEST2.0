import React, { useState, useRef, useContext } from 'react';
import { Link } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { useLang } from '@/lib/LangContext';
import { MENU_DATA, loc } from '@/lib/data';
import { PanelScrollContext } from '@/components/GlassPanel';
import PanelHero from '@/components/PanelHero';

function PageHero() {
  const { t } = useLang();
  return (
    <PanelHero label={t('menu_label')} title={t('menu_title')} titleAccent={t('menu_title_accent')} bgImage="https://images.squarespace-cdn.com/content/v1/68b84525485ccc7e15a25577/1756906799913-Y5ZEKPI4I2XXUTYC8W3T/d2db3621-8f9b-45f1-95c8-498c24ed15c3-1.jpg">
      <div className="inline-flex items-center gap-3 px-4 py-2.5 bg-primary/8 rounded-lg border border-primary/15 mt-5">
        <span className="font-body text-xs text-muted-foreground">{t('menu_formula_label')}</span>
        <span className="font-body text-sm text-foreground font-medium">{t('menu_formula')}</span>
      </div>
    </PanelHero>
  );
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
          {cat.items.map(item => (
            <div key={item.id} className="group flex items-baseline justify-between gap-4 py-3.5 border-b border-border/50 last:border-0">
              <div>
                <span className="font-heading text-base font-medium text-foreground group-hover:text-primary transition-colors duration-300">
                  {loc(item.name, lang)}
                </span>
                {item.desc && <p className="font-body text-xs text-muted-foreground mt-0.5">{loc(item.desc, lang)}</p>}
              </div>
              <span className="font-body text-sm font-medium text-primary whitespace-nowrap">
                {item.price != null ? `€${item.price.toFixed(2)}` : t('menu_included')}
              </span>
            </div>
          ))}
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
    // If inside a panel scroll container, scroll that; otherwise fallback to window
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
            {MENU_DATA.map(cat => (
              <button key={cat.id} onClick={() => scrollTo(cat.id)}
                className={`px-4 py-2 rounded-full font-body text-xs tracking-wide whitespace-nowrap transition-all duration-200 ${
                  activeId === cat.id ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
                }`}>
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