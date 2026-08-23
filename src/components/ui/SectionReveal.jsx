import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';

export default function SectionReveal({ children, className = '', delay = 0, direction = 'up', hover = false, ...rest }) {
  const reduce = useReducedMotion();
  const variants = {
    up: { initial: { opacity: 0, y: 10 }, animate: { opacity: 1, y: 0 } },
    left: { initial: { opacity: 0, x: -14 }, animate: { opacity: 1, x: 0 } },
    right: { initial: { opacity: 0, x: 14 }, animate: { opacity: 1, x: 0 } },
    fade: { initial: { opacity: 0 }, animate: { opacity: 1 } },
  };

  const v = variants[direction] || variants.up;
  // Bij 'prefers-reduced-motion' start de inhoud direct zichtbaar — geen
  // opacity:0-blokken die tekst verbergen (F5).
  const initial = reduce ? v.animate : v.initial;

  return (
    <motion.div
      initial={initial}
      whileInView={v.animate}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.38, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
      whileHover={hover ? { scale: 1.02 } : undefined}
      style={{ transformOrigin: 'center' }}
      {...rest}
    >
      {children}
    </motion.div>
  );
}