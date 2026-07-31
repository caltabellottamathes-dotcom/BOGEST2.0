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

// Asymmetric editorial band — one oversized italic gold numeral anchors the
// section, the rest read as a quieter tracked list beside it. Breaks the old
// 4-column "same weight everywhere" grid.
export default function StatsSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  const { t } = useLang();

  const heroStat = { value: 10, suffix: '+', label: t('stat_experience') };
  const others = [
    { value: 4, suffix: '', label: t('stat_locations') },
    { value: 38, suffix: '+', label: t('stat_main_dishes') },
    { value: 500, suffix: '+', label: t('stat_guests') },
  ];

  return (
    <section ref={ref} id="stats" className="w-full py-16 md:py-24 border-b border-border">
      <div className="w-full px-6 md:px-10 lg:px-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-end">
          {/* Hero stat — oversized italic gold, bleeds left */}
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-5"
          >
            <div className="flex items-center gap-3 mb-6">
              <span className="h-px w-10 bg-primary" />
              <span className="font-body text-[10px] tracking-[0.35em] uppercase text-primary">{heroStat.label}</span>
            </div>
            <div className="font-heading italic font-bold leading-[0.78] text-primary text-[28vw] sm:text-[22vw] lg:text-[12vw] select-none">
              <Counter value={heroStat.value} suffix={heroStat.suffix} inView={inView} />
            </div>
          </motion.div>

          {/* Supporting stats — quieter, set to the right of a hairline */}
          <div className="lg:col-span-7 lg:pl-12 lg:border-l lg:border-border">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
              {others.map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 24 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.6, delay: 0.15 + i * 0.1, ease: [0.22, 1, 0.36, 1] }}
                >
                  <div className="font-heading text-4xl md:text-5xl font-bold text-foreground leading-none">
                    <Counter value={stat.value} suffix={stat.suffix} inView={inView} />
                  </div>
                  <p className="font-body text-[10px] tracking-[0.25em] uppercase text-muted-foreground mt-3">{stat.label}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}