import { localStorage } from '../storage';

export interface WebSocketMessage<T = any> {
  type: string;
  payload: T;
}

export interface WebSocketOptions {
  url?: string;
  reconnectAttempts?: number;
  reconnectInterval?: number;
  heartbeatInterval?: number;
  onOpen?: () => void;
  onClose?: () => void;
  onError?: (error: Event) => void;
}

class WebSocketService {
  private static instance: WebSocketService;
  private ws: WebSocket | null = null;
  private reconnectAttempts: number;
  private reconnectInterval: number;
  private heartbeatInterval: number;
  private reconnectCount = 0;
  private reconnectTimeoutId?: NodeJS.Timeout;
  private heartbeatTimeoutId?: NodeJS.Timeout;
  private messageHandlers: Map<string, Set<(payload: any) => void>> = new Map();
  private options: WebSocketOptions;
  private baseUrl: string;

  private constructor(options: WebSocketOptions = {}) {
    this.baseUrl = options.url || this.getWebSocketUrl();
    this.options = options;
    this.reconnectAttempts = options.reconnectAttempts || 5;
    this.reconnectInterval = options.reconnectInterval || 3000;
    this.heartbeatInterval = options.heartbeatInterval || 30000;
  }

  static getInstance(options?: WebSocketOptions): WebSocketService {
    if (!WebSocketService.instance) {
      WebSocketService.instance = new WebSocketService(options);
    }
    return WebSocketService.instance;
  }

  private getWebSocketUrl(): string {
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const host = process.env.NEXT_PUBLIC_WS_HOST || window.location.host;
    return `${protocol}//${host}/ws`;
  }

  connect(): void {
    try {
      const token = localStorage.get<string>('auth_token');
      const url = new URL(this.baseUrl);
      
      if (token) {
        url.searchParams.set('token', token);
      }

      this.ws = new WebSocket(url.toString());

      this.ws.onopen = () => {
        this.reconnectCount = 0;
        this.startHeartbeat();
        this.options.onOpen?.();
      };

      this.ws.onclose = () => {
        this.stopHeartbeat();
        this.options.onClose?.();
        this.attemptReconnect();
      };

      this.ws.onerror = (error) => {
        this.options.onError?.(error);
      };

      this.ws.onmessage = (event) => {
        try {
          const message: WebSocketMessage = JSON.parse(event.data);
          
          if (message.type === 'pong') {
            return; // Ignore pong messages
          }

          const handlers = this.messageHandlers.get(message.type);
          if (handlers) {
            handlers.forEach(handler => handler(message.payload));
          }
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
        }
      };
    } catch (error) {
      console.error('WebSocket connection error:', error);
      this.options.onError?.(error as Event);
    }
  }

  private attemptReconnect(): void {
    if (this.reconnectCount < this.reconnectAttempts) {
      this.reconnectTimeoutId = setTimeout(() => {
        this.reconnectCount++;
        this.connect();
      }, this.reconnectInterval);
    }
  }

  private startHeartbeat(): void {
    this.heartbeatTimeoutId = setInterval(() => {
      this.send('ping');
    }, this.heartbeatInterval);
  }

  private stopHeartbeat(): void {
    if (this.heartbeatTimeoutId) {
      clearInterval(this.heartbeatTimeoutId);
    }
  }

  disconnect(): void {
    if (this.reconnectTimeoutId) {
      clearTimeout(this.reconnectTimeoutId);
    }
    this.stopHeartbeat();
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }

  send(type: string, payload?: any): void {
    if (this.ws?.readyState === WebSocket.OPEN) {
      const message: WebSocketMessage = {
        type,
        payload,
      };
      this.ws.send(JSON.stringify(message));
    } else {
      console.warn('WebSocket is not connected');
    }
  }

  subscribe<T = any>(type: string, handler: (payload: T) => void): () => void {
    if (!this.messageHandlers.has(type)) {
      this.messageHandlers.set(type, new Set());
    }

    const handlers = this.messageHandlers.get(type)!;
    handlers.add(handler);

    return () => {
      handlers.delete(handler);
      if (handlers.size === 0) {
        this.messageHandlers.delete(type);
      }
    };
  }

  unsubscribe(type: string): void {
    this.messageHandlers.delete(type);
  }

  isConnected(): boolean {
    return this.ws?.readyState === WebSocket.OPEN;
  }

  getConnectionState(): 'connecting' | 'connected' | 'disconnected' | 'error' {
    if (!this.ws) return 'disconnected';
    
    switch (this.ws.readyState) {
      case WebSocket.CONNECTING:
        return 'connecting';
      case WebSocket.OPEN:
        return 'connected';
      case WebSocket.CLOSING:
      case WebSocket.CLOSED:
        return 'disconnected';
      default:
        return 'error';
    }
  }
}

export const websocketService = WebSocketService.getInstance();