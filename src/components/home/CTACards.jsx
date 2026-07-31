import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, CalendarDays, ShoppingBag, Gift } from 'lucide-react';
import SectionReveal from '@/components/ui/SectionReveal';
import { useLang } from '@/lib/LangContext';
import HomeTitle from '@/components/home/HomeTitle';

// "Alles binnen handbereik" — one wide photo with a floating glass card
// (the reservation-section layering), the three options stacked underneath
// each other inside the card. No hints.
export default function CTACards() {
  const { t } = useLang();
  const cards = [
    { num: '01', title: t('btn_reserve'), desc: t('home_cta_reserve_desc'), path: '/reserve', icon: CalendarDays,
      image: 'https://images.squarespace-cdn.com/content/v1/68b84525485ccc7e15a25577/1756906798149-17KHS8RDD2FJIZI179ZQ/EF6D9D08-F3ED-41E2-9392-96AB73DEF2E6.jpeg' },
    { num: '02', title: t('nav_takeaway'), desc: t('home_cta_takeaway_desc'), path: '/takeaway', icon: ShoppingBag,
      image: 'https://images.squarespace-cdn.com/content/v1/68b84525485ccc7e15a25577/1756906798084-QF5DJWQ3TUKX4AZR1JXU/278560265_1007469039884087_903507914175074104_n.jpg' },
    { num: '03', title: t('nav_giftcards'), desc: t('home_cta_giftcard_desc'), path: '/gift-cards', icon: Gift,
      image: 'https://images.squarespace-cdn.com/content/v1/68b84525485ccc7e15a25577/1756906798104-DAH7YUC0MQMSXKX8D257/437846437_908368301301701_1295494183982636809_n.jpg' },
  ];

  return (
    <section id="acties" className="w-full py-14 md:py-20">
      <div className="w-full px-6 md:px-10 lg:px-16">
        <SectionReveal className="mb-10">
          <span className="font-body text-[10px] tracking-[0.35em] uppercase text-primary mb-3 block">{t('home_cta_label')}</span>
          <HomeTitle title={t('home_cta_title')} accent={t('home_cta_title_accent')} />
        </SectionReveal>

        <SectionReveal direction="up">
          <div className="relative">
            <div className="overflow-hidden rounded-2xl h-[300px] md:h-[380px]">
              <img src={cards[0].image} alt="" aria-hidden="true" className="w-full h-full object-cover" style={{ filter: 'saturate(0.88) brightness(0.9)' }} loading="lazy" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent pointer-events-none" />
            </div>

            {/* floating glass card — asymmetric right, options stacked underneath each other */}
            <div className="relative mx-4 -mt-20 md:absolute md:-top-10 md:right-10 lg:right-14 md:mx-0 md:max-w-sm rounded-2xl p-6"
              style={{ background: 'rgba(255,255,255,0.08)', backdropFilter: 'blur(40px) saturate(160%)', WebkitBackdropFilter: 'blur(40px) saturate(160%)', border: '1px solid rgba(255,255,255,0.16)', boxShadow: '0 24px 60px rgba(0,0,0,0.45)' }}>
              <div className="flex items-center gap-3 mb-5">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center"
                  style={{ background: 'rgba(231,205,112,0.14)', border: '1px solid rgba(231,205,112,0.35)' }}>
                  <CalendarDays className="w-4 h-4 text-primary" />
                </div>
                <span className="font-body text-[10px] tracking-[0.25em] uppercase text-white/70">Bogèst</span>
              </div>

              <div className="space-y-1">
                {cards.map((card) => {
                  const Icon = card.icon;
                  return (
                    <Link key={card.num} to={card.path} className="group/item flex items-center gap-4 -mx-2 px-2 py-3 rounded-xl hover:bg-white/[0.06] transition-colors duration-300">
                      <span className="w-10 h-10 rounded-xl flex items-center justify-center text-primary flex-shrink-0"
                        style={{ background: 'rgba(231,205,112,0.14)', border: '1px solid rgba(231,205,112,0.30)' }}>
                        <Icon style={{ width: 17, height: 17 }} />
                      </span>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-heading text-base font-bold text-white leading-tight">{card.title}</h3>
                        <p className="font-body text-xs text-white/60 leading-snug truncate">{card.desc}</p>
                      </div>
                      <ArrowUpRight className="w-4 h-4 text-white/40 group-hover/item:text-primary group-hover/item:translate-x-0.5 group-hover/item:-translate-y-0.5 transition-all duration-300 flex-shrink-0" />
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        </SectionReveal>
      </div>
    </section>
  );
}