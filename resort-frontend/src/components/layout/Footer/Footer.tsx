import React from 'react';
import { Link } from 'react-router-dom';
import styles from './Footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.content}>
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>About Us</h3>
            <p className={styles.sectionText}>
              Luxury resort offering exceptional experiences and unforgettable stays.
            </p>
          </div>
          
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Quick Links</h3>
            <nav className={styles.nav}>
              <Link to="/rooms" className={styles.link}>Rooms</Link>
              <Link to="/services" className={styles.link}>Services</Link>
              <Link to="/contact" className={styles.link}>Contact</Link>
            </nav>
          </div>
          
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Contact Info</h3>
            <address className={styles.address}>
              <p>123 Resort Street</p>
              <p>Paradise City, PC 12345</p>
              <p>Phone: (555) 123-4567</p>
              <p>Email: info@resort-platform.com</p>
            </address>
          </div>
        </div>
        
        <div className={styles.bottom}>
          <p className={styles.copyright}>
            © {new Date().getFullYear()} Resort Platform. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}