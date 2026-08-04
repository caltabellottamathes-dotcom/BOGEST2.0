import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { useLang } from '@/lib/LangContext';
import { useSiteImages } from '@/lib/SiteImageContext';

const COPY = {
  nl: {
    eyebrow: 'Kwaliteitsvlees',
    heading: 'Belgisch Wit Blauw — ons trots.',
    body1: 'In Bogèst serveren we een uitgebreid assortiment aan kwaliteitsvlees, met als trots ons botermalse Belgische Wit Blauw runds. Elk stuk wordt zorgvuldig geselecteerd op kwaliteit, structuur en smaak.',
    body2: 'Naast ons rundvlees zijn ook onze spare ribben met koolsla, stoofvlees, vol-au-vent en giga rundsbrochette echte trekkers.',
    alt: 'Kwaliteitsvlees bij Bogèst',
  },
  fr: {
    eyebrow: 'Viande de qualité',
    heading: 'Blanc Bleu Belge — notre fierté.',
    body1: "Chez Bogèst, nous servons un large assortiment de viandes de qualité, avec pour fierté notre bœuf Blanc Bleu Belge fondant. Chaque pièce est soigneusement sélectionnée pour sa qualité, sa texture et sa saveur.",
    body2: "Outre notre bœuf, nos spare ribs avec coleslaw, carbonnade, vol-au-vent et nos grandes brochettes de bœuf sont de vrais incontournables.",
    alt: 'Viande de qualité chez Bogèst',
  },
  en: {
    eyebrow: 'Quality meat',
    heading: 'Belgian White Blue — our pride.',
    body1: 'At Bogèst we serve an extensive range of quality meat, our pride being our melt-in-the-mouth Belgian White Blue beef. Every cut is carefully selected for quality, texture and flavour.',
    body2: 'Besides our beef, our spare ribs with coleslaw, beef stew, vol-au-vent and giant beef brochettes are real favourites.',
    alt: 'Quality meat at Bogèst',
  },
};

export default function MeatSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const { t, lang } = useLang();
  const { siteImg } = useSiteImages();
  const c = COPY[lang] || COPY.nl;

  return (
    <section ref={ref} className="w-full py-24 md:py-32">
      <div className="w-full px-6 md:px-12 lg:px-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Text */}
          <motion.div
            initial={{ opacity: 0, x: -60 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="order-2 lg:order-1"
          >
            <span className="font-body text-xs tracking-[0.3em] uppercase text-primary mb-4 block">
              {c.eyebrow}
            </span>
            <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold text-foreground leading-tight mb-8">
              {c.heading.replace(/\.$/, '')}<span className="text-primary">.</span>
            </h2>
            <p className="font-body text-base md:text-lg text-muted-foreground leading-relaxed mb-6">
              {c.body1}
            </p>
            <p className="font-body text-base md:text-lg text-muted-foreground leading-relaxed mb-10">
              {c.body2}
            </p>
            <Link
              to="/menu"
              className="group inline-flex items-center gap-3 px-8 py-4 border border-primary text-primary font-body text-sm tracking-widest uppercase rounded-full hover:bg-primary hover:text-primary-foreground transition-all duration-500"
            >
              {t('btn_view_menu')}
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
            </Link>
          </motion.div>

          {/* Image */}
          <motion.div
            initial={{ opacity: 0, x: 60 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="order-1 lg:order-2"
          >
            <div className="relative overflow-hidden rounded-2xl aspect-[4/5]">
              <img
                src={siteImg('meat')}
                alt={c.alt}
                className="w-full h-full object-cover"
                style={{ filter: 'saturate(0.82) brightness(0.95)' }}
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}