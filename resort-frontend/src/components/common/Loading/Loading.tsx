import React from 'react';
import styles from './Loading.module.css';

export interface LoadingProps {
  size?: 'small' | 'medium' | 'large';
  color?: 'primary' | 'secondary' | 'white';
  fullScreen?: boolean;
  text?: string;
}

export const Loading: React.FC<LoadingProps> = ({
  size = 'medium',
  color = 'primary',
  fullScreen = false,
  text
}) => {
  const containerClasses = [
    styles.container,
    fullScreen ? styles.fullScreen : '',
  ].filter(Boolean).join(' ');

  const spinnerClasses = [
    styles.spinner,
    styles[size],
    styles[color]
  ].join(' ');

  return (
    <div className={containerClasses} role="status">
      <div className={spinnerClasses}>
        <div className={styles.bounce1}></div>
        <div className={styles.bounce2}></div>
        <div className={styles.bounce3}></div>
      </div>
      {text && (
        <p className={styles.text}>{text}</p>
      )}
      <span className={styles.srOnly}>Loading...</span>
    </div>
  );
};
