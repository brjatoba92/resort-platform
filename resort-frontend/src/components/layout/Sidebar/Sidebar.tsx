import React from 'react';
import styles from './Sidebar.module.css';

interface SidebarProps {
  isOpen?: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen = true }) => {
  return (
    <aside className={`${styles.sidebar} ${isOpen ? styles.open : ''}`}>
      <nav className={styles.navigation}>
        <div className={styles.section}>
          <h3>Quick Access</h3>
          <ul>
            <li><a href="/dashboard">Dashboard</a></li>
            <li><a href="/bookings">My Bookings</a></li>
            <li><a href="/profile">Profile</a></li>
          </ul>
        </div>
        
        <div className={styles.section}>
          <h3>Resort Services</h3>
          <ul>
            <li><a href="/spa">Spa & Wellness</a></li>
            <li><a href="/dining">Dining</a></li>
            <li><a href="/activities">Activities</a></li>
            <li><a href="/events">Events</a></li>
          </ul>
        </div>

        <div className={styles.section}>
          <h3>Support</h3>
          <ul>
            <li><a href="/help">Help Center</a></li>
            <li><a href="/contact">Contact Us</a></li>
            <li><a href="/faq">FAQ</a></li>
          </ul>
        </div>
      </nav>
    </aside>
  );
};
