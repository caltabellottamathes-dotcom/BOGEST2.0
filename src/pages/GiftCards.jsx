import React, { useState, useEffect } from 'react';
import { Gift, Smile, Star, ArrowRight, Wallet } from 'lucide-react';
import { useLang } from '@/lib/LangContext';
import GiftCardBuyPanel from '@/components/reserve/GiftCardBuyPanel';
import GiftCardCheckPanel from '@/components/reserve/GiftCardCheckPanel';
import PanelHero from '@/components/PanelHero';
import PanelContent from '@/components/PanelContent';
import EditorialHighlights from '@/components/EditorialHighlights';
import OrderCtaSection from '@/components/OrderCtaSection';

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
      <section className="w-full px-6 md:px-10 lg:px-16 pt-10 md:pt-12 pb-16 md:pb-20">
        <EditorialHighlights items={HIGHLIGHTS} />
      </section>

      {/* ── Bestel nu — referentiesysteem (asymmetrische zwevende glazen CTA-kaart) ─ */}
      <OrderCtaSection
        positionKey="giftcards.cta"
        eyebrow={t('gc_cta_eyebrow')}
        title={t('gc_cta_title')}
        titleAccent={t('gc_cta_accent')}
        desc={t('gc_cta_desc')}
        buttonLabel={t('gc_cta_buy')}
        onClick={() => setBuyOpen(true)}
        icon={Gift}
      />

      {/* ── Saldo controleren ────────────────────────────────── */}
      <div className="w-full px-6 md:px-10 lg:px-16 pb-20 flex justify-center md:justify-end">
        <button
          onClick={() => setCheckOpen(true)}
          className="group inline-flex items-center gap-2 font-body text-[11px] tracking-[0.3em] uppercase text-muted-foreground hover:text-primary transition-colors duration-300"
        >
          <Wallet className="w-3.5 h-3.5" />
          {t('gc_cta_check')}
          <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1" />
        </button>
      </div>
      </PanelContent>

      {/* Overlay 1 — uitsluitend de ZenChef-cadeaubonwidget */}
      <GiftCardBuyPanel isOpen={buyOpen} onClose={() => setBuyOpen(false)} />
      {/* Overlay 2 — uitsluitend de saldo-controle */}
      <GiftCardCheckPanel isOpen={checkOpen} onClose={() => setCheckOpen(false)} />

    </div>
  );
}