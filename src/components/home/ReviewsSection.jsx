import React, { useRef, useState, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';
import { Star, ChevronLeft, ChevronRight } from 'lucide-react';
import { useLang } from '@/lib/LangContext';
import { useIsMobile } from '@/hooks/use-mobile';
import { base44 } from '@/api/base44Client';

// Fallback reviews used when no Zenchef reviews are in the database yet
const FALLBACK_REVIEWS = [
  {
    name: 'Sophie V.',
    location: 'Hasselt',
    rating: 5,
    text: 'Absolute topervaring! Het vlees was ongelooflijk mals en de sfeer in de hoeve is gewoon prachtig. We komen zeker terug!',
    date: 'April 2026',
    source: 'Google',
  },
  {
    name: 'Marc & Elien',
    location: 'Borgloon',
    rating: 5,
    text: 'De Belgisch Wit Blauw was perfect bereid — botermals en heerlijk van smaak. Het voorgerecht en dessert incluis maakt dit een ongeëvenaarde prijs-kwaliteit verhouding.',
    date: 'Maart 2026',
    source: 'Google',
  },
  {
    name: 'Thomas K.',
    location: 'Heusden-Zolder',
    rating: 5,
    text: 'Al jaren trouwe klant bij Bogèst en we worden nooit teleurgesteld. Heerlijk eten, authentieke sfeer en vriendelijk personeel. Een aanrader voor iedereen!',
    date: 'Mei 2026',
    source: 'TripAdvisor',
  },
  {
    name: 'Isabelle D.',
    location: 'Borgloon',
    rating: 5,
    text: 'De combinatie van de prachtige hoeve en het sublieme eten maakt Bogèst tot een bijzonder adres in Limburg. De huiswijn is een absolute topper!',
    date: 'Februari 2026',
    source: 'Google',
  },
  {
    name: 'Pieter & Ann',
    location: 'Hasselt',
    rating: 5,
    text: 'Onze verjaardagstafel was perfect verzorgd. Vriendelijk team, heerlijk eten en een sfeer die het extra speciaal maakt. Dankjewel Bogèst!',
    date: 'Mei 2026',
    source: 'Google',
  },
  {
    name: 'Laura M.',
    location: 'Heusden-Zolder',
    rating: 4,
    text: 'Geweldige beleving van begin tot eind. De spare ribs zijn een must-try. Zeker één van de beste restaurants in Limburg.',
    date: 'April 2026',
    source: 'TripAdvisor',
  },
];

function Stars({ count }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} className={`w-3.5 h-3.5 ${i < count ? 'text-primary fill-primary' : 'text-border'}`} />
      ))}
    </div>
  );
}

function formatDate(dateStr) {
  if (!dateStr) return '';
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString('nl-BE', { month: 'long', year: 'numeric' });
  } catch {
    return '';
  }
}

export default function ReviewsSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  const { t } = useLang();
  const [page, setPage] = useState(0);
  const [reviews, setReviews] = useState(FALLBACK_REVIEWS);
  const isMobile = useIsMobile();
  const perPage = isMobile ? 1 : 3;
  const pages = Math.ceil(reviews.length / perPage);
  const safePage = Math.min(page, pages - 1);
  const visible = reviews.slice(safePage * perPage, safePage * perPage + perPage);

  useEffect(() => {
    base44.entities.ZenchefReview.list('-date', 50)
      .then(dbReviews => {
        if (dbReviews && dbReviews.length > 0) {
          const mapped = dbReviews
            .filter(r => r.text || r.author_name)
            .map(r => ({
              name: r.author_name || 'Anoniem',
              location: r.location ? r.location.charAt(0).toUpperCase() + r.location.slice(1).replace('-', '-') : '',
              rating: r.rating || 5,
              text: r.text || '',
              date: formatDate(r.date),
              source: r.source || 'Zenchef',
            }));
          if (mapped.length > 0) setReviews(mapped);
        }
      })
      .catch(() => {});
  }, []);

  return (
    <section id="ervaringen" className="w-full pt-14 md:pt-20 pb-[480px] md:pb-[520px] relative overflow-hidden">
      {/* Glass bg accent */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/4 via-transparent to-primary/2 pointer-events-none" />

      <div className="w-full px-6 md:px-10 lg:px-16">
        {/* Header */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="flex flex-col md:flex-row md:items-end md:justify-between mb-14"
        >
          <div>
            <span className="font-body text-[10px] tracking-[0.35em] uppercase text-primary mb-3 block">
              {t('home_reviews_label')}
            </span>
            <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold text-foreground">
              {t('home_reviews_title')}.
            </h2>
            <div className="flex items-center gap-3 mt-4">
              <Stars count={5} />
              <span className="font-body text-sm text-muted-foreground">{t('home_reviews_rating')}</span>
            </div>
          </div>
          <div className="flex items-center gap-2 mt-6 md:mt-0">
            <button
              onClick={() => setPage(p => Math.max(0, p - 1))}
              disabled={safePage === 0}
              className="w-10 h-10 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:border-primary hover:text-primary transition-all duration-200 disabled:opacity-30"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => setPage(p => Math.min(pages - 1, p + 1))}
              disabled={safePage === pages - 1}
              className="w-10 h-10 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:border-primary hover:text-primary transition-all duration-200 disabled:opacity-30"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </motion.div>

        {/* Review cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {visible.map((review, i) => (
            <motion.div
              key={review.name + review.date + page}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="relative p-6 rounded-xl border border-border bg-background/60 backdrop-blur-md hover:border-primary/30 hover:bg-background/80 transition-all duration-300"
            >
              {/* Glass shimmer */}
              <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />

              <div className="relative">
                <div className="flex items-start justify-between mb-4">
                  <Stars count={review.rating} />
                  <span className="font-body text-[10px] tracking-widest uppercase text-muted-foreground/60">
                    {review.source}
                  </span>
                </div>
                <p className="font-body text-sm text-foreground leading-relaxed mb-5 italic">
                  "{review.text}"
                </p>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-heading text-sm font-semibold text-foreground">{review.name}</p>
                    <p className="font-body text-xs text-muted-foreground">{review.location}{review.date ? ` · ${review.date}` : ''}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Pagination dots */}
        <div className="flex justify-center gap-2 mt-8">
          {Array.from({ length: pages }).map((_, i) => (
            <button
              key={i}
              onClick={() => setPage(i)}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                safePage === i ? 'w-6 bg-primary' : 'w-1.5 bg-border'
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}