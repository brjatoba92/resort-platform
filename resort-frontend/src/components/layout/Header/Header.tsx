import React from 'react';
import { Link } from 'react-router-dom';
import styles from './Header.module.css';

export default function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <Link to="/" className={styles.logo}>
          Resort Platform
        </Link>
        <nav className={styles.nav}>
          <Link to="/rooms" className={styles.navLink}>Rooms</Link>
          <Link to="/services" className={styles.navLink}>Services</Link>
          <Link to="/contact" className={styles.navLink}>Contact</Link>
          <Link to="/login" className={styles.loginButton}>Login</Link>
        </nav>
      </div>
    </header>
  );
}