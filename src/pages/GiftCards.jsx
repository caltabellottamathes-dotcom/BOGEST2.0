import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Gift, Smile, Star, ArrowRight, Wallet } from 'lucide-react';
import { useLang } from '@/lib/LangContext';
import GiftCardBuyPanel from '@/components/reserve/GiftCardBuyPanel';
import GiftCardCheckPanel from '@/components/reserve/GiftCardCheckPanel';
import PanelHero from '@/components/PanelHero';
import PanelContent from '@/components/PanelContent';
import EditorialHighlights from '@/components/EditorialHighlights';

export default function GiftCards() {
  const { t } = useLang();
  const [buyOpen, setBuyOpen] = useState(false);
  const [checkOpen, setCheckOpen] = useState(false);

  const HIGHLIGHTS = [
    { icon: Gift, title: t('gc_h1_title'), body: t('gc_h1_body') },
    { icon: Smile, title: t('gc_h2_title'), body: t('gc_h2_body') },
    { icon: Star, title: t('gc_h3_title'), body: t('gc_h3_body') },
  ];

  useEffect(() => {
    if (buyOpen || checkOpen) {
      document.body.classList.add('modal-open');
    } else {
      document.body.classList.remove('modal-open');
    }
    return () => document.body.classList.remove('modal-open');
  }, [buyOpen, checkOpen]);

  return (
    <div className="w-full min-h-screen">

      <PanelHero label={t('gc_panel_label')} title={t('gc_panel_title')} titleAccent={t('gc_panel_accent')} subtitle={t('gc_panel_subtitle')} positionKey="giftcards.hero" />

      <PanelContent>
      {/* ── Highlights ───────────────────────────────────────── */}
      <section className="w-full px-6 md:px-16 lg:px-24 pt-10 md:pt-12 pb-16 md:pb-24">
        <EditorialHighlights items={HIGHLIGHTS} />
      </section>

      {/* ── Gift Card Shop — twee call-to-actions ───────────── */}
      <section className="w-full px-6 md:px-16 lg:px-24 pb-24 md:pb-32">
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-6xl mx-auto"
        >
          <div className="relative rounded-3xl border border-border/50 bg-card/65 backdrop-blur-md shadow-2xl">
            <div className="relative px-8 py-12 md:px-14 md:py-14 flex flex-col md:flex-row md:items-center md:justify-between gap-8">
              <div className="max-w-lg">
                <div className="flex items-center gap-3 mb-4">
                  <span className="h-px w-10 bg-primary" />
                  <span className="font-body text-[10px] tracking-[0.35em] uppercase text-primary">{t('gc_cta_eyebrow')}</span>
                </div>
                <h2 className="font-heading text-2xl md:text-3xl font-bold text-foreground leading-tight mb-3">
                  {t('gc_cta_title')} <span className="italic text-primary">{t('gc_cta_accent')}</span><span className="text-primary">.</span>
                </h2>
                <p className="font-body text-sm text-muted-foreground leading-relaxed max-w-sm">{t('gc_cta_desc')}</p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 flex-shrink-0">
                <button
                  onClick={() => setBuyOpen(true)}
                  className="group inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-primary text-primary-foreground font-body text-xs tracking-widest uppercase rounded-full hover:bg-primary/90 transition-all duration-500"
                >
                  <Gift className="w-4 h-4" />
                  {t('gc_cta_buy')}
                  <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                </button>
                <button
                  onClick={() => setCheckOpen(true)}
                  className="group inline-flex items-center justify-center gap-2 px-7 py-3.5 border border-primary/40 text-primary font-body text-xs tracking-widest uppercase rounded-full hover:bg-primary/10 transition-all duration-500"
                >
                  <Wallet className="w-4 h-4" />
                  {t('gc_cta_check')}
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </section>
      </PanelContent>

      {/* Overlay 1 — uitsluitend de ZenChef-cadeaubonwidget */}
      <GiftCardBuyPanel isOpen={buyOpen} onClose={() => setBuyOpen(false)} />
      {/* Overlay 2 — uitsluitend de saldo-controle */}
      <GiftCardCheckPanel isOpen={checkOpen} onClose={() => setCheckOpen(false)} />

    </div>
  );
}