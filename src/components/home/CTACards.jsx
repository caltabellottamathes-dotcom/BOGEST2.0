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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10">
          {cards.map((card, i) => {
            const Icon = card.icon;
            return (
              <SectionReveal key={card.num} delay={i * 0.1} hover={false}>
                <Link to={card.path} className="group relative block rounded-2xl border border-border bg-card p-6 pt-12 transition-all duration-500 hover:-translate-y-1 hover:border-primary/40 hover:shadow-[0_18px_50px_rgba(0,0,0,0.18)]">
                  {/* icon medallion — overlaps the top edge */}
                  <span className="absolute -top-5 left-6 w-12 h-12 rounded-full bg-background border border-primary/30 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-primary-foreground group-hover:border-primary transition-all duration-500 shadow-sm">
                    <Icon style={{ width: 17, height: 17 }} />
                  </span>
                  {/* italic number watermark */}
                  <span className="absolute top-4 right-5 font-heading text-5xl font-bold text-primary/10 group-hover:text-primary/20 transition-colors duration-500 leading-none">{card.num}</span>
                  <span className="font-body text-[10px] tracking-[0.3em] uppercase text-primary/80 mb-2 block">Bogèst</span>
                  <h3 className="font-heading text-xl font-bold text-foreground group-hover:text-primary transition-colors duration-300">{card.title}</h3>
                  <div className="flex items-center gap-2 my-3.5">
                    <div className="h-px w-8 bg-primary/40 group-hover:w-12 transition-all duration-500" />
                    <div className="w-1 h-1 rounded-full bg-primary/50" />
                  </div>
                  <p className="font-body text-sm text-muted-foreground leading-relaxed">{card.desc}</p>
                  <span className="inline-flex items-center gap-1.5 mt-5 font-body text-[10px] tracking-[0.25em] uppercase text-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300">
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