import React from 'react';
import * as Fa from 'react-icons/fa';
import styles from './FeaturesSection.module.css';

const features = [
  {
    icon: <Fa.FaSwimmingPool />,
    title: 'Luxury Pool',
    description: 'Relax in our stunning infinity pool with panoramic ocean views and luxurious cabanas'
  },
  {
    icon: <Fa.FaSpa />,
    title: 'Spa & Wellness',
    description: 'Rejuvenate your body and mind with our premium spa treatments and wellness programs'
  },
  {
    icon: <Fa.FaUtensils />,
    title: 'Fine Dining',
    description: 'Savor exquisite cuisine prepared by world-renowned chefs in our elegant restaurants'
  },
  {
    icon: <Fa.FaCocktail />,
    title: 'Premium Bar',
    description: 'Enjoy handcrafted cocktails and premium spirits in our sophisticated lounge setting'
  }
];

export function FeaturesSection() {
  return (
    <section className={styles.features}>
      <h2 className={styles.title}>Resort Features</h2>
      <div className={styles.grid}>
        {features.map((feature, index) => (
          <div key={index} className={styles.feature}>
            <div className={styles.icon}>{feature.icon}</div>
            <h3 className={styles.featureTitle}>{feature.title}</h3>
            <p className={styles.description}>{feature.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}