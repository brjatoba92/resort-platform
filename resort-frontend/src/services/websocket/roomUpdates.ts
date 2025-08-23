import { websocketService } from './websocketService';

export interface RoomUpdate {
  roomId: string;
  status: 'available' | 'occupied' | 'maintenance' | 'cleaning';
  occupiedBy?: string;
  maintenanceReason?: string;
  cleaningStatus?: 'pending' | 'in_progress' | 'completed';
  timestamp: number;
}

export interface RoomStatusChange {
  roomId: string;
  status: RoomUpdate['status'];
  reason?: string;
}

export interface RoomCleaningUpdate {
  roomId: string;
  status: RoomUpdate['cleaningStatus'];
  assignedTo?: string;
}

export interface RoomMaintenanceUpdate {
  roomId: string;
  reason: string;
  estimatedDuration?: number;
  assignedTo?: string;
}

class RoomUpdatesService {
  private static instance: RoomUpdatesService;
  private statusSubscribers: Set<(update: RoomUpdate) => void> = new Set();

  private constructor() {
    this.initialize();
  }

  static getInstance(): RoomUpdatesService {
    if (!RoomUpdatesService.instance) {
      RoomUpdatesService.instance = new RoomUpdatesService();
    }
    return RoomUpdatesService.instance;
  }

  private initialize(): void {
    websocketService.subscribe<RoomUpdate>('room:update', (update) => {
      this.notifySubscribers(update);
    });
  }

  private notifySubscribers(update: RoomUpdate): void {
    this.statusSubscribers.forEach(subscriber => subscriber(update));
  }

  subscribeToRoomUpdates(callback: (update: RoomUpdate) => void): () => void {
    this.statusSubscribers.add(callback);
    return () => {
      this.statusSubscribers.delete(callback);
    };
  }

  updateRoomStatus(update: RoomStatusChange): void {
    websocketService.send('room:status:update', update);
  }

  startCleaning(roomId: string, assignedTo?: string): void {
    const update: RoomCleaningUpdate = {
      roomId,
      status: 'in_progress',
      assignedTo,
    };
    websocketService.send('room:cleaning:start', update);
  }

  completeCleaning(roomId: string): void {
    const update: RoomCleaningUpdate = {
      roomId,
      status: 'completed',
    };
    websocketService.send('room:cleaning:complete', update);
  }

  startMaintenance(update: RoomMaintenanceUpdate): void {
    websocketService.send('room:maintenance:start', update);
  }

  completeMaintenance(roomId: string): void {
    websocketService.send('room:maintenance:complete', { roomId });
  }

  markAsOccupied(roomId: string, guestId: string): void {
    const update: RoomStatusChange = {
      roomId,
      status: 'occupied',
      reason: guestId,
    };
    websocketService.send('room:occupy', update);
  }

  markAsAvailable(roomId: string): void {
    const update: RoomStatusChange = {
      roomId,
      status: 'available',
    };
    websocketService.send('room:available', update);
  }

  requestRoomStatus(roomId: string): void {
    websocketService.send('room:status:request', { roomId });
  }

  requestAllRoomsStatus(): void {
    websocketService.send('room:status:request:all');
  }
}

export const roomUpdates = RoomUpdatesService.getInstance();