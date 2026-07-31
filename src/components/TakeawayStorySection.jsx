import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, MapPin, Clock, Info, ChefHat, ChevronDown } from 'lucide-react';
import { useLang } from '@/lib/LangContext';

const IMG = {
  classics: 'https://images.squarespace-cdn.com/content/v1/68b84525485ccc7e15a25577/1756906793828-46U4HY2BWRCMXLZD9G2VW/313432687_792246775522672_788010508288086563_n.jpg',
  location: 'https://images.squarespace-cdn.com/content/v1/68b84525485ccc7e15a25577/b7c2edca-9db5-43c2-b109-4cc33197dfbe/veranda+hasselt.jpeg',
  pickup: 'https://images.squarespace-cdn.com/content/v1/68b84525485ccc7e15a25577/1756906798052-P24QWA3M58JWMGOWHVBD/399841843_793829846088881_1062638734165438461_n.jpg',
  formula: 'https://images.squarespace-cdn.com/content/v1/68b84525485ccc7e15a25577/1756906799926-VML5QXWO8V6D1NYAO2ZA/909af4c2-7392-4bbc-af18-2ea890714ecd-1.jpg',
  chef: 'https://images.squarespace-cdn.com/content/v1/68b84525485ccc7e15a25577/1756906793880-RYMZN9OWYYUERUL16C6K/B4E94C22-3656-4874-A66B-CEA4D674F86D.jpeg',
};

/**
 * TakeawayStorySection — interactieve, beeldvaste accordeon. Elke open stap
 * onthult een passende foto naast de uitleg. De titel staat in de PanelHero.
 */
export default function TakeawayStorySection() {
  const { t } = useLang();
  const [open, setOpen] = useState(0);

  const items = [
    { icon: ShoppingBag, title: t('ta_h1_title'), body: t('ta_h1_body'), img: IMG.classics },
    { icon: MapPin, title: t('ta_h2_title'), body: t('ta_h2_body'), img: IMG.location },
    { icon: Clock, title: t('ta_h3_title'), body: t('ta_h3_body'), img: IMG.pickup },
    { icon: Info, title: t('ta_home_p2_title'), body: t('ta_home_p2'), img: IMG.formula },
    { icon: ChefHat, title: t('ta_home_p3_title'), body: t('ta_home_p3'), img: IMG.chef },
  ];

  return (
    <section className="w-full px-6 md:px-10 lg:px-16 pt-10 md:pt-14 pb-10">
      <div className="max-w-5xl">
        <div className="border-t border-border/40">
          {items.map((it, i) => {
            const Icon = it.icon;
            const isOpen = open === i;
            return (
              <div key={i} className="border-b border-border/40">
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? -1 : i)}
                  className="w-full grid grid-cols-12 gap-3 md:gap-6 items-center py-5 md:py-6 text-left group"
                  aria-expanded={isOpen}
                >
                  <span className="col-span-2 md:col-span-1 font-heading font-bold text-primary/25 group-hover:text-primary/50 text-3xl md:text-4xl leading-none transition-colors duration-300">{String(i + 1).padStart(2, '0')}</span>
                  <span className="col-span-7 md:col-span-10 flex items-center gap-3 min-w-0">
                    <Icon className="w-4 h-4 text-primary flex-shrink-0" />
                    <span className="font-heading text-base md:text-2xl font-bold text-foreground group-hover:text-primary transition-colors duration-300 truncate">{it.title}</span>
                  </span>
                  <span className="col-span-3 md:col-span-1 flex justify-end">
                    <motion.span animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }} className="inline-flex items-center justify-center w-9 h-9 rounded-full border border-border group-hover:border-primary/50 transition-colors">
                      <ChevronDown className="w-4 h-4 text-primary" />
                    </motion.span>
                  </span>
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                      className="overflow-hidden"
                    >
                      <div className="grid grid-cols-12 gap-3 md:gap-6 pb-6 md:pb-8">
                        <span className="col-span-2 md:col-span-1" />
                        <div className="col-span-10 md:col-span-5">
                          <div className="relative overflow-hidden rounded-xl aspect-[4/3] shadow-lg">
                            <img src={it.img} alt="" className="w-full h-full object-cover" loading="lazy" />
                          </div>
                        </div>
                        <p className="col-span-10 md:col-span-5 font-body text-sm md:text-base text-muted-foreground leading-relaxed self-center">{it.body}</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}