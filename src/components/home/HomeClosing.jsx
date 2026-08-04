import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useLang } from '@/lib/LangContext';
import { base44 } from '@/api/base44Client';
import CTACards from '@/components/home/CTACards';

// A curated good review used until the database returns one.
const FALLBACK_REVIEW = {
  text: 'De combinatie van de prachtige hoeve en het sublieme eten maakt Bogèst tot een bijzonder adres in Limburg. De huiswijn is een absolute topper!',
  name: 'Isabelle D.',
  location: 'Borgloon',
};

// The end frame of the website — a layered, art-directed closing.
//   · Background layer: one good review quote, set large and gold, sitting
//     SLIGHTLY BEHIND the last banner and card (the glass CTA + floating card
//     float over its middle), so it is visible in the end frame with very
//     little blank dark space above or underneath it.
//   · Foreground: the last banner and card (reserve / takeaway / gift card).
//   · Fast, direct links to the most important parts of the site.
export default function HomeClosing() {
  const { t } = useLang();
  const [review, setReview] = useState(FALLBACK_REVIEW);

  useEffect(() => {
    base44.entities.ZenchefReview.list('-date', 24)
      .then((rows) => {
        const list = (rows || []).filter((r) => r.text);
        const top = list.find((r) => r.rating >= 5) || list[0];
        if (top) {
          setReview({
            text: top.text,
            name: top.author_name || 'Gast',
            location: top.location ? top.location.charAt(0).toUpperCase() + top.location.slice(1) : '',
          });
        }
      })
      .catch(() => {});
  }, []);

  const links = [
    { label: t('nav_menu'), to: '/menu' },
    { label: t('nav_locations'), to: '/locations' },
    { label: t('btn_reserve'), to: '/reserve' },
    { label: t('nav_takeaway'), to: '/takeaway' },
    { label: t('nav_giftcards'), to: '/gift-cards' },
    { label: t('nav_groups'), to: '/groups' },
    { label: t('nav_contact'), to: '/contact' },
    { label: t('nav_about'), to: '/about' },
    { label: 'Instagram', to: '/about/instagram' },
  ];

  return (
    <section id="einde" className="relative w-full overflow-hidden" style={{ background: 'hsl(25 6% 5%)' }}>
      {/* Background — the good review quote, slightly behind the last banner
          and card. Fills the frame so there is little blank dark space above
          or underneath it; the glass banner + floating card float over its
          middle. */}
      <div aria-hidden className="absolute inset-0 z-0 flex items-center justify-center pointer-events-none px-6 md:px-10">
        <blockquote className="font-heading italic text-primary/45 leading-[1.14] text-2xl sm:text-3xl md:text-4xl lg:text-[3.4rem] max-w-4xl text-center line-clamp-4">
          <span className="text-primary/60">“</span>{review.text}<span className="text-primary/60">”</span>
        </blockquote>
      </div>

      {/* Foreground — the last banner and card, on top of the review */}
      <div className="relative z-10">
        <CTACards />
      </div>

      {/* Fast links / direct links to the most important parts */}
      <div className="relative z-10 px-6 md:px-10 lg:px-16 pb-12 md:pb-14 -mt-2">
        <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2.5 max-w-4xl mx-auto">
          {links.map((l, i) => (
            <Link key={l.to + i} to={l.to} className="group inline-flex items-center gap-2 font-body text-[11px] tracking-[0.18em] uppercase text-white/55 hover:text-primary transition-colors duration-300">
              <span className="h-px w-3 bg-primary/30 group-hover:w-5 group-hover:bg-primary transition-all duration-300" />
              {l.label}
            </Link>
          ))}
        </div>

        {/* The good review, made explicit — who said it */}
        <div className="flex items-center justify-center gap-3 mt-7">
          <span className="h-px w-8 bg-primary/40" />
          <p className="font-body text-[10px] tracking-[0.3em] uppercase text-white/45">
            {review.name}{review.location ? ` · ${review.location}` : ''}
          </p>
        </div>
      </div>
    </section>
  );
}