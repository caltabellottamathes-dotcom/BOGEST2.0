import React from 'react';
import { ShoppingBag } from 'lucide-react';
import { useLang } from '@/lib/LangContext';
import PanelHero from '@/components/PanelHero';
import PanelContent from '@/components/PanelContent';
import TakeawayStorySection from '@/components/TakeawayStorySection';
import CadeaubonSection from '@/components/CadeaubonSection';
import OrderCtaSection from '@/components/OrderCtaSection';

const BOGEST_ONLINE_URL = 'https://www.bogest-online.be/';

export default function Takeaway() {
  const { t } = useLang();

  return (
    <div className="w-full min-h-screen">

      <PanelHero label={t('ta_panel_label')} title="Bogèst" titleAccent={t('ta_panel_accent')} subtitle={t('ta_panel_subtitle')} positionKey="takeaway.hero" />

      <PanelContent>
      {/* ── Traiteur-verhaal (interactief, geen kaarten) ─────────────── */}
      <TakeawayStorySection />

      {/* ── Cadeaubon ──────────────────────────────────────────────────── */}
      <CadeaubonSection />

      {/* ── Bestel nu — zwevende kaart 1:1 /menu, teksten zweven links ── */}
      <OrderCtaSection
        positionKey="takeaway.cta"
        eyebrow={t('ta_cta_eyebrow')}
        title={t('ta_cta_title')}
        titleAccent={t('ta_cta_accent')}
        desc={t('ta_cta_desc')}
        cardTitle={t('ta_cta_card_title')}
        cardSubtitle={t('ta_cta_card_subtitle')}
        buttonLabel={t('ta_cta_btn')}
        href={BOGEST_ONLINE_URL}
        icon={ShoppingBag}
      />
      </PanelContent>

    </div>
  );
}