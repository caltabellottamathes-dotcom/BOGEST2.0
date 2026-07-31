import React from 'react';
import { ShoppingBag, MapPin, Clock, Info, ChefHat } from 'lucide-react';
import { useLang } from '@/lib/LangContext';
import PanelSwitcher from '@/components/PanelSwitcher';

const IMG = {
  classics: 'https://images.squarespace-cdn.com/content/v1/68b84525485ccc7e15a25577/1756906793828-46U4HY2BWRCMXLZD9G2VW/313432687_792246775522672_788010508288086563_n.jpg',
  location: 'https://images.squarespace-cdn.com/content/v1/68b84525485ccc7e15a25577/b7c2edca-9db5-43c2-b109-4cc33197dfbe/veranda+hasselt.jpeg',
  pickup: 'https://images.squarespace-cdn.com/content/v1/68b84525485ccc7e15a25577/1756906798052-P24QWA3M58JWMGOWHVBD/399841843_793829846088881_1062638734165438461_n.jpg',
  formula: 'https://images.squarespace-cdn.com/content/v1/68b84525485ccc7e15a25577/1756906799926-VML5QXWO8V6D1NYAO2ZA/909af4c2-7392-4bbc-af18-2ea890714ecd-1.jpg',
  chef: 'https://images.squarespace-cdn.com/content/v1/68b84525485ccc7e15a25577/1756906793880-RYMZN9OWYYUERUL16C6K/B4E94C22-3656-4874-A66B-CEA4D674F86D.jpeg',
};

/**
 * TakeawayStorySection — gespiegelde PanelSwitcher (inhoud links, beeld
 * rechts), dezelfde visuele taal als Cadeaupakketten eronder. Geen h2: de
 * titel staat in de PanelHero.
 */
export default function TakeawayStorySection() {
  const { t } = useLang();
  const items = [
    { icon: ShoppingBag, title: t('ta_h1_title'), body: t('ta_h1_body'), img: IMG.classics },
    { icon: MapPin, title: t('ta_h2_title'), body: t('ta_h2_body'), img: IMG.location },
    { icon: Clock, title: t('ta_h3_title'), body: t('ta_h3_body'), img: IMG.pickup },
    { icon: Info, title: t('ta_home_p2_title'), body: t('ta_home_p2'), img: IMG.formula },
    { icon: ChefHat, title: t('ta_home_p3_title'), body: t('ta_home_p3'), img: IMG.chef },
  ];
  return (
    <PanelSwitcher
      items={items}
      label={t('nav_takeaway')}
      icon={ShoppingBag}
      mirror
    />
  );
}