import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CalendarDays, ShoppingBag, Gift } from 'lucide-react';
import SectionReveal from '@/components/ui/SectionReveal';
import { useLang } from '@/lib/LangContext';
import { useSiteImages } from '@/lib/SiteImageContext';
import HomeTitle from '@/components/home/HomeTitle';

export default function CTACards() {
  const { t } = useLang();
  const { siteImg } = useSiteImages();
  const cards = [
    {
      num: '01',
      title: t('btn_reserve'),
      desc: t('home_cta_reserve_desc'),
      path: '/reserve',
      icon: CalendarDays,
      image: 'https://images.squarespace-cdn.com/content/v1/68b84525485ccc7e15a25577/1756906798149-17KHS8RDD2FJIZI179ZQ/EF6D9D08-F3ED-41E2-9392-96AB73DEF2E6.jpeg',
    },
    {
      num: '02',
      title: t('nav_takeaway'),
      desc: t('home_cta_takeaway_desc'),
      path: '/takeaway',
      icon: ShoppingBag,
      image: 'https://images.squarespace-cdn.com/content/v1/68b84525485ccc7e15a25577/1756906798084-QF5DJWQ3TUKX4AZR1JXU/278560265_1007469039884087_903507914175074104_n.jpg',
    },
    {
      num: '03',
      title: t('nav_giftcards'),
      desc: t('home_cta_giftcard_desc'),
      path: '/gift-cards',
      icon: Gift,
      image: 'https://images.squarespace-cdn.com/content/v1/68b84525485ccc7e15a25577/1756906798104-DAH7YUC0MQMSXKX8D257/437846437_908368301301701_1295494183982636809_n.jpg',
    },
  ];

  return (
    <section id="acties" className="w-full py-14 md:py-20">
      <div className="w-full px-6 md:px-10 lg:px-16">
        <SectionReveal className="mb-12">
          <span className="font-body text-[10px] tracking-[0.35em] uppercase text-primary mb-3 block">{t('home_cta_label')}</span>
          <HomeTitle title={t('home_cta_title')} accent={t('home_cta_title_accent')} />
        </SectionReveal>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {cards.map((card, i) => {
            const Icon = card.icon;
            return (
              <SectionReveal key={card.num} delay={i * 0.1}>
                <Link to={card.path}
                  className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card/60 backdrop-blur-sm hover:border-primary/40 hover:shadow-xl hover:shadow-primary/5 transition-all duration-500 h-full">
                  <div className="relative h-32 overflow-hidden">
                    <img src={siteImg('cta.' + i)} alt={card.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      style={{ filter: 'saturate(0.85) brightness(0.9)' }} />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
                    <span className="absolute top-3 left-4 font-heading text-3xl font-bold text-white/25">{card.num}</span>
                    <div className="absolute top-3 right-3 w-9 h-9 rounded-xl bg-black/30 backdrop-blur-md border border-white/15 flex items-center justify-center group-hover:bg-primary group-hover:border-primary transition-all duration-300">
                      <Icon className="text-primary group-hover:text-primary-foreground transition-colors duration-300" style={{ width: '16px', height: '16px' }} />
                    </div>
                  </div>
                  <div className="p-6 flex flex-col flex-1">
                    <h3 className="font-heading text-xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors duration-300">
                      {card.title}
                    </h3>
                    <p className="font-body text-sm text-muted-foreground mb-6 flex-1 leading-relaxed">{card.desc}</p>
                    <span className="inline-flex items-center gap-1.5 font-body text-xs tracking-widest uppercase text-primary">
                      {t('btn_more')} <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform duration-300" />
                    </span>
                  </div>
                </Link>
              </SectionReveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}