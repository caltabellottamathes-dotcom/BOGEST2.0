import React from 'react';
import { motion } from 'framer-motion';
import { Users } from 'lucide-react';
import { useLang } from '@/lib/LangContext';

/**
 * GroupsConceptSection — vervangt de eerdere vestigingenlijst (die te veel
 * op /locations leek). Focus op het uitleggen van het concept "Groepen" en
 * de groepsformule: een redactionele 2×2 met hairlines, geen locatiekaarten.
 */
export default function GroupsConceptSection() {
  const { t } = useLang();

  const pillars = [
    { num: '01', title: t('grp_p1_title'), desc: t('grp_p1_desc') },
    { num: '02', title: t('grp_p2_title'), desc: t('grp_p2_desc') },
    { num: '03', title: t('grp_p3_title'), desc: t('grp_p3_desc') },
    { num: '04', title: t('grp_p4_title'), desc: t('grp_p4_desc') },
  ];

  return (
    <section className="w-full px-6 md:px-10 lg:px-16 pt-10 md:pt-12 pb-16">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="flex items-center gap-3 mb-4">
          <Users className="w-4 h-4 text-primary" />
          <span className="h-px w-8 bg-primary/40" />
          <span className="font-body text-[10px] tracking-[0.35em] uppercase text-primary">{t('grp_concept_label')}</span>
        </div>
        <h2 className="font-heading text-3xl md:text-5xl font-bold leading-[0.95] text-foreground max-w-2xl">
          {t('grp_concept_title')} <span className="italic text-primary">{t('grp_concept_accent')}</span><span className="text-primary">.</span>
        </h2>
        <p className="font-body text-base md:text-lg text-muted-foreground leading-relaxed mt-5 max-w-xl">{t('grp_concept_lead')}</p>
      </motion.div>

      <div className="mt-10 md:mt-12 grid grid-cols-1 md:grid-cols-2 border-t border-border/40">
        {pillars.map((p, i) => (
          <motion.div
            key={p.num}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.6, delay: (i % 2) * 0.08, ease: [0.22, 1, 0.36, 1] }}
            className={`relative py-7 md:py-9 px-1 md:px-6 border-b border-border/40 ${i % 2 === 0 ? 'md:border-r md:border-border/40' : 'md:pl-10'}`}
          >
            <span className="font-heading font-bold text-primary/20 text-4xl md:text-5xl leading-none block mb-3">{p.num}</span>
            <h3 className="font-heading text-xl md:text-2xl font-bold text-foreground mb-2">{p.title}<span className="text-primary">.</span></h3>
            <p className="font-body text-sm text-muted-foreground leading-relaxed max-w-sm">{p.desc}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}