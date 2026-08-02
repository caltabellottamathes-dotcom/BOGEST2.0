import React from 'react';
import { Gift } from 'lucide-react';
import { useLang } from '@/lib/LangContext';
import { useSiteImages } from '@/lib/SiteImageContext';

const IMG_DEFAULTS = {
  stays: 'https://images.squarespace-cdn.com/content/v1/68b84525485ccc7e15a25577/1756906792564-LXWK1DRHFSE5N4CODE8U/cadeaubon.jpeg',
  paper: 'https://images.squarespace-cdn.com/content/v1/68b84525485ccc7e15a25577/1b9991fd-fc43-405b-acb6-a86317aaf9f1/5757bb8f-abdc-43e6-9219-e4e103f1a2e0.jpeg',
  locations: 'https://images.squarespace-cdn.com/content/v1/68b84525485ccc7e15a25577/b7c2edca-9db5-43c2-b109-4cc33197dfbe/veranda+hasselt.jpeg',
};

/**
 * GiftCardsFeature — editorial hoofdpaneel voor de cadeaubon-pagina.
 * Een groot beeld met goud-hairline kader en de eerste highlight eroverheen,
*  daarnaast de drie benefits als gestileerde rijen met hairlines — dezelfde
 * visuele taal als de rest van de site.
 */
export default function GiftCardsFeature() {
  const { t } = useLang();
  const { siteImg } = useSiteImages();
  const mainImg = siteImg('giftcards.highlight.0') || IMG_DEFAULTS.stays;

  const benefits = [
    { title: t('gc_h2_title'), body: t('gc_h2_body') },
    { title: t('gc_h3_title'), body: t('gc_h3_body') },
    { title: t('gc_h1_title'), body: t('gc_h1_body') },
  ];

  return (
    <section className="w-full px-6 md:px-10 lg:px-16 py-16 md:py-24">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-stretch">
        {/* Groot beeld met goud-hairline kader + titel overlay */}
        <div
          className="lg:col-span-7 relative rounded-2xl overflow-hidden min-h-[20rem] md:min-h-[24rem]"
          style={{ border: '1px solid rgba(200,163,89,0.18)' }}
        >
          <img src={mainImg} data-bb-key="giftcards.highlight.0" data-bb-label="Cadeaubonnen — highlight 1" alt="" className="absolute inset-0 w-full h-full object-cover" loading="lazy" decoding="async" />
          <div className="absolute inset-0 pointer-events-none" style={{ background: 'linear-gradient(to top, rgba(26,24,20,0.86) 0%, rgba(26,24,20,0.05) 58%)' }} />
          <div className="absolute left-6 right-6 bottom-6 pointer-events-none">
            <div className="flex items-center gap-2 mb-3">
              <span className="h-px w-8 bg-primary" />
              <span className="font-body text-[10px] tracking-[0.3em] uppercase text-primary">{t('gc_panel_label')}</span>
            </div>
            <h2 className="font-heading text-2xl md:text-4xl font-bold text-white leading-tight max-w-md">
              {t('gc_h1_title')}<span className="text-primary">.</span>
            </h2>
          </div>
        </div>

        {/* Benefits — gestileerde rijen met hairlines */}
        <div className="lg:col-span-5 flex flex-col justify-center">
          {benefits.map((b, i) => (
            <div key={i} className="py-5 border-b border-border/50 last:border-0">
              <div className="flex items-baseline gap-3 mb-1.5">
                <span className="font-heading font-bold text-primary/40 text-lg leading-none">{String(i + 1).padStart(2, '0')}</span>
                <h3 className="font-heading text-lg md:text-xl font-semibold text-foreground">{b.title}</h3>
              </div>
              <p className="font-body text-sm text-muted-foreground leading-relaxed pl-7">{b.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}