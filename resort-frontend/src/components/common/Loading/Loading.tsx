import React from 'react';
import styles from './Loading.module.css';

interface LoadingProps {
  variant?: 'primary' | 'secondary';
  size?: 'small' | 'medium' | 'large';
  fullScreen?: boolean;
  text?: string;
}

export const Loading: React.FC<LoadingProps> = ({
  variant = 'primary',
  size = 'medium',
  fullScreen = false,
  text,
}) => {
  const spinnerClasses = `
    ${styles.spinner}
    ${variant === 'primary' ? styles.spinnerPrimary : styles.spinnerSecondary}
    ${size === 'small' ? styles.spinnerSmall : size === 'large' ? styles.spinnerLarge : styles.spinnerMedium}
  `;

  const content = (
    <div className={styles.container}>
      <div>
        <div className={spinnerClasses} />
        {text && <p className={styles.text}>{text}</p>}
      </div>
    </div>
  );

  if (fullScreen) {
    return (
      <>
        <div className={styles.overlay} />
        {content}
      </>
    );
  }

  return content;
};
