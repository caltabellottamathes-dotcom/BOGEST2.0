import React from 'react';
import { Link } from 'react-router-dom';
import { CalendarDays, ShoppingBag, Gift } from 'lucide-react';
import SectionReveal from '@/components/ui/SectionReveal';
import { useLang } from '@/lib/LangContext';
import HomeTitle from '@/components/home/HomeTitle';
import { HintLine } from '@/components/HostHint';
import { hostQuestion } from '@/lib/hostHint';

export default function CTACards() {
  const { t, lang } = useLang();
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {cards.map((card, i) => {
            const Icon = card.icon;
            return (
              <SectionReveal key={card.num} delay={i * 0.1} hover={false}>
                <Link to={card.path} className="group relative block overflow-hidden rounded-2xl border border-border aspect-[4/5]">
                  <img src={card.image} alt={card.title} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" style={{ filter: 'saturate(0.85) brightness(0.92)' }} loading="lazy" decoding="async" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent" />
                  <span className="absolute top-4 left-4 font-heading text-4xl font-bold text-white/20 leading-none">{card.num}</span>
                  <span className="absolute top-4 right-4 w-10 h-10 rounded-full bg-black/40 border border-white/15 flex items-center justify-center text-white" style={{ backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)' }}>
                    <Icon style={{ width: 17, height: 17 }} />
                  </span>
                  <div className="absolute inset-x-0 bottom-0 p-5">
                    <h3 className="font-heading text-xl font-bold text-white leading-tight mb-1.5">{card.title}</h3>
                    <p className="font-body text-sm text-white/70 leading-relaxed line-clamp-2">{card.desc}</p>
                    <div className="overflow-hidden max-h-0 group-hover:max-h-14 transition-all duration-500 ease-out">
                      <HintLine question={hostQuestion(lang, card.title)} className="mt-3" />
                    </div>
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