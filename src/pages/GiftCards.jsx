import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Gift, Smile, Star, ArrowRight } from 'lucide-react';
import { useTheme } from '@/lib/ThemeContext';
import { useLang } from '@/lib/LangContext';
import GiftCardPanel from '@/components/reserve/GiftCardPanel';
import PanelHero from '@/components/PanelHero';

export default function GiftCards() {
  const { theme } = useTheme();
  const { t } = useLang();
  const isDark = theme === 'dark';
  const [panelOpen, setPanelOpen] = useState(false);

  const HIGHLIGHTS = [
    { icon: Gift, title: t('gc_h1_title'), body: t('gc_h1_body') },
    { icon: Smile, title: t('gc_h2_title'), body: t('gc_h2_body') },
    { icon: Star, title: t('gc_h3_title'), body: t('gc_h3_body') },
  ];

  useEffect(() => {
    if (panelOpen) {
      document.body.classList.add('modal-open');
    } else {
      document.body.classList.remove('modal-open');
    }
    return () => document.body.classList.remove('modal-open');
  }, [panelOpen]);

  return (
    <div className="w-full min-h-screen">

      <PanelHero label={t('gc_panel_label')} title={t('gc_panel_title')} titleAccent={t('gc_panel_accent')} subtitle={t('gc_panel_subtitle')} positionKey="giftcards.hero" />

      {/* ── Highlights ───────────────────────────────────────── */}
      <section className="w-full px-6 md:px-16 lg:px-24 py-16 md:py-24">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 max-w-5xl">
          {HIGHLIGHTS.map(({ icon: Icon, title, body }, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="w-10 h-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center mb-5">
                <Icon className="w-4 h-4 text-primary" />
              </div>
              <h3 className="font-heading text-xl font-semibold text-foreground mb-3">{title}</h3>
              <p className="font-body text-sm text-muted-foreground leading-relaxed">{body}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── Gift Card Shop ───────────────────────────────────── */}
      <section className="w-full px-6 md:px-16 lg:px-24 pb-24 md:pb-32">
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-6xl mx-auto"
        >
          <div className="relative overflow-hidden rounded-2xl"
            style={{
              background: isDark
                ? 'linear-gradient(135deg, rgba(40,28,0,0.95) 0%, rgba(20,14,0,0.98) 100%)'
                : 'linear-gradient(135deg, rgba(200,210,160,0.60) 0%, rgba(107,122,63,0.20) 100%)',
              border: isDark ? '1px solid rgba(231,205,112,0.18)' : '1px solid rgba(74,83,32,0.28)',
            }}
          >
            {/* Decorative gold orb */}
            <div
              className="absolute -top-24 -right-24 w-80 h-80 rounded-full pointer-events-none"
              style={{ background: isDark ? 'radial-gradient(circle, rgba(231,205,112,0.15) 0%, transparent 70%)' : 'radial-gradient(circle, rgba(107,122,63,0.15) 0%, transparent 70%)' }}
            />

            <div className="relative px-8 py-12 md:px-16 md:py-16 flex flex-col md:flex-row md:items-center md:justify-between gap-8">
              <div className="max-w-lg">
                <p className="font-body text-[10px] tracking-[0.4em] uppercase text-primary mb-4">
                  {t('gc_cta_eyebrow')}
                </p>
                <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground leading-tight mb-4">
                  {t('gc_cta_title')}<br className="hidden md:block" />{' '}
                  <span className="italic text-primary">{t('gc_cta_accent')}</span>.
                </h2>
                <p className="font-body text-sm text-muted-foreground leading-relaxed max-w-sm">
                  {t('gc_cta_desc')}
                </p>
              </div>

              <button
                onClick={() => setPanelOpen(true)}
                className="group flex-shrink-0 inline-flex items-center gap-3 px-8 py-4 rounded-full font-body text-sm tracking-widest uppercase transition-all duration-500 hover:gap-5"
                style={{
                  background: 'hsl(var(--primary))',
                  color: 'hsl(var(--primary-foreground))',
                }}
              >
                {t('gc_cta_btn')}
                <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
              </button>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Slide-out gift card panel */}
      <GiftCardPanel isOpen={panelOpen} onClose={() => setPanelOpen(false)} />

    </div>
  );
}