import { useState, useEffect, useCallback } from 'react';
import { useWebSocket } from './useWebSocket';

interface RealTimeDataOptions<T> {
  wsUrl?: string;
  channel: string;
  initialData?: T;
  onError?: (error: Error) => void;
  reconnectAttempts?: number;
  reconnectInterval?: number;
  heartbeatInterval?: number;
}

export function useRealTimeData<T>(options: RealTimeDataOptions<T>) {
  const {
    wsUrl = `${window.location.protocol === 'https:' ? 'wss:' : 'ws:'}//${window.location.host}/api/realtime`,
    channel,
    initialData,
    onError,
    reconnectAttempts = 5,
    reconnectInterval = 3000,
    heartbeatInterval = 30000,
  } = options;

  const [data, setData] = useState<T | undefined>(initialData);
  const [isLoading, setIsLoading] = useState(true);

  const { subscribe, send, isConnected, error } = useWebSocket({
    url: wsUrl,
    reconnectAttempts,
    reconnectInterval,
    heartbeatInterval,
    onError: (wsError) => {
      console.error('RealTime data WebSocket error:', wsError);
      onError?.(new Error('Failed to connect to real-time data service'));
    },
    onOpen: () => {
      // Subscribe to channel when connection is established
      send('subscribe', { channel });
    },
  });

  const handleData = useCallback((newData: T) => {
    setData(newData);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (isConnected) {
      return subscribe(channel, handleData);
    }
  }, [isConnected, channel, subscribe, handleData]);

  useEffect(() => {
    if (error) {
      console.error('RealTime data WebSocket error:', error);
      onError?.(new Error('Failed to connect to real-time data service'));
    }
  }, [error, onError]);

  const updateData = useCallback((updatedData: Partial<T>) => {
    if (isConnected) {
      send(`${channel}:update`, updatedData);
    } else {
      console.warn('Cannot update data: WebSocket is not connected');
    }
  }, [isConnected, channel, send]);

  // Cleanup subscription when component unmounts
  useEffect(() => {
    return () => {
      if (isConnected) {
        send('unsubscribe', { channel });
      }
    };
  }, [isConnected, channel, send]);

  return {
    data,
    isLoading,
    isConnected,
    error,
    updateData,
  };
}