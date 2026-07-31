import React from 'react';
import { ShoppingBag, MapPin, Clock, ExternalLink } from 'lucide-react';
import { useLang } from '@/lib/LangContext';
import PanelHero from '@/components/PanelHero';
import PanelContent from '@/components/PanelContent';
import EditorialHighlights from '@/components/EditorialHighlights';
import GiftPackagesSection from '@/components/GiftPackagesSection';
import OrderCtaSection from '@/components/OrderCtaSection';

const BOGEST_ONLINE_URL = 'https://www.bogest-online.be/';

export default function Takeaway() {
  const { t } = useLang();

  const HIGHLIGHTS = [
    { icon: ShoppingBag, title: t('ta_h1_title'), body: t('ta_h1_body') },
    { icon: MapPin, title: t('ta_h2_title'), body: t('ta_h2_body') },
    { icon: Clock, title: t('ta_h3_title'), body: t('ta_h3_body') },
  ];

  return (
    <div className="w-full min-h-screen">

      <PanelHero label={t('ta_panel_label')} title="Bogèst" titleAccent={t('ta_panel_accent')} subtitle={t('ta_panel_subtitle')} positionKey="takeaway.hero" />

      <PanelContent>
      {/* ── Highlights ───────────────────────────────────────── */}
      <section className="w-full px-6 md:px-10 lg:px-16 pt-10 md:pt-12 pb-16 md:pb-20">
        <EditorialHighlights items={HIGHLIGHTS} />
      </section>

      {/* ── Cadeaupakketten ──────────────────────────────────── */}
      <GiftPackagesSection />

      {/* ── Bestel nu — referentiesysteem (asymmetrische zwevende glazen CTA-kaart) ─ */}
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