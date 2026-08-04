import React from 'react';
import SectionReveal from '@/components/ui/SectionReveal';

// The homepage sign-off — the Bogèst tagline as the final word before the
// closing CTA and footer.
export default function HomeEndTagline() {
  return (
    <section className="relative w-full py-20 md:py-28 overflow-hidden" style={{ background: 'hsl(25 6% 5%)' }}>
      <div className="relative w-full px-6 md:px-10 lg:px-16 text-center">
        <SectionReveal direction="up">
          <span className="font-body text-[10px] tracking-[0.4em] uppercase text-primary/80 mb-6 block">Bogèst</span>
          <h2 className="font-heading font-bold text-foreground leading-[1.05] tracking-tight text-4xl sm:text-5xl md:text-6xl lg:text-7xl">
            VUUR. SMAAK. GEZEL.
          </h2>
          <p className="font-heading italic text-primary mt-6 text-lg md:text-xl">
            Een Beau Geste — vakmanschap in smaak
          </p>
        </SectionReveal>
      </div>
    </section>
  );
}