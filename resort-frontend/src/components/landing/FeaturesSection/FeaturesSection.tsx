import React from 'react';
import styles from './FeaturesSection.module.css';

interface Feature {
  icon: string;
  title: string;
  description: string;
}

export interface FeaturesSectionProps {
  title: string;
  subtitle: string;
  features: Feature[];
}

export const FeaturesSection: React.FC<FeaturesSectionProps> = ({
  title,
  subtitle,
  features
}) => {
  return (
    <section className={styles.features}>
      <div className={styles.header}>
        <h2 className={styles.title}>{title}</h2>
        <p className={styles.subtitle}>{subtitle}</p>
      </div>

      <div className={styles.grid}>
        {features.map((feature, index) => (
          <div key={index} className={styles.feature}>
            <div className={styles.iconWrapper}>
              <span className={styles.icon}>{feature.icon}</span>
            </div>
            <h3 className={styles.featureTitle}>{feature.title}</h3>
            <p className={styles.description}>{feature.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};
