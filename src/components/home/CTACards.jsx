import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CalendarDays, ShoppingBag, Gift } from 'lucide-react';
import SectionReveal from '@/components/ui/SectionReveal';
import { useLang } from '@/lib/LangContext';

export default function CTACards() {
  const { t } = useLang();
  const cards = [
    {
      num: '01',
      title: t('btn_reserve'),
      desc: t('home_cta_reserve_desc'),
      path: '/reserve',
      icon: CalendarDays,
    },
    {
      num: '02',
      title: t('nav_takeaway'),
      desc: t('home_cta_takeaway_desc'),
      path: '/takeaway',
      icon: ShoppingBag,
    },
    {
      num: '03',
      title: t('nav_giftcards'),
      desc: t('home_cta_giftcard_desc'),
      path: '/gift-cards',
      icon: Gift,
    },
  ];

  return (
    <section id="acties" className="w-full py-14 md:py-20">
      <div className="w-full px-6 md:px-10 lg:px-16">
        <SectionReveal className="mb-12">
          <span className="font-body text-[10px] tracking-[0.35em] uppercase text-primary mb-3 block">{t('home_cta_label')}</span>
          <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold text-foreground">{t('home_cta_title')}</h2>
        </SectionReveal>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
             {cards.map((card, i) => {
                return (
                <SectionReveal key={card.num} delay={i * 0.1}>
               <Link to={card.path}
                 className="group flex flex-col p-7 rounded-2xl border border-border bg-card/60 backdrop-blur-sm hover:border-primary/40 hover:bg-card hover:shadow-xl hover:shadow-primary/5 transition-all duration-500 h-full">
                 <div className="flex items-start justify-between mb-7">
                   <span className="font-heading text-4xl font-bold text-primary/12">{card.num}</span>
                   <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center group-hover:bg-primary group-hover:border-primary transition-all duration-300">
                     <card.icon className="w-4.5 h-4.5 text-primary group-hover:text-primary-foreground transition-colors duration-300" style={{ width: '18px', height: '18px' }} />
                   </div>
                 </div>
                 <h3 className="font-heading text-xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors duration-300">
                   {card.title}
                 </h3>
                 <p className="font-body text-sm text-muted-foreground mb-6 flex-1 leading-relaxed">{card.desc}</p>
                 <span className="inline-flex items-center gap-1.5 font-body text-xs tracking-widest uppercase text-primary">
                    {t('btn_more')} <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform duration-300" />
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