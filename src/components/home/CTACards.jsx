import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, CalendarDays, ShoppingBag, Gift } from 'lucide-react';
import SectionReveal from '@/components/ui/SectionReveal';
import { useLang } from '@/lib/LangContext';

// "Alles binnen handbereik" — one quiet banner carrying the title, and a
// floating glass card holding the three CTAs. Stripped of the ghost bull,
// eyebrow and banner description so the three actions lead without competing
// text. Each CTA keeps only its icon + title + arrow (the helper desc is gone).
export default function CTACards() {
  const { t } = useLang();
  const cards = [
    { title: t('btn_reserve'), path: '/reserve', icon: CalendarDays },
    { title: t('nav_takeaway'), path: '/takeaway', icon: ShoppingBag },
    { title: t('nav_giftcards'), path: '/gift-cards', icon: Gift },
  ];

  const title = t('home_cta_title');
  const accent = t('home_cta_title_accent');
  const idx = accent && title.includes(accent) ? title.indexOf(accent) : -1;
  const before = idx >= 0 ? title.slice(0, idx) : '';
  const after = idx >= 0 ? title.slice(idx + accent.length).replace(/\.$/, '') : '';

  return (
    <section id="acties" className="w-full px-6 md:px-10 lg:px-16 pt-14 pb-16">
      <SectionReveal direction="up">
        <div className="relative">
          {/* Quiet banner — title only, no bull, no eyebrow, no description */}
          <div
            className="relative overflow-hidden rounded-2xl h-[200px] md:h-[260px] border border-border/50"
            style={{ background: 'rgba(255,255,255,0.04)', backdropFilter: 'blur(20px) saturate(140%)', WebkitBackdropFilter: 'blur(20px) saturate(140%)' }}
          >
            <div className="absolute left-6 md:left-8 lg:left-12 bottom-5 md:bottom-8 max-w-xs md:max-w-[15rem] lg:max-w-sm z-10">
              <h2 className="font-heading text-xl md:text-2xl font-bold leading-tight text-foreground">
                {idx >= 0 ? (
                  <>{before}<span className="italic text-primary">{accent}</span>{after}<span className="text-primary">.</span></>
                ) : title}
              </h2>
            </div>
          </div>

          {/* Floating glass card with the three CTAs — the focal */}
          <div
            className="relative mx-4 -mt-12 md:absolute md:-bottom-8 md:right-10 lg:right-14 md:mx-0 md:max-w-sm rounded-2xl p-5 md:p-6"
            style={{ background: 'rgba(255,255,255,0.06)', backdropFilter: 'blur(24px) saturate(150%)', WebkitBackdropFilter: 'blur(24px) saturate(150%)', border: '1px solid rgba(255,255,255,0.14)', boxShadow: '0 24px 60px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.10)' }}
          >
            <div className="space-y-1">
              {cards.map((card, i) => {
                const Icon = card.icon;
                return (
                  <Link key={i} to={card.path} className="group/item flex items-center gap-4 -mx-2 px-2 py-3 rounded-xl hover:bg-white/[0.06] transition-colors duration-300">
                    <span className="w-10 h-10 rounded-xl flex items-center justify-center text-primary flex-shrink-0" style={{ background: 'rgba(200,163,89,0.14)', border: '1px solid rgba(200,163,89,0.30)' }}>
                      <Icon style={{ width: 17, height: 17 }} />
                    </span>
                    <h3 className="flex-1 font-heading text-base font-bold text-white leading-tight">{card.title}</h3>
                    <ArrowUpRight className="w-4 h-4 text-white/40 group-hover/item:text-primary group-hover/item:translate-x-0.5 group-hover/item:-translate-y-0.5 transition-all duration-300 flex-shrink-0" />
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </SectionReveal>
    </section>
  );
}