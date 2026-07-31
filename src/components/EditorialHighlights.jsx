import React from 'react';
import { motion } from 'framer-motion';

// Editorial highlights — a vertical numbered list with oversized ghosted
// numerals and hairline separators, replacing the templated 3-card grid.
// Used by Takeaway and GiftCards.
export default function EditorialHighlights({ items }) {
  return (
    <div className="max-w-5xl">
      {items.map((it, i) => {
        const Icon = it.icon;
        return (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.7, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-8 py-8 border-b border-border/40 last:border-0"
          >
            <div className="md:col-span-2">
              <span className="font-heading font-bold text-primary/25 text-5xl md:text-6xl leading-none">
                {String(i + 1).padStart(2, '0')}
              </span>
            </div>
            <div className="md:col-span-8">
              <div className="flex items-center gap-3 mb-3">
                {Icon && <Icon className="w-4 h-4 text-primary" />}
                <span className="h-px w-8 bg-primary/40" />
              </div>
              <h3 className="font-heading text-2xl md:text-3xl font-bold text-foreground mb-2 leading-tight">
                {it.title}<span className="text-primary">.</span>
              </h3>
              <p className="font-body text-sm text-muted-foreground leading-relaxed max-w-md">{it.body}</p>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}