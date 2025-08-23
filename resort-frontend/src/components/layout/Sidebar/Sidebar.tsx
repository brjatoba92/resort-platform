import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ROUTES } from '../../../utils/constants/routes';
import styles from './Sidebar.module.css';

interface MenuItem {
  path: string;
  label: string;
  icon: string;
  requiresAdmin?: boolean;
}

const menuItems: MenuItem[] = [
  {
    path: ROUTES.DASHBOARD,
    label: 'Dashboard',
    icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6'
  },
  {
    path: ROUTES.GUEST_LIST,
    label: 'Hóspedes',
    icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z'
  },
  {
    path: ROUTES.ROOM_LIST,
    label: 'Quartos',
    icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6'
  },
  {
    path: ROUTES.RESERVATION_LIST,
    label: 'Reservas',
    icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z'
  },
  {
    path: ROUTES.EMPLOYEE_LIST,
    label: 'Funcionários',
    icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z',
    requiresAdmin: true
  },
  {
    path: ROUTES.OCCUPANCY_REPORT,
    label: 'Relatórios',
    icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z',
    requiresAdmin: true
  }
];

const Sidebar: React.FC = () => {
  const location = useLocation();
  const userRole = localStorage.getItem('resort_user_role');
  const isAdmin = userRole === 'admin';

  const isActive = (path: string) => location.pathname === path;

  const filteredMenuItems = menuItems.filter(item => 
    !item.requiresAdmin || (item.requiresAdmin && isAdmin)
  );

  return (
    <aside className={styles.sidebar}>
      {/* Logo */}
      <div className={styles.logoContainer}>
        <Link to={ROUTES.DASHBOARD} className={styles.logo}>
          <svg className={styles.logoIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          <span>Resort</span>
        </Link>
      </div>

      {/* Menu Principal */}
      <nav className={styles.nav}>
        <ul className={styles.navList}>
          {filteredMenuItems.map((item) => (
            <li key={item.path} className={styles.navItem}>
              <Link
                to={item.path}
                className={`${styles.navLink} ${
                  isActive(item.path) ? styles.navLinkActive : styles.navLinkInactive
                }`}
              >
                <svg
                  className={styles.navIcon}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
                </svg>
                <span className={styles.navLabel}>{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* Status do Sistema */}
      <div className={styles.statusBar}>
        <div className={styles.statusIndicator}>
          <div className={`${styles.statusDot} ${styles.statusDotOnline}`}></div>
          <span>Sistema Online</span>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;