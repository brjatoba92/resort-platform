import React from 'react';
import styles from './MetricsCard.module.css';

interface MetricsCardProps {
  title: string;
  value: string | number;
  description?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  icon?: React.ReactNode;
}

export const MetricsCard: React.FC<MetricsCardProps> = ({
  title,
  value,
  description,
  trend,
  icon,
}) => {
  return (
    <div className={styles.card}>
      <div className={styles.content}>
        <div className={styles.info}>
          <p className={styles.title}>{title}</p>
          <p className={styles.value}>{value}</p>
          {description && <p className={styles.description}>{description}</p>}
        </div>
        {icon && <div className={styles.icon}>{icon}</div>}
      </div>
      {trend && (
        <div className={styles.trend}>
          <div
            className={`${styles.trendValue} ${
              trend.isPositive ? styles.trendPositive : styles.trendNegative
            }`}
          >
            {trend.isPositive ? (
              <svg
                className={`${styles.trendIcon} ${styles.trendIconPositive}`}
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            ) : (
              <svg
                className={`${styles.trendIcon} ${styles.trendIconNegative}`}
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M14.707 10.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 12.586V5a1 1 0 012 0v7.586l2.293-2.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            )}
            <span className="ml-2">{trend.value}%</span>
          </div>
        </div>
      )}
    </div>
  );
};