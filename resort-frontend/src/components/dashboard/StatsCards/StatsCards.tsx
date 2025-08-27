import React from 'react';
import styles from './StatsCards.module.css';

interface StatCard {
  title: string;
  value: string | number;
  change?: {
    value: number;
    type: 'increase' | 'decrease';
  };
  icon?: React.ReactNode;
}

export interface StatsCardsProps {
  stats: StatCard[];
}

export const StatsCards: React.FC<StatsCardsProps> = ({ stats }) => {
  return (
    <div className={styles.grid}>
      {stats.map((stat, index) => (
        <div key={index} className={styles.card}>
          {stat.icon && (
            <div className={styles.icon}>
              {stat.icon}
            </div>
          )}
          
          <div className={styles.content}>
            <h3 className={styles.title}>{stat.title}</h3>
            <div className={styles.value}>{stat.value}</div>
            
            {stat.change && (
              <div className={`${styles.change} ${
                stat.change.type === 'increase' ? styles.increase : styles.decrease
              }`}>
                <span className={styles.arrow}>
                  {stat.change.type === 'increase' ? '↑' : '↓'}
                </span>
                {Math.abs(stat.change.value)}%
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};
