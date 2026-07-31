import React from 'react';
import { ExternalLink } from 'lucide-react';
import { useLang } from '@/lib/LangContext';
import PanelHero from '@/components/PanelHero';
import PanelContent from '@/components/PanelContent';
import TwoOfferingsSection from '@/components/TwoOfferingsSection';
import OrderCtaSection from '@/components/OrderCtaSection';

const BOGEST_ONLINE_URL = 'https://www.bogest-online.be/';

export default function Takeaway() {
  const { t } = useLang();

  return (
    <div className="w-full min-h-screen">

      <PanelHero label={t('ta_panel_label')} title="Bogèst" titleAccent={t('ta_panel_accent')} subtitle={t('ta_panel_subtitle')} positionKey="takeaway.hero" />

      <PanelContent>
      {/* ── Twee aanbiedingen — Traiteur & Cadeaupakketten (visueel, geen knoppen) ─ */}
      <TwoOfferingsSection />

      {/* ── Bestel nu — referentiesysteem (1:1 /menu), teksten zweven links over de foto ─ */}
      <OrderCtaSection
        positionKey="takeaway.cta"
        eyebrow={t('ta_cta_eyebrow')}
        title={t('ta_cta_title')}
        titleAccent={t('ta_cta_accent')}
        desc={t('ta_cta_desc')}
        buttonLabel={t('ta_cta_btn')}
        href={BOGEST_ONLINE_URL}
        external
        icon={ExternalLink}
      />
      </PanelContent>

    </div>
  );
}