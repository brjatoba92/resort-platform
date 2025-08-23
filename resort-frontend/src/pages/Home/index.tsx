import React from 'react';
import { HeroSection } from '../../components/landing/HeroSection/HeroSection';
import { FeaturesSection } from '../../components/landing/FeaturesSection/FeaturesSection';
import { RoomShowcase } from '../../components/landing/RoomShowcase/RoomShowcase';
import { TestimonialsSection } from '../../components/landing/TestimonialsSection/TestimonialsSection';

export default function Home() {
  return (
    <div className="flex flex-col gap-16">
      <HeroSection />
      <FeaturesSection />
      <RoomShowcase />
      <TestimonialsSection />
    </div>
  );
}