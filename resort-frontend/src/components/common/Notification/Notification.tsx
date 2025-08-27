import React, { useEffect, useState } from 'react';
import styles from './Notification.module.css';

export type NotificationType = 'success' | 'error' | 'warning' | 'info';

export interface NotificationProps {
  type?: NotificationType;
  title?: string;
  message: string;
  duration?: number;
  onClose?: () => void;
  showIcon?: boolean;
  showCloseButton?: boolean;
}

const icons = {
  success: '✓',
  error: '✕',
  warning: '⚠',
  info: 'ℹ'
};

export const Notification: React.FC<NotificationProps> = ({
  type = 'info',
  title,
  message,
  duration = 5000,
  onClose,
  showIcon = true,
  showCloseButton = true,
}) => {
  const [isVisible, setIsVisible] = useState(true);
  const [isLeaving, setIsLeaving] = useState(false);

  const handleClose = () => {
    setIsLeaving(true);
    setTimeout(() => {
      setIsVisible(false);
      onClose?.();
    }, 300); // Match animation duration
  };

  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(handleClose, duration);
      return () => clearTimeout(timer);
    }
  }, [duration]);

  if (!isVisible) return null;

  return (
    <div
      className={`${styles.notification} ${styles[type]} ${isLeaving ? styles.leave : ''}`}
      role="alert"
    >
      {showIcon && (
        <div className={styles.icon} aria-hidden="true">
          {icons[type]}
        </div>
      )}

      <div className={styles.content}>
        {title && <h4 className={styles.title}>{title}</h4>}
        <p className={styles.message}>{message}</p>
      </div>

      {showCloseButton && (
        <button
          className={styles.closeButton}
          onClick={handleClose}
          aria-label="Close notification"
        >
          ×
        </button>
      )}

      {duration > 0 && (
        <div 
          className={styles.progressBar}
          style={{ animationDuration: `${duration}ms` }}
        />
      )}
    </div>
  );
};
