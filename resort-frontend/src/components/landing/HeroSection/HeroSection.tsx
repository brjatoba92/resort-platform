import React from 'react';
import { Button } from '../../common/Button';
import styles from './HeroSection.module.css';

export interface HeroSectionProps {
  title: string;
  subtitle: string;
  backgroundImage: string;
  onBookNow: () => void;
  onLearnMore: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  title,
  subtitle,
  backgroundImage,
  onBookNow,
  onLearnMore
}) => {
  return (
    <section 
      className={styles.hero}
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <div className={styles.overlay}>
        <div className={styles.content}>
          <h1 className={styles.title}>{title}</h1>
          <p className={styles.subtitle}>{subtitle}</p>
          
          <div className={styles.actions}>
            <Button 
              variant="primary" 
              size="large"
              onClick={onBookNow}
            >
              Book Now
            </Button>
            <Button 
              variant="outline" 
              size="large"
              onClick={onLearnMore}
            >
              Learn More
            </Button>
          </div>

          <div className={styles.scrollIndicator}>
            <div className={styles.mouse}>
              <div className={styles.wheel} />
            </div>
            <div className={styles.arrows}>
              <span>↓</span>
              <span>↓</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
