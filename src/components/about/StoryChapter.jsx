import React from 'react';
import SectionReveal from '@/components/ui/SectionReveal';

/**
 * Gedeeld storytelling-component voor de About-subpagina's (Ons Verhaal,
 * Onze Filosofie). Alternërend beeld/tekst, compakte line-spacing, ghost-numeral,
 * goud-hoekaccenten en een zwevende revelatie. Eén ontwerp, overal gelijk.
 */
export default function StoryChapter({ num, total, title, subtitle, body, image, index, bbKey }) {
  const flip = index % 2 === 1;
  return (
    <div className="w-full px-6 md:px-10 lg:px-16 py-10 md:py-14 border-t border-border/40">
      <SectionReveal>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center max-w-5xl mx-auto">
          {/* Beeld */}
          <div className={`relative ${flip ? 'lg:order-2' : ''}`}>
            <div className="relative overflow-hidden rounded-2xl aspect-[4/3] border border-border/40 shadow-2xl group">
              <img
                src={image}
                data-bb-key={bbKey}
                data-bb-label={`Ons verhaal — ${num}`}
                alt={title}
                className="w-full h-full object-cover transition-transform duration-[1200ms] group-hover:scale-105"
                style={{ filter: 'saturate(0.85) brightness(0.94)' }}
                loading="lazy"
              />
              <div className="absolute top-3 left-3 w-10 h-10 border-t border-l border-primary/40 rounded-tl-lg" />
              <div className="absolute bottom-3 right-3 w-10 h-10 border-b border-r border-primary/40 rounded-br-lg" />
            </div>
            <span
              aria-hidden
              className="absolute -top-6 left-2 font-heading text-7xl md:text-8xl font-bold text-primary/12 leading-none select-none pointer-events-none"
            >
              {num}
            </span>
          </div>

          {/* Tekst */}
          <div className={`relative ${flip ? 'lg:order-1' : ''}`}>
            <div className="flex items-center gap-3 mb-3">
              <span className="h-px w-10 bg-primary" />
              <span className="font-body text-[10px] tracking-[0.35em] uppercase text-primary">{num} / {total}</span>
            </div>
            {subtitle && (
              <div className="flex items-center gap-3 mb-2">
                <span className="h-px w-6 bg-primary/40" />
                <span className="font-body text-[11px] tracking-[0.3em] uppercase text-muted-foreground">{subtitle}</span>
              </div>
            )}
            <h3 className="font-heading text-2xl md:text-3xl font-bold text-foreground leading-tight mb-3">
              {title}<span className="text-primary">.</span>
            </h3>
            <p className="font-body text-base text-muted-foreground leading-snug">{body}</p>
          </div>
        </div>
      </SectionReveal>
    </div>
  );
}