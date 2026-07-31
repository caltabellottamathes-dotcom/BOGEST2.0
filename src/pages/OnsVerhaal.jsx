import React from 'react';
import PanelHero from '@/components/PanelHero';
import PanelContent from '@/components/PanelContent';
import SubPageNav from '@/components/SubPageNav';
import StoryChapter from '@/components/about/StoryChapter';
import ReserveCtaSection from '@/components/ReserveCtaSection';
import { useLang } from '@/lib/LangContext';
import { useSiteImages } from '@/lib/SiteImageContext';

export default function OnsVerhaal() {
  const { t } = useLang();
  const { siteImg } = useSiteImages();

  const story = [
    { num: '01', title: t('about_s1_title'), body: t('about_s1_text'), image: siteImg('onsverhaal.story.0') },
    { num: '02', title: t('about_s2_title'), body: t('about_s2_text'), image: siteImg('onsverhaal.story.1') },
    { num: '03', title: t('about_s3_title'), body: t('about_s3_text'), image: siteImg('onsverhaal.story.2') },
    { num: '04', title: t('about_s4_title'), body: t('about_s4_text'), image: siteImg('onsverhaal.story.3') },
  ];

  return (
    <div className="w-full">
      <PanelHero
        label={t('about_story_label')}
        title="Ons verhaal"
        titleAccent="Bogèst"
        subtitle="Het verhaal achter Bogèst — van Beau Geste tot een gulhartig steakhouse in Limburg."
        positionKey="onsverhaal.hero"
      />

      <PanelContent>
        <SubPageNav nextTo="/about/onze-filosofie" nextLabel="Onze filosofie" />

        {/* Story header */}
        <section className="w-full px-6 md:px-10 lg:px-16 pt-10 md:pt-12 pb-6">
          <div className="max-w-5xl mx-auto">
            <span className="font-body text-[10px] tracking-[0.35em] uppercase text-primary mb-3 block">{t('about_story_label')}</span>
            <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold text-foreground leading-tight">
              {t('about_story_title')}<span className="text-primary">.</span>
            </h2>
          </div>
        </section>

        {/* Hoofdstukken */}
        <section className="w-full pb-10">
          {story.map((s, i) => (
            <StoryChapter
              key={s.num}
              num={s.num}
              total="04"
              title={s.title}
              body={s.body}
              image={s.image}
              index={i}
            />
          ))}
        </section>

        {/* Reserve — zelfde vormgeving als /menu */}
        <ReserveCtaSection positionKey="onsverhaal.reserve" />
      </PanelContent>
    </div>
  );
}