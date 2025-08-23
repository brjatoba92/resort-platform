import React from 'react';
import {
  UsersIcon,
  BanknotesIcon,
  HomeIcon,
  CalendarIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
} from '@heroicons/react/24/outline';
import styles from './StatsCards.module.css';

interface Stat {
  id: string;
  title: string;
  value: string | number;
  change?: {
    value: number;
    type: 'increase' | 'decrease';
  };
  type: 'guests' | 'revenue' | 'rooms' | 'bookings';
}

interface StatsCardsProps {
  stats: Stat[];
}

export const StatsCards: React.FC<StatsCardsProps> = ({ stats }) => {
  const getIcon = (type: Stat['type']) => {
    switch (type) {
      case 'guests':
        return <UsersIcon className={styles.icon} />;
      case 'revenue':
        return <BanknotesIcon className={styles.icon} />;
      case 'rooms':
        return <HomeIcon className={styles.icon} />;
      case 'bookings':
        return <CalendarIcon className={styles.icon} />;
    }
  };

  const getCardClass = (type: Stat['type']) => {
    switch (type) {
      case 'guests':
        return styles.cardGuests;
      case 'revenue':
        return styles.cardRevenue;
      case 'rooms':
        return styles.cardRooms;
      case 'bookings':
        return styles.cardBookings;
    }
  };

  const formatChange = (change: Stat['change']) => {
    if (!change) return null;

    const isPositive = change.type === 'increase';
    const Icon = isPositive ? ArrowTrendingUpIcon : ArrowTrendingDownIcon;

    return (
      <div className={`${styles.change} ${isPositive ? styles.increase : styles.decrease}`}>
        <Icon className={styles.changeIcon} />
        <span>{Math.abs(change.value)}%</span>
      </div>
    );
  };

  return (
    <div className={styles.container}>
      {stats.map((stat) => (
        <div
          key={stat.id}
          className={`${styles.card} ${getCardClass(stat.type)}`}
        >
          <div className={styles.cardHeader}>
            <div className={styles.iconWrapper}>
              {getIcon(stat.type)}
            </div>
            {stat.change && formatChange(stat.change)}
          </div>
          <div className={styles.cardContent}>
            <h3 className={styles.title}>{stat.title}</h3>
            <p className={styles.value}>{stat.value}</p>
          </div>
        </div>
      ))}
    </div>
  );
};
