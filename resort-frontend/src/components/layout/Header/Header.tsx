import React from 'react';
import styles from './Header.module.css';

interface HeaderProps {
  title?: string;
}

export const Header: React.FC<HeaderProps> = ({ title = 'Resort Platform' }) => {
  return (
    <header className={styles.header}>
      <div className={styles.logo}>
        <h1>{title}</h1>
      </div>
      <nav className={styles.nav}>
        <ul>
          <li><a href="/">Home</a></li>
          <li><a href="/accommodations">Accommodations</a></li>
          <li><a href="/amenities">Amenities</a></li>
          <li><a href="/reservations">Reservations</a></li>
          <li><a href="/contact">Contact</a></li>
        </ul>
      </nav>
    </header>
  );
};
