import React, { useState } from 'react';
import { Header } from '../Header';
import { Sidebar } from '../Sidebar';
import styles from './Layout.module.css';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className={styles.layout}>
      <Header />
      <Sidebar isOpen={isSidebarOpen} />
      <main className={`${styles.main} ${isSidebarOpen ? styles.withSidebar : ''}`}>
        <button 
          className={styles.toggleButton}
          onClick={toggleSidebar}
          aria-label={isSidebarOpen ? 'Close sidebar' : 'Open sidebar'}
        >
          {isSidebarOpen ? '←' : '→'}
        </button>
        <div className={styles.content}>
          {children}
        </div>
      </main>
    </div>
  );
};
