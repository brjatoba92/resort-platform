import React from 'react';
import {
  HeroSection,
  FeaturesSection,
  RoomShowcase,
  TestimonialsSection,
} from '../components/landing';

export const LandingPage: React.FC = () => {
  return (
    <main>
      <HeroSection />
      <FeaturesSection />
      <RoomShowcase />
      <TestimonialsSection />
    </main>
  );
};
