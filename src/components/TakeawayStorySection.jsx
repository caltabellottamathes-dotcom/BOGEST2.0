import React from 'react';
import { ShoppingBag, MapPin, Clock, Info, ChefHat } from 'lucide-react';
import { useLang } from '@/lib/LangContext';
import PanelSwitcher from '@/components/PanelSwitcher';

const IMG = {
  classics: 'https://media.base44.com/images/public/6a062d5a5c4241c6b2404e25/8696324df_Make_this_photo_look_more_202605150157.jpg',
  location: 'https://images.squarespace-cdn.com/content/v1/68b84525485ccc7e15a25577/b7c2edca-9db5-43c2-b109-4cc33197dfbe/veranda+hasselt.jpeg',
  pickup: 'https://images.squarespace-cdn.com/content/v1/68b84525485ccc7e15a25577/1756906798052-P24QWA3M58JWMGOWHVBD/399841843_793829846088881_1062638734165438461_n.jpg',
  formula: 'https://images.squarespace-cdn.com/content/v1/68b84525485ccc7e15a25577/1756906799926-VML5QXWO8V6D1NYAO2ZA/909af4c2-7392-4bbc-af18-2ea890714ecd-1.jpg',
  chef: 'https://images.squarespace-cdn.com/content/v1/68b84525485ccc7e15a25577/1756906793880-RYMZN9OWYYUERUL16C6K/B4E94C22-3656-4874-A66B-CEA4D674F86D.jpeg',
};

// Intro title for the Traiteur panel — matches the Cadeaupakketten section
// (title + accent + lead rendered by PanelSwitcher).
const STORY_TITLE = {
  nl: { title: 'Onze keuken', accent: 'thuis', lead: 'Spare ribs, stoofvlees, bouletten — de échte Bogèst-klassiekers, vakkundig bereid en klaar om af te halen bij uw vestiging.' },
  fr: { title: 'Notre cuisine', accent: 'à la maison', lead: 'Spare ribs, carbonnade, boulettes — les vrais classiques de Bogèst, préparés avec soin et prêts à emporter.' },
  en: { title: 'Our kitchen', accent: 'at home', lead: 'Spare ribs, beef stew, boulettes — the real Bogèst classics, skillfully prepared and ready to pick up.' },
};

/**
 * TakeawayStorySection — gespiegelde PanelSwitcher (inhoud links, beeld
 * rechts), dezelfde visuele taal als Cadeaupakketten eronder. Inclusief een
 * intro-titel, net als de cadeaupakketten-sectie.
 */
export default function TakeawayStorySection() {
  const { t, lang } = useLang();
  const tr = STORY_TITLE[lang] || STORY_TITLE.nl;
  const items = [
    { icon: ShoppingBag, title: t('ta_h1_title'), body: t('ta_h1_body'), img: IMG.classics, bbKey: 'takeaway.story.0', bbLabel: 'Traiteur — klassiekers' },
    { icon: MapPin, title: t('ta_h2_title'), body: t('ta_h2_body'), img: IMG.location, bbKey: 'takeaway.story.1', bbLabel: 'Traiteur — locatie' },
    { icon: Clock, title: t('ta_h3_title'), body: t('ta_h3_body'), img: IMG.pickup, bbKey: 'takeaway.story.2', bbLabel: 'Traiteur — afhalen' },
    { icon: Info, title: t('ta_home_p2_title'), body: t('ta_home_p2'), img: IMG.formula, bbKey: 'takeaway.story.3', bbLabel: 'Traiteur — formule' },
    { icon: ChefHat, title: t('ta_home_p3_title'), body: t('ta_home_p3'), img: IMG.chef, bbKey: 'takeaway.story.4', bbLabel: 'Traiteur — chef' },
  ];
  return (
    <PanelSwitcher
      items={items}
      label={t('nav_takeaway')}
      icon={ShoppingBag}
      title={tr.title}
      titleAccent={tr.accent}
      lead={tr.lead}
      mirror
    />
  );
}