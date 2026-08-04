import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import CTACards from '@/components/home/CTACards';

// A curated good review used until the database returns one.
const FALLBACK_REVIEW = {
  text: 'De combinatie van de prachtige hoeve en het sublieme eten maakt Bogèst tot een bijzonder adres in Limburg. De huiswijn is een absolute topper!',
  name: 'Isabelle D.',
  location: 'Borgloon',
};

// The end frame — one good review set slightly behind the last banner and
// card, then generous empty space so the rising footer overlaps the CTA just
// a bit. Fast links live in the footer itself.
export default function HomeClosing() {
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

  return (
    <section id="einde" className="relative w-full overflow-hidden" style={{ background: 'hsl(25 6% 5%)' }}>
      <div className="relative">
        {/* Background — one good review, slightly behind the last banner and card */}
        <div aria-hidden className="absolute inset-0 z-0 flex flex-col items-center justify-center gap-5 pointer-events-none px-6 md:px-10">
          <blockquote className="font-heading italic text-primary/45 leading-[1.14] text-2xl sm:text-3xl md:text-4xl lg:text-[3.4rem] max-w-4xl text-center line-clamp-4">
            <span className="text-primary/60">“</span>{review.text}<span className="text-primary/60">”</span>
          </blockquote>
          <p className="font-body text-[10px] tracking-[0.3em] uppercase text-white/40">
            {review.name}{review.location ? ` · ${review.location}` : ''}
          </p>
        </div>

        {/* Foreground — the last banner and card */}
        <div className="relative z-10">
          <CTACards />
        </div>
      </div>

      {/* Brand sign-off — the end-of-home wordmark + tagline */}
      <div className="relative z-10 flex flex-col items-center gap-4 py-12 md:py-16 px-6 text-center">
        <div className="flex items-center gap-3">
          <span className="h-px w-8 bg-primary/40" />
          <span className="font-body text-[10px] md:text-[11px] tracking-[0.5em] uppercase text-primary">Bogèst</span>
          <span className="h-px w-8 bg-primary/40" />
        </div>
        <h2 className="font-heading font-bold text-white leading-none tracking-[0.02em] flex flex-wrap items-baseline justify-center gap-x-3 md:gap-x-4 text-[clamp(1.5rem,4vw,2.5rem)]">
          <span>VUUR<span className="text-primary">.</span></span>
          <span>SMAAK<span className="text-primary">.</span></span>
          <span>GEZEL<span className="text-primary">.</span></span>
        </h2>
        <p className="font-heading italic text-white/50 text-xs md:text-sm tracking-wide max-w-xl">Een Beau Geste — vakmanschap in smaak</p>
      </div>

      {/* Empty space at the end — the footer rises and overlaps the banner + CTA a bit */}
      <div className="relative z-10" style={{ height: '3rem' }} aria-hidden />
    </section>
  );
}