import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { useLang } from '@/lib/LangContext';

const KIDS_MENU = {
  nl: {
    priceLine: '€21 per menu · voor kinderen tot 12 jaar',
    note: 'We voorzien het hoofdgerecht in een aangepaste portie.',
    courses: [
      { label: 'Voorgerecht', options: 'Luiks bouletje of tomatensoep' },
      { label: 'Hoofdgerecht', options: "Steak saignant of à point, kippenbrochette, ribbetje, stoofvlees, bouletten, vidée, kefte's, 1 ribbetje, scampibrochette of zuiders gehaktballetjes" },
      { label: 'Dessert', options: 'Bolletje ijs, al dan niet met saus' },
    ],
  },
  fr: {
    priceLine: '21 € par menu · pour les enfants de moins de 12 ans',
    note: 'Le plat principal est servi en portion adaptée.',
    courses: [
      { label: 'Entrée', options: 'Boulet liégeois ou soupe à la tomate' },
      { label: 'Plat principal', options: "Steak saignant ou à point, brochette de poulet, côtelette, carbonnade, boulets, vidée, kefte's, 1 côtelette, brochette de scampis ou boulettes méditerranéennes" },
      { label: 'Dessert', options: 'Boule de glace, avec ou sans sauce' },
    ],
  },
  en: {
    priceLine: '€21 per menu · for children under 12',
    note: 'The main course is served in an adapted portion.',
    courses: [
      { label: 'Starter', options: 'Liège meatball or tomato soup' },
      { label: 'Main course', options: "Steak rare or medium, chicken brochette, spare rib, beef stew, meatballs, vidée, kefte's, 1 spare rib, scampi brochette or Mediterranean meatballs" },
      { label: 'Dessert', options: 'Ice cream scoop, with or without sauce' },
    ],
  },
};

/**
 * KidsMenu — the children's menu as a fixed-price 3-course formula (€21),
 * rendered as an editorial block consistent with CategoryRow.
 */
export default function KidsMenu({ idx }) {
  const { t, lang } = useLang();
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-40px' });
  const km = KIDS_MENU[lang] || KIDS_MENU.nl;

  return (
    <motion.div
      ref={ref}
      id="kinderen"
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="scroll-mt-32 py-12 border-b border-border last:border-0"
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-4">
          <div className="lg:sticky lg:top-32">
            <span className="font-heading font-bold text-primary/20 block leading-none mb-4 text-7xl md:text-8xl">{String(idx + 1).padStart(2, '0')}</span>
            <h3 className="font-heading text-3xl md:text-5xl font-bold leading-[0.95] text-foreground">{t('cat_kids')}<span className="text-primary">.</span></h3>
            <p className="font-body text-sm font-medium text-primary mt-5 tracking-wide">{km.priceLine}</p>
            <p className="font-body text-xs text-muted-foreground italic mt-3 leading-relaxed max-w-xs">{km.note}</p>
          </div>
        </div>
        <div className="lg:col-span-8">
          {km.courses.map((c, i) => (
            <div key={i} className="py-5 border-b border-border/40 last:border-0">
              <div className="flex items-center gap-3 mb-3">
                <span className="font-body text-[10px] tracking-[0.3em] uppercase text-primary">{c.label}</span>
                <span className="flex-1 h-px bg-border/50" />
              </div>
              <p className="font-heading text-lg md:text-2xl text-foreground leading-snug">{c.options}</p>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}