import React from 'react';
import HeroSection from '@/components/home/HeroSection';
import StatsSection from '@/components/home/StatsSection';
import StorySection from '@/components/home/StorySection';
import PhilosophySection from '@/components/home/PhilosophySection';
import SeasonalSection from '@/components/home/SeasonalSection';
import CTACards from '@/components/home/CTACards';
import LocationsPreview from '@/components/home/LocationsPreview';
import ReviewsSection from '@/components/home/ReviewsSection';

// Yellow/Ochre theme override — old Bogèst colors
// This page injects CSS variables temporarily to simulate the old brand palette
const YELLOW_STYLES = `
  .yellow-theme {
    --primary: 38 85% 50%;
    --primary-foreground: 38 20% 96%;
    --accent: 38 85% 50%;
    --accent-foreground: 38 20% 96%;
    --ring: 38 85% 50%;
    --chart-1: 38 85% 50%;
    --background: 40 30% 98%;
    --foreground: 30 12% 10%;
    --card: 40 25% 95%;
    --card-foreground: 30 12% 10%;
    --popover: 40 25% 95%;
    --popover-foreground: 30 12% 10%;
    --secondary: 40 20% 90%;
    --secondary-foreground: 30 10% 20%;
    --muted: 40 18% 92%;
    --muted-foreground: 30 8% 46%;
    --border: 38 20% 87%;
    --input: 38 20% 87%;
  }
  .yellow-theme.dark {
    --primary: 40 80% 58%;
    --primary-foreground: 30 12% 8%;
    --accent: 40 80% 58%;
    --accent-foreground: 30 12% 8%;
    --ring: 40 80% 58%;
    --chart-1: 40 80% 58%;
    --background: 28 8% 7%;
    --foreground: 40 15% 90%;
    --card: 28 8% 10%;
    --card-foreground: 40 15% 90%;
    --border: 28 8% 16%;
    --input: 28 8% 16%;
    --muted: 28 8% 13%;
    --muted-foreground: 38 6% 52%;
  }
`;

export default function YellowPreview() {
  React.useEffect(() => {
    // Inject the yellow theme styles
    const styleEl = document.createElement('style');
    styleEl.id = 'yellow-theme-override';
    styleEl.textContent = YELLOW_STYLES;
    document.head.appendChild(styleEl);

    // Apply class to html element
    const html = document.documentElement;
    html.classList.add('yellow-theme');

    return () => {
      // Cleanup on unmount
      styleEl.remove();
      html.classList.remove('yellow-theme');
    };
  }, []);

  return (
    <>
      {/* Banner indicating this is a preview */}
      <div className="fixed top-0 left-0 right-0 z-[9999] flex items-center justify-center gap-4 py-1.5 px-4"
        style={{ background: 'hsl(38 75% 42%)', borderBottom: '1px solid hsl(38 65% 35%)' }}>
        <span className="font-body text-[10px] tracking-[0.3em] uppercase text-white/90 font-medium">
          🎨 Gele kleurvariant — oud Bogèst palet — enkel voor intern gebruik
        </span>
      </div>
      <style>{`
        .yellow-preview div[style*="hsl(78"] {
          background: hsl(38 75% 42% / 0.15) !important;
        }
        .yellow-preview div[style*="rgba(102,135,92"] {
          background: hsl(38 75% 42% / 0.12) !important;
        }
      `}</style>
      <div className="pt-8 yellow-preview">
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