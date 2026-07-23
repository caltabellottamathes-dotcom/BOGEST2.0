import React, { useEffect } from 'react';
import HeroSection from '@/components/home/HeroSection';
import StatsSection from '@/components/home/StatsSection';
import StorySection from '@/components/home/StorySection';
import PhilosophySection from '@/components/home/PhilosophySection';
import SeasonalSection from '@/components/home/SeasonalSection';
import CTACards from '@/components/home/CTACards';
import LocationsPreview from '@/components/home/LocationsPreview';
import ReviewsSection from '@/components/home/ReviewsSection';

// Full palette override:
// STONE    #e8e7e5 → HSL(40,  8%, 90%)  — background
// SAGE     #b8b7a8 → HSL(50,  8%, 69%)  — muted / secondary
// OLIVE    #524823 → HSL(43, 40%, 23%)  — secondary accent
// BURGUNDY #461324 → HSL(344, 58%, 18%) — primary
// POWDER BLUE #9eadbf → HSL(212, 22%, 68%) — chart / highlight
// DARK    #1c1c1c → HSL(0, 0%, 11%)    — foreground
const BURGUNDY_STYLES = `
  .burgundy-theme {
    /* Primary — Burgundy */
    --primary: 344 58% 18%;
    --primary-foreground: 40 8% 93%;
    --ring: 344 58% 18%;

    /* Background — Stone */
    --background: 40 8% 91%;
    --foreground: 0 0% 11%;

    /* Card — slightly lighter Stone */
    --card: 40 10% 94%;
    --card-foreground: 0 0% 11%;
    --popover: 40 10% 94%;
    --popover-foreground: 0 0% 11%;

    /* Secondary — Olive */
    --secondary: 43 40% 23%;
    --secondary-foreground: 40 8% 93%;

    /* Muted — Sage */
    --muted: 50 8% 80%;
    --muted-foreground: 50 6% 40%;

    /* Accent — Powder Blue */
    --accent: 212 22% 58%;
    --accent-foreground: 0 0% 11%;

    /* Border / Input — Sage-toned */
    --border: 50 8% 76%;
    --input: 50 8% 76%;

    /* Charts */
    --chart-1: 344 58% 18%;
    --chart-2: 43 40% 23%;
    --chart-3: 212 22% 68%;
    --chart-4: 50 8% 69%;
    --chart-5: 0 0% 11%;

    /* Destructive */
    --destructive: 0 72% 51%;
    --destructive-foreground: 0 0% 98%;
  }
  .burgundy-theme.dark {
    /* Primary — Dusty Pink #c8a49f → HSL(7, 28%, 70%) */
    --primary: 7 28% 70%;
    --primary-foreground: 0 0% 10%;
    --ring: 7 28% 70%;

    --background: 0 0% 8%;
    --foreground: 40 8% 88%;

    --card: 0 0% 11%;
    --card-foreground: 40 8% 88%;
    --popover: 0 0% 11%;
    --popover-foreground: 40 8% 88%;

    --secondary: 43 35% 18%;
    --secondary-foreground: 40 8% 88%;

    --muted: 0 0% 14%;
    --muted-foreground: 50 5% 50%;

    --accent: 212 22% 45%;
    --accent-foreground: 40 8% 93%;

    --border: 0 0% 18%;
    --input: 0 0% 18%;

    --chart-1: 7 28% 70%;
    --chart-2: 43 35% 30%;
    --chart-3: 212 22% 50%;
    --chart-4: 50 8% 55%;
    --chart-5: 40 8% 88%;
  }
`;

export default function BurgundyPreview() {
  React.useEffect(() => {
    const styleEl = document.createElement('style');
    styleEl.id = 'burgundy-theme-override';
    styleEl.textContent = BURGUNDY_STYLES;
    document.head.appendChild(styleEl);

    const html = document.documentElement;
    html.classList.add('burgundy-theme');

    return () => {
      styleEl.remove();
      html.classList.remove('burgundy-theme');
    };
  }, []);

  return (
    <>
      {/* Banner indicating this is a preview */}
      <div
        className="fixed top-0 left-0 right-0 z-[9999] flex items-center justify-center gap-4 py-1.5 px-4"
        style={{ background: '#461324', borderBottom: '1px solid #2e0c17' }}
      >
        <span className="font-body text-[10px] tracking-[0.3em] uppercase text-white/90 font-medium">
          🎨 Bordeaux kleurvariant — enkel voor intern gebruik
        </span>
      </div>
      <div className="pt-8 burgundy-preview">
        <HeroSection />
        <StatsSection />
        <StorySection />
        <PhilosophySection />
        <SeasonalSection />
        <CTACards />
        <LocationsPreview />
        <ReviewsSection />
        <div style={{ minHeight: '200px' }} />
      </div>
    </>
  );
}