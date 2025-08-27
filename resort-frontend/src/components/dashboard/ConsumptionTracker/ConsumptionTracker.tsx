import React from 'react';
import styles from './ConsumptionTracker.module.css';

interface ConsumptionData {
  type: string;
  current: number;
  total: number;
  unit: string;
}

export interface ConsumptionTrackerProps {
  data: ConsumptionData[];
}

export const ConsumptionTracker: React.FC<ConsumptionTrackerProps> = ({ data }) => {
  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Resource Consumption</h2>
      <div className={styles.grid}>
        {data.map((item, index) => {
          const percentage = (item.current / item.total) * 100;
          const isHigh = percentage > 80;
          const isMedium = percentage > 60 && percentage <= 80;

          return (
            <div key={index} className={styles.card}>
              <div className={styles.header}>
                <h3>{item.type}</h3>
                <span className={`${styles.status} ${
                  isHigh ? styles.high : isMedium ? styles.medium : styles.low
                }`}>
                  {percentage.toFixed(1)}%
                </span>
              </div>

              <div className={styles.progressContainer}>
                <div 
                  className={`${styles.progressBar} ${
                    isHigh ? styles.highBar : isMedium ? styles.mediumBar : styles.lowBar
                  }`}
                  style={{ width: `${percentage}%` }}
                />
              </div>

              <div className={styles.details}>
                <span>
                  {item.current} {item.unit} used
                </span>
                <span>
                  of {item.total} {item.unit}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
