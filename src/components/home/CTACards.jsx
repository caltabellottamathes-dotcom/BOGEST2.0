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
        <div className="border-y border-border divide-y divide-border">
          {cards.map((card, i) => {
            const Icon = card.icon;
            return (
              <SectionReveal key={card.num} delay={i * 0.08} hover={false}>
                <Link to={card.path} className="group flex items-center gap-5 md:gap-8 py-6 md:py-7 transition-colors duration-300">
                  <span className="font-heading text-2xl md:text-3xl font-bold text-primary/40 group-hover:text-primary transition-colors duration-300 w-10 flex-shrink-0">{card.num}</span>
                  <span className="w-10 h-10 md:w-11 md:h-11 rounded-full flex items-center justify-center flex-shrink-0 border border-primary/30 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
                    <Icon style={{ width: 16, height: 16 }} />
                  </span>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-heading text-lg md:text-xl font-bold text-foreground group-hover:text-primary transition-colors duration-300">{card.title}</h3>
                    <p className="font-body text-sm text-muted-foreground mt-0.5 truncate">{card.desc}</p>
                  </div>
                  <span className="hidden sm:inline-flex items-center gap-1.5 font-body text-[10px] tracking-[0.25em] uppercase text-muted-foreground group-hover:text-primary transition-colors duration-300">
                    {t('btn_more')} <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform duration-300" />
                  </span>
                </Link>
              </SectionReveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}