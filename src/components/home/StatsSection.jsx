import React, { useState, useEffect, useRef } from 'react';
import { useInView } from 'framer-motion';
import { useLang } from '@/lib/LangContext';

function Counter({ value, suffix, inView }) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const step = value / 60;
    const timer = setInterval(() => {
      start += step;
      if (start >= value) { setCount(value); clearInterval(timer); }
      else setCount(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [inView, value]);
  return <>{count}{suffix}</>;
}

// "Redactionele lint" — desktop: one giant ghosted italic "10" bleeds off the
// left edge behind a four-stat hairline ribbon. Mobile: the same ghosted "10"
// anchors an oversized hero stat ("Jaar ervaring 10+"), with the remaining
// three stats as a tight hairline row beneath — scale contrast, not a flat grid.
export default function StatsSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-40px' });
  const { t } = useLang();

  const stats = [
    { value: 10, suffix: '+', label: t('stat_experience') },
    { value: 4, suffix: '', label: t('stat_locations') },
    { value: 38, suffix: '+', label: t('stat_main_dishes') },
    { value: 500, suffix: '+', label: t('stat_guests') },
  ];

  return (
    <section ref={ref} id="stats" className="w-full py-12 md:py-24 border-b border-border relative overflow-hidden">
      <div className="w-full px-6 md:px-10 lg:px-16 relative">

        {/* ── Mobile: hero stat with ghosted 10 + 3 small hairline stats ── */}
        <div className="md:hidden">
          <div className="relative mb-9">
            <span aria-hidden className="absolute font-heading italic font-bold leading-[0.7] text-primary select-none pointer-events-none"
              style={{ fontSize: 'clamp(8rem, 42vw, 14rem)', opacity: 0.12, left: '-0.05em', top: '-1.4rem', zIndex: 0 }}>
              10
            </span>
            <div className="relative z-10 pt-1">
              <p className="font-body text-[10px] tracking-[0.3em] uppercase text-foreground/70 mb-2">{stats[0].label}</p>
              <p className="font-heading text-6xl font-bold text-primary leading-[0.9]">
                <Counter value={stats[0].value} suffix={stats[0].suffix} inView={inView} />
              </p>
            </div>
          </div>
          <div className="grid grid-cols-3 divide-x divide-border/40">
            {stats.slice(1).map((s) => (
              <div key={s.label} className="px-3 first:pl-0 last:pr-0">
                <p className="font-body text-[9px] tracking-[0.22em] uppercase text-foreground/60 mb-1.5">{s.label}</p>
                <p className="font-heading text-2xl font-bold text-primary leading-none">
                  <Counter value={s.value} suffix={s.suffix} inView={inView} />
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* ── Desktop: ghosted 10 + four-stat hairline ribbon ── */}
        <div className="hidden md:grid md:grid-cols-4 gap-0 md:divide-x divide-border/50 relative">
          <span aria-hidden className="absolute font-heading italic font-bold leading-[0.72] text-primary select-none pointer-events-none"
            style={{ fontSize: 'clamp(9rem, 19vw, 15rem)', opacity: 0.12, left: '-0.04em', top: '-1.6rem', zIndex: 0 }}>
            10
          </span>
          {stats.map((s) => (
            <div key={s.label} className="relative z-10 md:pl-7 md:pr-5 md:py-1">
              <p className="font-body text-[10px] tracking-[0.3em] uppercase text-foreground/70 mb-3">{s.label}</p>
              <p className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold text-primary leading-none">
                <Counter value={s.value} suffix={s.suffix} inView={inView} />
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}