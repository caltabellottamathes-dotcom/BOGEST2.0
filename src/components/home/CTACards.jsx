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
                  className="group relative block rounded-3xl overflow-hidden min-h-[220px] flex flex-col justify-between p-6 transition-all duration-500 hover:-translate-y-1"
                  style={{
                    background: 'rgba(255,255,255,0.06)',
                    backdropFilter: 'blur(40px) saturate(160%)',
                    WebkitBackdropFilter: 'blur(40px) saturate(160%)',
                    border: '1px solid rgba(255,255,255,0.16)',
                    boxShadow: '0 12px 40px rgba(0,0,0,0.25)',
                  }}>
                  <img src={siteImg('cta.' + i)} alt="" aria-hidden="true"
                    className="absolute inset-0 w-full h-full object-cover opacity-25 group-hover:opacity-35 group-hover:scale-105 transition-all duration-700"
                    style={{ filter: 'saturate(0.8) brightness(0.65) blur(1px)' }}
                    loading="lazy" decoding="async" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/25 to-transparent pointer-events-none" />
                  <div className="relative z-10 flex items-start justify-between">
                    <div className="w-11 h-11 rounded-2xl flex items-center justify-center" style={{ background: 'rgba(231,205,112,0.18)', border: '1px solid rgba(231,205,112,0.35)' }}>
                      <Icon className="text-primary" style={{ width: 18, height: 18 }} />
                    </div>
                    <span className="font-heading text-4xl font-bold text-white/20">{card.num}</span>
                  </div>
                  <div className="relative z-10 mt-8">
                    <h3 className="font-heading text-xl font-bold text-white mb-2 group-hover:text-primary transition-colors duration-300">
                      {card.title}
                    </h3>
                    <p className="font-body text-sm text-white/70 mb-5 leading-relaxed">{card.desc}</p>
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