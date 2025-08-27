import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  HeroSection,
  FeaturesSection,
  RoomShowcase,
  TestimonialsSection
} from '../../components/landing';
import styles from './Landing.module.css';

const features = [
  {
    icon: '🏊‍♂️',
    title: 'Infinity Pool',
    description: 'Enjoy our stunning infinity pool overlooking the ocean.'
  },
  {
    icon: '🍽️',
    title: 'Fine Dining',
    description: 'Experience world-class cuisine at our restaurants.'
  },
  {
    icon: '🧖‍♀️',
    title: 'Luxury Spa',
    description: 'Relax and rejuvenate at our premium spa facilities.'
  },
  {
    icon: '🏖️',
    title: 'Private Beach',
    description: 'Access to exclusive private beach and water activities.'
  },
  {
    icon: '🎯',
    title: 'Activities',
    description: 'Wide range of recreational activities and entertainment.'
  },
  {
    icon: '🚗',
    title: 'Valet Parking',
    description: 'Complimentary valet parking service for all guests.'
  }
];

const rooms = [
  {
    id: '1',
    name: 'Ocean View Suite',
    type: 'Suite',
    price: 450,
    description: 'Luxurious suite with panoramic ocean views, king-size bed, and private balcony.',
    amenities: ['Ocean View', 'King Bed', 'Balcony', 'Mini Bar', 'Room Service'],
    images: ['/images/rooms/ocean-suite-1.jpg', '/images/rooms/ocean-suite-2.jpg']
  },
  // Add more rooms...
];

const testimonials = [
  {
    id: '1',
    author: 'John Smith',
    role: 'Business Traveler',
    avatar: '/images/testimonials/john.jpg',
    content: 'The best resort experience I've ever had. The staff was incredibly attentive and the facilities are world-class.',
    rating: 5
  },
  // Add more testimonials...
];

export const Landing: React.FC = () => {
  const navigate = useNavigate();

  const handleBookNow = () => {
    navigate('/booking');
  };

  const handleLearnMore = () => {
    const featuresSection = document.getElementById('features');
    featuresSection?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleRoomBooking = (roomId: string) => {
    navigate(`/booking?room=${roomId}`);
  };

  return (
    <div className={styles.landing}>
      <HeroSection
        title="Welcome to Paradise"
        subtitle="Experience luxury and tranquility at our world-class resort"
        backgroundImage="/images/hero-bg.jpg"
        onBookNow={handleBookNow}
        onLearnMore={handleLearnMore}
      />

      <div id="features">
        <FeaturesSection
          title="Resort Features"
          subtitle="Discover the exceptional amenities and services that make our resort unique"
          features={features}
        />
      </div>

      <RoomShowcase
        title="Our Accommodations"
        subtitle="Choose from our selection of luxurious rooms and suites"
        rooms={rooms}
        onBookNow={handleRoomBooking}
      />

      <TestimonialsSection
        title="Guest Experiences"
        subtitle="What our guests say about their stay with us"
        testimonials={testimonials}
      />
    </div>
  );
};
