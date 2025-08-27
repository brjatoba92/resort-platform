import React from 'react';
import styles from './Footer.module.css';

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className={styles.content}>
        <div className={styles.section}>
          <h4>About Us</h4>
          <p>Experience luxury and comfort at our resort, where every moment becomes a cherished memory.</p>
        </div>

        <div className={styles.section}>
          <h4>Quick Links</h4>
          <ul>
            <li><a href="/rooms">Rooms & Suites</a></li>
            <li><a href="/dining">Restaurants</a></li>
            <li><a href="/spa">Spa & Wellness</a></li>
            <li><a href="/events">Events</a></li>
          </ul>
        </div>

        <div className={styles.section}>
          <h4>Contact</h4>
          <ul>
            <li>123 Resort Avenue</li>
            <li>Paradise City, PC 12345</li>
            <li>Phone: +1 (555) 123-4567</li>
            <li>Email: info@resort.com</li>
          </ul>
        </div>

        <div className={styles.section}>
          <h4>Follow Us</h4>
          <div className={styles.social}>
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">Facebook</a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">Instagram</a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">Twitter</a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">LinkedIn</a>
          </div>
        </div>
      </div>

      <div className={styles.bottom}>
        <div className={styles.copyright}>
          © {currentYear} Resort Platform. All rights reserved.
        </div>
        <div className={styles.links}>
          <a href="/privacy">Privacy Policy</a>
          <a href="/terms">Terms of Service</a>
          <a href="/sitemap">Sitemap</a>
        </div>
      </div>
    </footer>
  );
};
