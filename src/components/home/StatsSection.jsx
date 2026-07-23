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

export default function StatsSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  const { t } = useLang();

  const stats = [
    { value: 4, suffix: '', label: t('stat_locations') },
    { value: 10, suffix: '+', label: t('stat_experience') },
    { value: 38, suffix: '+', label: t('stat_main_dishes') },
    { value: 500, suffix: '+', label: t('stat_guests') },
  ];

  return (
    <section ref={ref} className="w-full py-6 md:py-8 border-b border-border">
      <div className="w-full px-6 md:px-10 lg:px-16">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 24 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className="text-center"
            >
              <div className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold text-primary mb-2">
                <Counter value={stat.value} suffix={stat.suffix} inView={inView} />
              </div>
              <p className="font-body text-xs tracking-[0.2em] uppercase text-muted-foreground">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}