import React from 'react';
import { Gift, Smile, Star } from 'lucide-react';
import { useLang } from '@/lib/LangContext';
import { useSiteImages } from '@/lib/SiteImageContext';
import PanelSwitcher from '@/components/PanelSwitcher';

const IMG_DEFAULTS = {
  stays: 'https://images.squarespace-cdn.com/content/v1/68b84525485ccc7e15a25577/1756906792564-LXWK1DRHFSE5N4CODE8U/cadeaubon.jpeg',
  paper: 'https://images.squarespace-cdn.com/content/v1/68b84525485ccc7e15a25577/1b9991fd-fc43-405b-acb6-a86317aaf9f1/5757bb8f-abdc-43e6-9219-e4e103f1a2e0.jpeg',
  locations: 'https://images.squarespace-cdn.com/content/v1/68b84525485ccc7e15a25577/b7c2edca-9db5-43c2-b109-4cc33197dfbe/veranda+hasselt.jpeg',
};

/**
 * GiftCardsHighlights — gespiegelde PanelSwitcher (inhoud links, beeld
 * rechts), dezelfde visuele taal als de takeaway-secties. De drie
 * highlight-foto's zijn via de Beeldbank te vervangen
 * (giftcards.highlight.0/1/2) — standaard blijft ongewijzigd.
 */
export default function GiftCardsHighlights() {
  const { t } = useLang();
  const { siteImg } = useSiteImages();
  const items = [
    { icon: Gift, title: t('gc_h1_title'), body: t('gc_h1_body'), img: siteImg('giftcards.highlight.0') || IMG_DEFAULTS.stays },
    { icon: Smile, title: t('gc_h2_title'), body: t('gc_h2_body'), img: siteImg('giftcards.highlight.1') || IMG_DEFAULTS.paper },
    { icon: Star, title: t('gc_h3_title'), body: t('gc_h3_body'), img: siteImg('giftcards.highlight.2') || IMG_DEFAULTS.locations },
  ];
  return (
    <PanelSwitcher
      items={items}
      label={t('gc_panel_label')}
      title={t('gc_section_title')}
      titleAccent={t('gc_section_accent')}
      lead={t('gc_section_lead')}
      mirror
    />
  );
}