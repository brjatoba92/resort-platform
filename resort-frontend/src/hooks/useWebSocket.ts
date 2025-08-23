import { useState, useCallback, useEffect, useRef } from 'react';
import { useAuth } from '../context';

interface WebSocketMessage<T = any> {
  type: string;
  payload: T;
}

interface WebSocketOptions {
  url?: string;
  reconnectAttempts?: number;
  reconnectInterval?: number;
  heartbeatInterval?: number;
  onOpen?: () => void;
  onClose?: () => void;
  onError?: (error: Event) => void;
  onReconnect?: (attempt: number) => void;
}

export function useWebSocket(options: WebSocketOptions = {}) {
  const {
    url = `${window.location.protocol === 'https:' ? 'wss:' : 'ws:'}//${window.location.host}/ws`,
    reconnectAttempts = 5,
    reconnectInterval = 3000,
    heartbeatInterval = 30000,
    onOpen,
    onClose,
    onError,
    onReconnect,
  } = options;

  const { token } = useAuth();
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<Event | null>(null);
  const ws = useRef<WebSocket | null>(null);
  const reconnectCount = useRef(0);
  const reconnectTimeoutId = useRef<NodeJS.Timeout>();
  const heartbeatTimeoutId = useRef<NodeJS.Timeout>();
  const messageHandlers = useRef<Map<string, Set<(payload: any) => void>>>(new Map());

  const connect = useCallback(() => {
    try {
      const wsUrl = new URL(url);
      if (token) {
        wsUrl.searchParams.set('token', token);
      }

      ws.current = new WebSocket(wsUrl.toString());

      ws.current.onopen = () => {
        setIsConnected(true);
        setError(null);
        reconnectCount.current = 0;
        onOpen?.();
      };

      ws.current.onclose = () => {
        setIsConnected(false);
        onClose?.();

        if (reconnectCount.current < reconnectAttempts) {
          reconnectTimeoutId.current = setTimeout(() => {
            reconnectCount.current += 1;
            onReconnect?.(reconnectCount.current);
            connect();
          }, reconnectInterval);
        }
      };

      ws.current.onerror = (event) => {
        setError(event);
        onError?.(event);
      };

      ws.current.onmessage = (event) => {
        try {
          const message: WebSocketMessage = JSON.parse(event.data);
          
          if (message.type === 'pong') {
            return; // Ignore pong messages
          }

          const handlers = messageHandlers.current.get(message.type);
          if (handlers) {
            handlers.forEach(handler => handler(message.payload));
          }
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
        }
      };
    } catch (error) {
      console.error('WebSocket connection error:', error);
      setError(error as Event);
      onError?.(error as Event);
    }
  }, [url, token, reconnectAttempts, reconnectInterval, onOpen, onClose, onError, onReconnect]);

  const disconnect = useCallback(() => {
    if (reconnectTimeoutId.current) {
      clearTimeout(reconnectTimeoutId.current);
    }
    if (heartbeatTimeoutId.current) {
      clearInterval(heartbeatTimeoutId.current);
    }
    if (ws.current) {
      ws.current.close();
      ws.current = null;
    }
    setIsConnected(false);
  }, []);

  const send = useCallback((type: string, payload?: any) => {
    if (ws.current?.readyState === WebSocket.OPEN) {
      const message: WebSocketMessage = {
        type,
        payload,
      };
      ws.current.send(JSON.stringify(message));
    } else {
      console.warn('WebSocket is not connected');
    }
  }, []);

  const subscribe = useCallback(<T = any>(type: string, handler: (payload: T) => void) => {
    if (!messageHandlers.current.has(type)) {
      messageHandlers.current.set(type, new Set());
    }

    const handlers = messageHandlers.current.get(type)!;
    handlers.add(handler);

    return () => {
      handlers.delete(handler);
      if (handlers.size === 0) {
        messageHandlers.current.delete(type);
      }
    };
  }, []);

  // Start heartbeat when connected
  useEffect(() => {
    if (isConnected) {
      heartbeatTimeoutId.current = setInterval(() => {
        send('ping');
      }, heartbeatInterval);

      return () => {
        if (heartbeatTimeoutId.current) {
          clearInterval(heartbeatTimeoutId.current);
        }
      };
    }
  }, [isConnected, heartbeatInterval, send]);

  // Connect on mount and reconnect when token changes
  useEffect(() => {
    connect();
    return () => {
      disconnect();
    };
  }, [connect, disconnect, token]);

  return {
    isConnected,
    error,
    send,
    subscribe,
    disconnect,
    reconnect: connect,
  };
}