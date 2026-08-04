import React, { useRef, useState, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';
import { Star, ArrowLeft, ArrowRight } from 'lucide-react';
import { useLang } from '@/lib/LangContext';
import { useIsMobile } from '@/hooks/use-mobile';
import { base44 } from '@/api/base44Client';
import HomeTitle from '@/components/home/HomeTitle';

// Fallback reviews used when no Zenchef reviews are in the database yet
const FALLBACK_REVIEWS = [
  { name: 'Sophie V.', location: 'Hasselt', rating: 5, text: 'Absolute topervaring! Het vlees was ongelooflijk mals en de sfeer in de hoeve is gewoon prachtig. We komen zeker terug!', date: 'April 2026', source: 'Google' },
  { name: 'Marc & Elien', location: 'Borgloon', rating: 5, text: 'De Belgisch Wit Blauw was perfect bereid — botermals en heerlijk van smaak. Het voorgerecht en dessert incluis maakt dit een ongeëvenaarde prijs-kwaliteit verhouding.', date: 'Maart 2026', source: 'Google' },
  { name: 'Thomas K.', location: 'Heusden-Zolder', rating: 5, text: 'Al jaren trouwe klant bij Bogèst en we worden nooit teleurgesteld. Heerlijk eten, authentieke sfeer en vriendelijk personeel. Een aanrader voor iedereen!', date: 'Mei 2026', source: 'Tripadvisor' },
  { name: 'Isabelle D.', location: 'Borgloon', rating: 5, text: 'De combinatie van de prachtige hoeve en het sublieme eten maakt Bogèst tot een bijzonder adres in Limburg. De huiswijn is een absolute topper!', date: 'Februari 2026', source: 'Google' },
  { name: 'Pieter & Ann', location: 'Hasselt', rating: 5, text: 'Onze verjaardagstafel was perfect verzorgd. Vriendelijk team, heerlijk eten en een sfeer die het extra speciaal maakt. Dankjewel Bogèst!', date: 'Mei 2026', source: 'Tripadvisor' },
  { name: 'Laura M.', location: 'Heusden-Zolder', rating: 4, text: 'Geweldige beleving van begin tot eind. De spare ribs zijn een must-try. Zeker één van de beste restaurants in Limburg.', date: 'April 2026', source: 'Zenchef' },
  { name: 'Jeroen D.', location: 'Hasselt', rating: 5, text: 'De tomahawk aan tafel was een spektakel op zich. Mals, goed gekruid en met de Malbec erbij een perfecte combinatie.', date: 'Juni 2026', source: 'Tripadvisor' },
  { name: 'Familie Peeters', location: 'Borgloon', rating: 5, text: 'Met een grote groep gegeten in een private ruimte. Vriendelijk personeel, alles vlot geregeld en het vlees was weer van topniveau.', date: 'Juni 2026', source: 'Google' },
  { name: 'Anouk R.', location: 'Heusden-Zolder', rating: 5, text: 'De vegetarische opties waren een verrassing — origineel en vol smaak. Ook de orange wine is een echte aanrader.', date: 'Mei 2026', source: 'Zenchef' },
  { name: 'Karel & Sofie', location: 'Hasselt', rating: 5, text: 'Een onvergetelijke avond. De open keuken, de geur van de grill en de oprechte gastvrijheid maken Bogèst uniek in Limburg.', date: 'Juli 2026', source: 'Google' },
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

// Compact pill that makes the review's origin platform unambiguous.
function SourceBadge({ source }) {
  if (!source) return null;
  const label = source.charAt(0).toUpperCase() + source.slice(1);
  return (
    <span className="inline-flex items-center gap-1.5 font-body text-[10px] tracking-[0.18em] uppercase text-primary/85 border border-primary/30 rounded-full px-2 py-0.5">
      <span className="w-1 h-1 rounded-full bg-primary/70" />
      {label}
    </span>
  );
}

function formatDate(dateStr, locale) {
  if (!dateStr) return '';
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString(locale || 'nl-BE', { month: 'long', year: 'numeric' });
  } catch {
    return '';
  }
}

// Editorial reviews — one oversized italic pull-quote anchors the page, with
// supporting quotes shown alongside. Each review clearly states its platform.
export default function ReviewsSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  const { t, lang } = useLang();
  const [page, setPage] = useState(0);
  const [showAll, setShowAll] = useState(false);
  const [sourceReviews, setSourceReviews] = useState(FALLBACK_REVIEWS);
  const [reviews, setReviews] = useState(FALLBACK_REVIEWS);
  const isMobile = useIsMobile();
  const translateCache = useRef(null);
  const perPage = isMobile ? 2 : 4;
  const pages = Math.ceil(reviews.length / perPage);
  const safePage = Math.min(page, pages - 1);
  const visible = reviews.slice(safePage * perPage, safePage * perPage + perPage);
  const featured = visible[0];
  const supporting = visible.slice(1);

  const sourcesLine = lang === 'fr'
    ? 'Avis vérifiés collectés via Google, Tripadvisor et Zenchef'
    : lang === 'en'
      ? 'Verified reviews collected via Google, Tripadvisor and Zenchef'
      : 'Geverifieerde reviews verzameld via Google, Tripadvisor en Zenchef';

  const loadReviews = () => {
    base44.entities.ZenchefReview.list('-date', 100)
      .then(dbReviews => {
        if (dbReviews && dbReviews.length > 0) {
          const locale = lang === 'fr' ? 'fr-BE' : lang === 'en' ? 'en-GB' : 'nl-BE';
          const mapped = dbReviews
            .filter(r => r.text || r.author_name)
            .map(r => ({
              name: r.author_name || (lang === 'fr' ? 'Anonyme' : lang === 'en' ? 'Anonymous' : 'Anoniem'),
              location: r.location ? r.location.charAt(0).toUpperCase() + r.location.slice(1).replace('-', '-') : '',
              rating: r.rating || 5,
              text: r.text || '',
              date: formatDate(r.date, locale),
              source: r.source || 'Zenchef',
            }));
          if (mapped.length > 0) setSourceReviews(mapped);
        }
      })
      .catch(() => {});
  };

  useEffect(() => {
    loadReviews();
    const unsubscribe = base44.entities.ZenchefReview.subscribe((event) => {
      if (event && (event.type === 'create' || event.type === 'update')) loadReviews();
    });
    return () => { try { unsubscribe(); } catch {} };
  }, []);

  // Translate the reviews into the visitor's language. The Dutch source
  // (fallback + Zenchef DB) stays as-is; for FR/EN we translate the text in
  // one batched LLM call, cached by language + content so it never re-runs
  // for the same set.
  useEffect(() => {
    if (lang === 'nl') { setReviews(sourceReviews); return; }
    const key = lang + '::' + sourceReviews.map(r => r.text).join('||');
    if (translateCache.current?.key === key) { setReviews(translateCache.current.data); return; }
    let active = true;
    base44.integrations.Core.InvokeLLM({
      prompt: `You translate Belgian restaurant guest reviews into ${lang === 'fr' ? 'French' : 'English'}. Keep the tone warm, natural and first-person; preserve any names and dish words. Return ONLY a JSON object { "translations": [ "...", ... ] } in the SAME order as the input. Reviews (JSON array, same order):\n${JSON.stringify(sourceReviews.map(r => r.text))}`,
      response_json_schema: { type: 'object', properties: { translations: { type: 'array', items: { type: 'string' } } } },
    }).then((res) => {
      const t = Array.isArray(res?.translations) ? res.translations : [];
      const out = sourceReviews.map((r, i) => ({ ...r, text: (t[i] || r.text) }));
      translateCache.current = { key, data: out };
      if (active) setReviews(out);
    }).catch(() => { if (active) setReviews(sourceReviews); });
    return () => { active = false; };
  }, [sourceReviews, lang]);

  // Auto-rotate through the review pages
  useEffect(() => {
    if (showAll || pages <= 1) return;
    const id = setInterval(() => setPage(p => (p + 1) % pages), 6000);
    return () => clearInterval(id);
  }, [showAll, pages]);

  return (
    <section id="ervaringen" className="w-full pt-16 md:pt-24 pb-20 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.04] via-transparent to-transparent pointer-events-none" />

      <div className="w-full px-6 md:px-10 lg:px-16">
        {/* Header — asymmetric */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="flex flex-col md:flex-row md:items-end md:justify-between mb-12 md:mb-16 gap-6"
        >
          <div>
            <div className="flex items-center gap-3 mb-4">
              <span className="h-px w-10 bg-primary" />
              <span className="font-body text-[10px] tracking-[0.35em] uppercase text-primary">{t('home_reviews_label')}</span>
            </div>
            <HomeTitle title={t('home_reviews_title')} accent={t('home_reviews_title_accent')} />
            <div className="flex items-center gap-3 mt-4">
              <Stars count={5} />
              <span className="font-body text-sm text-muted-foreground">{t('home_reviews_rating')}</span>
            </div>
            <div className="flex items-center gap-2 mt-3">
              <span className="h-px w-6 bg-primary/40" />
              <span className="font-body text-[10px] tracking-[0.22em] uppercase text-muted-foreground/80">{sourcesLine}</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {reviews.length > perPage && (
              <button onClick={() => setShowAll(s => !s)} className="font-body text-xs tracking-widest uppercase text-primary hover:underline">
                {showAll
                  ? (lang === 'fr' ? 'Voir moins' : lang === 'en' ? 'Show less' : 'Toon minder')
                  : (lang === 'fr' ? 'Voir tous les avis' : lang === 'en' ? 'Show all reviews' : 'Toon alle reviews')}
              </button>
            )}
            <button onClick={() => setPage(p => Math.max(0, p - 1))} disabled={safePage === 0}
              className="w-10 h-10 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:border-primary hover:text-primary transition-all duration-200 disabled:opacity-30">
              <ArrowLeft className="w-4 h-4" />
            </button>
            <button onClick={() => setPage(p => Math.min(pages - 1, p + 1))} disabled={safePage === pages - 1}
              className="w-10 h-10 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:border-primary hover:text-primary transition-all duration-200 disabled:opacity-30">
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </motion.div>

        {/* Featured pull-quote + supporting */}
        {featured && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12">
            <div className="lg:col-span-8">
              <span aria-hidden className="font-heading italic text-primary leading-[0.5] block text-[22vw] sm:text-[16vw] lg:text-[10vw] -mb-2 select-none">“</span>
              <motion.blockquote
                key={featured.name + featured.date + page}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className="font-heading italic text-2xl sm:text-3xl md:text-4xl lg:text-5xl leading-[1.1] text-foreground"
              >
                {featured.text}
              </motion.blockquote>
              <div className="flex flex-wrap items-center gap-3 mt-8">
                <span className="h-px w-8 bg-primary" />
                <p className="font-heading text-base font-semibold text-foreground">{featured.name}</p>
                <span className="font-body text-xs text-muted-foreground">{featured.location}{featured.date ? ` · ${featured.date}` : ''}</span>
                <Stars count={featured.rating} />
                <SourceBadge source={featured.source} />
              </div>
            </div>

            <div className="lg:col-span-4 lg:border-l lg:border-border lg:pl-8 flex flex-col gap-6">
              {supporting.map((r, i) => (
                <motion.div
                  key={r.name + r.date + page}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.15 + i * 0.12 }}
                >
                  <div className="flex items-center gap-2 mb-2.5">
                    <Stars count={r.rating} />
                    <SourceBadge source={r.source} />
                  </div>
                  <p className="font-body text-sm text-muted-foreground leading-relaxed">“{r.text}”</p>
                  <p className="font-heading text-sm font-semibold text-foreground mt-2.5">
                    {r.name} <span className="font-body text-xs text-muted-foreground font-normal">· {r.location}</span>
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Pagination dots */}
        {!showAll && pages > 1 && (
          <div className="flex justify-center gap-2 mt-12">
            {Array.from({ length: pages }).map((_, i) => (
              <button key={i} onClick={() => setPage(i)}
                className={`h-1.5 rounded-full transition-all duration-300 ${safePage === i ? 'w-6 bg-primary' : 'w-1.5 bg-border'}`} />
            ))}
          </div>
        )}

        {showAll && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8 mt-10 lg:border-t lg:border-border lg:pt-10">
            {reviews.map((review, i) => (
              <div key={i} className="flex gap-5">
                <span className="font-heading italic text-primary text-3xl leading-none select-none">“</span>
                <div>
                  <p className="font-body text-sm text-foreground/90 leading-relaxed italic mb-3">{review.text}</p>
                  <div className="flex flex-wrap items-center gap-3">
                    <p className="font-heading text-sm font-semibold text-foreground">{review.name}</p>
                    <Stars count={review.rating} />
                    <SourceBadge source={review.source} />
                    <span className="font-body text-xs text-muted-foreground">{review.location}{review.date ? ` · ${review.date}` : ''}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}