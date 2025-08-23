import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { websocketService } from '../services/websocket';

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

interface NotificationContextData {
  notifications: Notification[];
  showNotification: (data: Omit<Notification, 'id' | 'createdAt'>) => string;
  closeNotification: (id: string) => void;
  closeAllNotifications: () => void;
}

interface NotificationProviderProps {
  children: React.ReactNode;
}

const NotificationContext = createContext<NotificationContextData>({} as NotificationContextData);

export function NotificationProvider({ children }: NotificationProviderProps) {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    // Subscribe to real-time notifications
    const unsubscribe = websocketService.subscribe<Notification>('notification', (notification: Notification) => {
      showNotification({
        type: notification.type,
        title: notification.title,
        message: notification.message,
        autoClose: true,
        duration: 5000,
      });
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const showNotification = useCallback((data: Omit<Notification, 'id' | 'createdAt'>) => {
    const id = Math.random().toString(36).substring(2);
    const notification: Notification = {
      ...data,
      id,
      createdAt: new Date(),
    };

    setNotifications(prev => [...prev, notification]);

    if (data.autoClose && data.duration) {
      setTimeout(() => {
        closeNotification(id);
      }, data.duration);
    }

    return id;
  }, []);

  const closeNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  }, []);

  const closeAllNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        showNotification,
        closeNotification,
        closeAllNotifications,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotification(): NotificationContextData {
  const context = useContext(NotificationContext);

  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }

  return context;
}