import { useState, useCallback, useEffect } from 'react';

export type NotificationType = 'success' | 'error' | 'warning' | 'info';

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  autoClose?: boolean;
  duration?: number;
  createdAt: Date;
}

interface ShowNotificationOptions {
  type: NotificationType;
  title: string;
  message: string;
  autoClose?: boolean;
  duration?: number;
}

const DEFAULT_DURATION = 5000; // 5 seconds

export function useNotification() {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const showNotification = useCallback(({
    type,
    title,
    message,
    autoClose = true,
    duration = DEFAULT_DURATION,
  }: ShowNotificationOptions) => {
    const id = Math.random().toString(36).substring(2);
    const notification: Notification = {
      id,
      type,
      title,
      message,
      autoClose,
      duration,
      createdAt: new Date(),
    };

    setNotifications(prev => [...prev, notification]);

    return id;
  }, []);

  const closeNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  }, []);

  const closeAllNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  // Handle auto-closing notifications
  useEffect(() => {
    const timeouts: NodeJS.Timeout[] = [];

    notifications.forEach(notification => {
      if (notification.autoClose && notification.duration) {
        const timeout = setTimeout(() => {
          closeNotification(notification.id);
        }, notification.duration);

        timeouts.push(timeout);
      }
    });

    return () => {
      timeouts.forEach(timeout => clearTimeout(timeout));
    };
  }, [notifications, closeNotification]);

  // Success notification helper
  const showSuccess = useCallback((title: string, message: string, options: Partial<ShowNotificationOptions> = {}) => {
    return showNotification({ type: 'success', title, message, ...options });
  }, [showNotification]);

  // Error notification helper
  const showError = useCallback((title: string, message: string, options: Partial<ShowNotificationOptions> = {}) => {
    return showNotification({ type: 'error', title, message, ...options });
  }, [showNotification]);

  // Warning notification helper
  const showWarning = useCallback((title: string, message: string, options: Partial<ShowNotificationOptions> = {}) => {
    return showNotification({ type: 'warning', title, message, ...options });
  }, [showNotification]);

  // Info notification helper
  const showInfo = useCallback((title: string, message: string, options: Partial<ShowNotificationOptions> = {}) => {
    return showNotification({ type: 'info', title, message, ...options });
  }, [showNotification]);

  return {
    notifications,
    showNotification,
    closeNotification,
    closeAllNotifications,
    showSuccess,
    showError,
    showWarning,
    showInfo,
  };
}
