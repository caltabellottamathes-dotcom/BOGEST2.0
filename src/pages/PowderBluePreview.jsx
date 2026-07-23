import React, { useEffect } from 'react';
import HeroSection from '@/components/home/HeroSection';
import StatsSection from '@/components/home/StatsSection';
import StorySection from '@/components/home/StorySection';
import PhilosophySection from '@/components/home/PhilosophySection';
import SeasonalSection from '@/components/home/SeasonalSection';
import CTACards from '@/components/home/CTACards';
import LocationsPreview from '@/components/home/LocationsPreview';
import ReviewsSection from '@/components/home/ReviewsSection';

// Light mode: Pantone 534 C — deep navy #1F3664 → HSL(220, 54%, 25%)
// Dark mode:  Pantone 536 C — steel blue #7B8FA6 → HSL(211, 18%, 57%)
// Supporting neutrals from the existing palette (Stone, Sage, Olive)
const POWDER_BLUE_STYLES = `
  .powder-blue-theme {
    /* Primary — Pantone 534 C (deep navy) */
    --primary: 220 54% 25%;
    --primary-foreground: 40 8% 95%;
    --ring: 220 54% 25%;

    /* Background — Stone */
    --background: 40 8% 91%;
    --foreground: 0 0% 11%;

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
    --accent: 212 22% 68%;
    --accent-foreground: 0 0% 11%;

    --border: 50 8% 76%;
    --input: 50 8% 76%;

    --chart-1: 220 54% 25%;
    --chart-2: 212 22% 68%;
    --chart-3: 43 40% 23%;
    --chart-4: 50 8% 69%;
    --chart-5: 0 0% 11%;

    --destructive: 0 72% 51%;
    --destructive-foreground: 0 0% 98%;
  }
  .powder-blue-theme.dark {
    /* Primary — Pantone 536 C (steel blue) */
    --primary: 211 18% 57%;
    --primary-foreground: 0 0% 10%;
    --ring: 211 18% 57%;

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

    --accent: 211 18% 40%;
    --accent-foreground: 40 8% 93%;

    --border: 0 0% 18%;
    --input: 0 0% 18%;

    --chart-1: 211 18% 57%;
    --chart-2: 43 35% 30%;
    --chart-3: 212 22% 50%;
    --chart-4: 50 8% 55%;
    --chart-5: 40 8% 88%;
  }
`;

export default function PowderBluePreview() {
  React.useEffect(() => {
    const styleEl = document.createElement('style');
    styleEl.id = 'powder-blue-theme-override';
    styleEl.textContent = POWDER_BLUE_STYLES;
    document.head.appendChild(styleEl);

    const html = document.documentElement;
    html.classList.add('powder-blue-theme');

    return () => {
      styleEl.remove();
      html.classList.remove('powder-blue-theme');
    };
  }, []);

  return (
    <>
      <div
        className="fixed top-0 left-0 right-0 z-[9999] flex items-center justify-center gap-4 py-1.5 px-4"
        style={{ background: '#1F3664', borderBottom: '1px solid #162750' }}
      >
        <span className="font-body text-[10px] tracking-[0.3em] uppercase text-white/90 font-medium">
          🎨 Powder Blue kleurvariant — enkel voor intern gebruik
        </span>
      </div>
      <div className="pt-8">
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