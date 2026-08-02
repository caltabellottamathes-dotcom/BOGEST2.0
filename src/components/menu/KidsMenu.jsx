import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { useLang } from '@/lib/LangContext';

const KIDS_MENU = {
  nl: {
    perMenu: 'per menu',
    ageLine: 'voor kinderen tot 12 jaar',
    note: 'We voorzien het hoofdgerecht in een aangepaste portie.',
    courses: [
      { label: 'Voorgerecht', dishes: ['Luiks bouletje', 'Tomatensoep'] },
      { label: 'Hoofdgerecht', dishes: ['Steak saignant of à point', 'Kippenbrochette', 'Ribbetje', 'Stoofvlees', 'Bouletten', 'Vidée', "Kefte's", '1 ribbetje', 'Scampibrochette', 'Zuiders gehaktballetjes'] },
      { label: 'Dessert', dishes: ['Bolletje ijs, al dan niet met saus'] },
    ],
  },
  fr: {
    perMenu: 'par menu',
    ageLine: 'pour les enfants de moins de 12 ans',
    note: 'Le plat principal est servi en portion adaptée.',
    courses: [
      { label: 'Entrée', dishes: ['Boulet liégeois', 'Soupe à la tomate'] },
      { label: 'Plat principal', dishes: ['Steak saignant ou à point', 'Brochette de poulet', 'Côtelette', 'Carbonnade', 'Boulets', 'Vidée', "Kefte's", '1 côtelette', 'Brochette de scampis', 'Boulettes méditerranéennes'] },
      { label: 'Dessert', dishes: ['Boule de glace, avec ou sans sauce'] },
    ],
  },
  en: {
    perMenu: 'per menu',
    ageLine: 'for children under 12',
    note: 'The main course is served in an adapted portion.',
    courses: [
      { label: 'Starter', dishes: ['Liège meatball', 'Tomato soup'] },
      { label: 'Main course', dishes: ['Steak rare or medium', 'Chicken brochette', 'Spare rib', 'Beef stew', 'Meatballs', 'Vidée', "Kefte's", '1 spare rib', 'Scampi brochette', 'Mediterranean meatballs'] },
      { label: 'Dessert', dishes: ['Ice cream scoop, with or without sauce'] },
    ],
  },
};

/**
 * KidsMenu — fixed-price 3-course children's formula (€21), rendered in the
 * exact same row style as the rest of the menu (CategoryRow): each dish is its
 * own row with a dotted leader and an "Inbegrepen" badge, grouped under a
 * small course label.
 */
export default function KidsMenu({ idx }) {
  const { t, lang } = useLang();
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-40px' });
  const km = KIDS_MENU[lang] || KIDS_MENU.nl;

  const renderDish = (dish, key) => (
    <div key={key} className="group relative py-3.5 border-b border-border/40 last:border-0">
      <div className="flex items-baseline gap-3">
        <span className="font-heading text-base font-medium text-foreground group-hover:text-primary transition-colors duration-300">
          {dish}
        </span>
        <span className="flex-1 border-b border-dotted border-border/50" />
        <span className="font-body text-[10px] tracking-[0.15em] uppercase text-primary/80 whitespace-nowrap px-2 py-0.5 rounded-full border border-primary/25 bg-primary/5">
          {t('menu_included')}
        </span>
      </div>
    </div>
  );

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
            <div className="mt-6 flex items-baseline gap-2">
              <span className="font-heading text-4xl md:text-5xl font-bold text-primary">€21</span>
              <span className="font-body text-[11px] uppercase tracking-[0.2em] text-muted-foreground">{km.perMenu}</span>
            </div>
            <p className="font-body text-xs text-muted-foreground mt-2">{km.ageLine}</p>
            <p className="font-body text-xs text-muted-foreground italic mt-3 leading-relaxed max-w-xs">{km.note}</p>
          </div>
        </div>
        <div className="lg:col-span-8">
          {km.courses.map((c, ci) => (
            <div key={ci}>
              <div className={`flex items-center gap-3 ${ci === 0 ? 'pt-0' : 'pt-6'} pb-1`}>
                <span className="font-body text-[10px] tracking-[0.3em] uppercase text-primary">{c.label}</span>
                <span className="flex-1 h-px bg-border/50" />
              </div>
              {c.dishes.map((dish, di) => renderDish(dish, `${ci}-${di}`))}
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}