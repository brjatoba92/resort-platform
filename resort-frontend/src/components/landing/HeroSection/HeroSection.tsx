import React from 'react';
import { Link } from 'react-router-dom';
import styles from './HeroSection.module.css';

export function HeroSection() {
  return (
    <section className={styles.hero}>
      <div className={styles.content}>
        <h1 className={styles.title}>
          Welcome to Your Perfect Getaway
        </h1>
        <p className={styles.subtitle}>
          Experience luxury, comfort, and unforgettable moments in our resort
        </p>
        <div className={styles.buttons}>
          <Link to="/rooms" className={styles.primaryButton}>
            Book Now
          </Link>
          <Link to="/services" className={styles.secondaryButton}>
            Our Services
          </Link>
        </div>
      </div>
    </section>
  );
}