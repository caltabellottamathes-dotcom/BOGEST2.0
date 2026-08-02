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
      <StatsSection />
      <StorySection />
      <LocationsPreview />
      <PhilosophySection />
      <SeasonalSection />
      <ReviewsSection />
      <CTACards />
      <HomeClosing />
    </>
  );
}