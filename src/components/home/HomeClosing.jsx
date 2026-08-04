import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useLang } from '@/lib/LangContext';
import CTACards from '@/components/home/CTACards';

// A curated good review used until the database returns one.
const FALLBACK_REVIEWS = {
  nl: {
    text: 'De combinatie van de prachtige hoeve en het sublieme eten maakt Bogèst tot een bijzonder adres in Limburg. De huiswijn is een absolute topper!',
    name: 'Isabelle D.',
    location: 'Borgloon',
  },
  fr: {
    text: "L'association de la magnifique ferme et de la cuisine sublime fait de Bogèst une adresse à part dans le Limbourg. Le vin de maison est un vrai must !",
    name: 'Isabelle D.',
    location: 'Borgloon',
  },
  en: {
    text: 'The combination of the stunning farmhouse and the sublime food makes Bogèst a special address in Limburg. The house wine is an absolute winner!',
    name: 'Isabelle D.',
    location: 'Borgloon',
  },
};

// The end frame — one good review set slightly behind the last banner and
// card, then generous empty space so the rising footer overlaps the CTA just
// a bit. Fast links live in the footer itself.
export default function HomeClosing() {
  const { lang } = useLang();
  const [review, setReview] = useState(FALLBACK_REVIEWS[lang] || FALLBACK_REVIEWS.nl);

  useEffect(() => {
    base44.entities.ZenchefReview.list('-date', 24)
      .then(async (rows) => {
        const list = (rows || []).filter((r) => r.text);
        const top = list.find((r) => r.rating >= 5) || list[0];
        if (!top) return;
        const base = {
          text: top.text,
          name: top.author_name || (lang === 'fr' ? 'Invité' : lang === 'en' ? 'Guest' : 'Gast'),
          location: top.location ? top.location.charAt(0).toUpperCase() + top.location.slice(1) : '',
        };
        if (lang === 'nl') { setReview(base); return; }
        try {
          const res = await base44.integrations.Core.InvokeLLM({
            prompt: `Translate this restaurant guest review into ${lang === 'fr' ? 'French' : 'English'}. Keep it warm, natural and first-person; preserve any names. Return ONLY JSON { "translation": "..." }.\nReview:\n${JSON.stringify(top.text)}`,
            response_json_schema: { type: 'object', properties: { translation: { type: 'string' } } },
          });
          setReview({ ...base, text: res?.translation || base.text });
        } catch {
          setReview(base);
        }
      })
      .catch(() => {});
  }, [lang]);

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

      {/* Brand sign-off — a quiet, refined end-of-home wordmark */}
      <div className="relative z-10 flex flex-col items-center gap-3.5 pt-16 md:pt-20 pb-10 md:pb-14 px-6 text-center">
        <div className="flex items-center gap-3">
          <span className="h-px w-8 bg-primary/40" />
          <span className="font-body text-[10px] tracking-[0.45em] uppercase text-primary">Bogèst</span>
          <span className="h-px w-8 bg-primary/40" />
        </div>
        <h2 className="font-heading font-medium text-white/90 uppercase tracking-[0.14em] flex items-center gap-3 md:gap-4 text-[clamp(1.05rem,2.4vw,1.5rem)]">
          <span>VUUR<span className="text-primary">.</span></span>
          <span>SMAAK<span className="text-primary">.</span></span>
          <span>GEZEL<span className="text-primary">.</span></span>
        </h2>
        <p className="font-heading italic text-white/45 text-xs md:text-sm tracking-wide">Een Beau Geste — vakmanschap in smaak</p>
      </div>

      {/* Empty space at the end — the footer rises and overlaps the banner + CTA a bit */}
      <div className="relative z-10" style={{ height: '6rem' }} aria-hidden />
    </section>
  );
}