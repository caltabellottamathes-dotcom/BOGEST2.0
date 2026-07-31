import React from 'react';
import { motion } from 'framer-motion';
import { Package, ExternalLink, Wine, MapPin } from 'lucide-react';
import { useLang } from '@/lib/LangContext';

const BOGEST_ONLINE_URL = 'https://www.bogest-online.be/';

/**
 * GiftPackagesSection — volledig herontworpen editorial sectie voor de
 * cadeaupakketten op /takeaway. Omdat zowel Takeaway als Cadeaupakketten
 * naar dezelfde externe bestelwebsite (bogest-online.be) doorverwijzen,
 * staan ze bewust op dezelfde pagina. Deze sectie vertelt wat de
 * pakketten zijn en nodigt uit om te bestellen.
 */
export default function GiftPackagesSection() {
  const { t } = useLang();

  const points = [
    { icon: Wine, title: t('gp_h1_title'), body: t('gp_h1_body') },
    { icon: Package, title: t('gp_h2_title'), body: t('gp_h2_body') },
    { icon: MapPin, title: t('gp_h3_title'), body: t('gp_h3_body') },
  ];

  return (
    <section className="w-full px-6 md:px-10 lg:px-16 py-16 md:py-20 border-t border-border/40">
      <div className="max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="flex items-center gap-3 mb-5">
            <Package className="w-4 h-4 text-primary" />
            <span className="h-px w-8 bg-primary/40" />
            <span className="font-body text-[10px] tracking-[0.35em] uppercase text-primary">{t('ta_gift_title')}</span>
          </div>
          <h2 className="font-heading text-3xl md:text-5xl font-bold leading-[0.95] text-foreground max-w-2xl">
            {t('gp_panel_title')} <span className="italic text-primary">{t('gp_panel_accent')}</span><span className="text-primary">.</span>
          </h2>
          <p className="font-body text-sm md:text-base text-muted-foreground leading-relaxed mt-5 max-w-xl">{t('ta_gift_desc')}</p>
        </motion.div>

        <div className="mt-10 md:mt-12">
          {points.map((p, i) => {
            const Icon = p.icon;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.6, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
                className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-8 py-7 border-b border-border/40 last:border-0"
              >
                <div className="md:col-span-2">
                  <span className="font-heading font-bold text-primary/25 text-5xl md:text-6xl leading-none">{String(i + 1).padStart(2, '0')}</span>
                </div>
                <div className="md:col-span-8">
                  <div className="flex items-center gap-3 mb-2">
                    <Icon className="w-4 h-4 text-primary" />
                    <span className="h-px w-8 bg-primary/40" />
                  </div>
                  <h3 className="font-heading text-xl md:text-2xl font-bold text-foreground mb-2">{p.title}<span className="text-primary">.</span></h3>
                  <p className="font-body text-sm text-muted-foreground leading-relaxed max-w-md">{p.body}</p>
                </div>
              </motion.div>
            );
          })}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="mt-10"
        >
          <a
            href={BOGEST_ONLINE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-3 px-7 py-3.5 rounded-full border border-primary/40 text-primary font-body text-xs tracking-[0.25em] uppercase hover:bg-primary hover:text-primary-foreground transition-all duration-500"
          >
            {t('gp_cta_btn')}
            <ExternalLink className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
          </a>
        </motion.div>
      </div>
    </section>
  );
}