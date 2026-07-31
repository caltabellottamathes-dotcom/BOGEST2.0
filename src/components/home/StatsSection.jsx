import React, { useState, useEffect, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
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

// "Redactionele lint" — one giant ghosted italic "10" bleeds off the left
// edge behind the first stat; the four stats form a hairline-separated
// ribbon to its right. Pure typography, no cards — asymmetric editorial.
export default function StatsSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  const { t } = useLang();

  const stats = [
    { value: 10, suffix: '+', label: t('stat_experience') },
    { value: 4, suffix: '', label: t('stat_locations') },
    { value: 38, suffix: '+', label: t('stat_main_dishes') },
    { value: 500, suffix: '+', label: t('stat_guests') },
  ];

  return (
    <section ref={ref} id="stats" className="w-full py-16 md:py-24 border-b border-border relative overflow-hidden">
      <div className="w-full px-6 md:px-10 lg:px-16">
        <div className="relative grid grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-10 md:gap-0 md:divide-x md:divide-border/50">
          {/* Giant ghosted "10" — bleeds off the left edge, behind the first column */}
          <span aria-hidden className="hidden md:block absolute font-heading italic font-bold leading-[0.72] text-primary select-none pointer-events-none"
            style={{ fontSize: 'clamp(9rem, 19vw, 15rem)', opacity: 0.12, left: '-0.04em', top: '-1.6rem', zIndex: 0 }}>
            10
          </span>

          {stats.map((s, i) => (
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