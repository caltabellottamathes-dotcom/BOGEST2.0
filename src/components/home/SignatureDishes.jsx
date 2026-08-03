import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import SectionReveal from '@/components/ui/SectionReveal';
import { useLang } from '@/lib/LangContext';
import { useSiteImages } from '@/lib/SiteImageContext';
import HostHint from '@/components/HostHint';
import { hostQuestion, hostHintLabel } from '@/lib/hostHint';

const IMAGES = [
  'https://images.squarespace-cdn.com/content/v1/68b84525485ccc7e15a25577/1756906798020-1RKR6N8VGHSE1Z88BXP4/378389609_756558059816060_7208800625589654574_n.jpg',
  'https://images.squarespace-cdn.com/content/v1/68b84525485ccc7e15a25577/1756906799926-VML5QXWO8V6D1NYAO2ZA/909af4c2-7392-4bbc-af18-2ea890714ecd-1.jpg',
  'https://images.squarespace-cdn.com/content/v1/68b84525485ccc7e15a25577/32f05da0-47c0-41c3-8beb-befced66a749/5D626C0A-F4F5-4B45-895D-E1D622FB21E2.jpeg',
];

const DISHES = {
  nl: [
    { tag: 'Ons paradepaardje', name: 'Belgisch Wit Blauw', range: '€32.90 – €56' },
    { tag: 'Specialiteit', name: 'Spare Ribs', range: '€28.90' },
    { tag: 'Eigen label', name: 'Wijnselectie', range: '' },
  ],
  fr: [
    { tag: 'Notre fierté', name: 'Blanc Bleu Belge', range: '€32.90 – €56' },
    { tag: 'Spécialité', name: 'Spare Ribs', range: '€28.90' },
    { tag: 'Label maison', name: 'Sélection de vins', range: '' },
  ],
  en: [
    { tag: 'Our pride', name: 'Belgian White Blue', range: '€32.90 – €56' },
    { tag: 'Speciality', name: 'Spare Ribs', range: '€28.90' },
    { tag: 'House label', name: 'Wine selection', range: '' },
  ],
};

const HEADING = { nl: 'Onze keuken.', fr: 'Notre cuisine.', en: 'Our kitchen.' };

export default function SignatureDishes() {
  const { t, lang } = useLang();
  const { siteImg } = useSiteImages();
  const dishes = DISHES[lang] || DISHES.nl;
  return (
    <section className="w-full py-24 md:py-32 bg-card">
      <div className="w-full px-6 md:px-10 lg:px-16">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-14">
          <SectionReveal>
            <span className="font-body text-[10px] tracking-[0.35em] uppercase text-primary mb-3 block">
              {t('section_signature')}
            </span>
            <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold text-foreground">
              {HEADING[lang] || HEADING.nl}
            </h2>
          </SectionReveal>
          <Link to="/menu"
            className="group mt-6 md:mt-0 inline-flex items-center gap-2 font-body text-xs tracking-widest uppercase text-primary hover:text-foreground transition-colors duration-300">
            {t('btn_view_menu')}
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform duration-300" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {dishes.map((dish, i) => (
            <SectionReveal key={dish.name} delay={i * 0.12}>
              <Link to="/menu" className="group relative block">
                <div className="relative overflow-hidden rounded-xl aspect-[3/4] mb-5">
                  <img src={siteImg('signature.' + i) || IMAGES[i]} alt={dish.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    style={{ filter: 'saturate(0.82) brightness(0.95)' }} loading="lazy" decoding="async" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                  <span className="absolute top-4 left-4 inline-block px-3 py-1 bg-black/25 backdrop-blur-sm text-white font-body text-[10px] tracking-[0.2em] uppercase rounded-full border border-white/10">
                    {dish.tag}
                  </span>
                </div>
                <HostHint variant="seal" question={hostQuestion(lang, dish.name)} className="absolute top-3 right-3 z-20" />
                <h3 className="font-heading text-xl font-semibold text-foreground group-hover:text-primary transition-colors duration-300">
                  {dish.name}
                </h3>
                {dish.range && <p className="font-body text-sm text-muted-foreground mt-1">{dish.range}</p>}
              </Link>
            </SectionReveal>
          ))}
        </div>
      </div>
    </section>
  );
}