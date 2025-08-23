import { useCallback, useEffect } from 'react';
import { useWebSocket } from './useWebSocket';
import { useNotification } from '../context';

interface Event {
  id: string;
  type: 'reservation' | 'checkout' | 'maintenance';
  title: string;
  message: string;
  timestamp: Date;
}

interface EventNotificationsOptions {
  wsUrl?: string;
}

export function useEventNotifications(options: EventNotificationsOptions = {}) {
  const defaultWsUrl = `${window.location.protocol === 'https:' ? 'wss:' : 'ws:'}//${window.location.host}/api/events`;
  const { wsUrl = defaultWsUrl } = options;
  
  const { showNotification } = useNotification();
  const { subscribe, isConnected, error } = useWebSocket({
    url: wsUrl,
    reconnectAttempts: 5,
    reconnectInterval: 3000,
    onError: (error) => {
      console.error('Event notifications WebSocket error:', error);
      showNotification({
        type: 'error',
        title: 'Connection Error',
        message: 'Failed to connect to event notifications service',
        autoClose: true,
        duration: 5000,
      });
    }
  });

  const handleEvent = useCallback((event: Event) => {
    const notificationTypes = {
      reservation: 'success',
      checkout: 'warning',
      maintenance: 'info',
    } as const;

    showNotification({
      type: notificationTypes[event.type],
      title: event.title,
      message: event.message,
      autoClose: true,
      duration: 5000,
    });
  }, [showNotification]);

  useEffect(() => {
    if (isConnected) {
      return subscribe('event', handleEvent);
    }
  }, [isConnected, subscribe, handleEvent]);

  useEffect(() => {
    if (error) {
      console.error('Event notifications WebSocket error:', error);
      showNotification({
        type: 'error',
        title: 'Connection Error',
        message: 'Failed to connect to event notifications service',
        autoClose: true,
        duration: 5000,
      });
    }
  }, [error, showNotification]);

  return {
    isConnected,
    error,
  };
}