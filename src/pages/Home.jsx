import React from 'react';
import HeroSection from '@/components/home/HeroSection';
import StatsSection from '@/components/home/StatsSection';
import StorySection from '@/components/home/StorySection';
import PhilosophySection from '@/components/home/PhilosophySection';
import SeasonalSection from '@/components/home/SeasonalSection';
import CTACards from '@/components/home/CTACards';
import HomeClosing from '@/components/home/HomeClosing';
import LocationsPreview from '@/components/home/LocationsPreview';
import ReviewsSection from '@/components/home/ReviewsSection';
import IntroPopup from '@/components/IntroPopup';

export default function Home() {
  return (
    <>
      <IntroPopup />
      <HeroSection />
      {/* Content layer — slides up over the fixed hero video. The backdrop
          fades from transparent (video visible) to the solid page background,
          so the gradient transition is attached to the content and slides over
          the video with it — premium on mobile and desktop. */}
      <div className="relative z-10 bg-background">
        {/* Shadow gradient — attached to the content, slides up over the fixed
            hero video. Dark high behind the hero text (like the sections cast a
            shadow over the video), fading seamlessly into the page background. */}
        <div aria-hidden className="absolute inset-x-0 -top-[70vh] h-[70vh] pointer-events-none" style={{ background: 'linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.82) 50%, hsl(var(--background)) 100%)', transform: 'translateZ(0)' }} />
        <StatsSection />
        <StorySection />
        <LocationsPreview />
        <PhilosophySection />
        <SeasonalSection />
        <ReviewsSection />
        <CTACards />
        <HomeClosing />
      </div>
    </>
  );
}