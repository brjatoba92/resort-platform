import { api } from './index';

interface RoomFeatures {
  hasBalcony: boolean;
  hasBathtub: boolean;
  hasSeaView: boolean;
  hasKitchenette: boolean;
  isAccessible: boolean;
  isSmoking: boolean;
}

interface Room {
  id: string;
  number: string;
  type: string;
  floor: number;
  capacity: number;
  basePrice: number;
  status: 'available' | 'occupied' | 'maintenance' | 'cleaning';
  amenities: string[];
  description: string;
  images: string[];
  lastCleaning?: string;
  nextMaintenance?: string;
  features: RoomFeatures;
}

interface CreateRoomData extends Omit<Room, 'id' | 'lastCleaning' | 'nextMaintenance'> {}
interface UpdateRoomData extends Partial<CreateRoomData> {}

interface RoomFilters {
  type?: string;
  floor?: number;
  status?: Room['status'];
  capacity?: number;
  amenities?: string[];
  priceRange?: {
    min?: number;
    max?: number;
  };
  features?: Partial<RoomFeatures>;
}

interface MaintenanceRecord {
  id: string;
  roomId: string;
  type: 'routine' | 'repair' | 'inspection';
  description: string;
  startDate: string;
  endDate?: string;
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
  assignedTo?: string;
  cost?: number;
  notes?: string;
}

interface RoomType {
  type: string;
  description: string;
  basePrice: number;
  capacity: number;
  amenities: string[];
  features: RoomFeatures;
}

interface RoomAmenity {
  name: string;
  category: string;
  description: string;
}

interface RoomImage {
  imageUrl: string;
  thumbnailUrl: string;
}

export const roomService = {
  async getAll(filters?: RoomFilters): Promise<Room[]> {
    const response = await api.get<Room[]>('/rooms', {
      params: filters,
    });
    return response.data;
  },

  async getById(id: string): Promise<Room> {
    const response = await api.get<Room>(`/rooms/${id}`);
    return response.data;
  },

  async create(data: CreateRoomData): Promise<Room> {
    const response = await api.post<Room>('/rooms', data);
    return response.data;
  },

  async update(id: string, data: UpdateRoomData): Promise<Room> {
    const response = await api.put<Room>(`/rooms/${id}`, data);
    return response.data;
  },

  async delete(id: string): Promise<void> {
    await api.delete(`/rooms/${id}`);
  },

  async updateStatus(id: string, status: Room['status'], reason?: string): Promise<Room> {
    const response = await api.patch<Room>(`/rooms/${id}/status`, { status, reason });
    return response.data;
  },

  async getMaintenanceHistory(roomId: string): Promise<MaintenanceRecord[]> {
    const response = await api.get<MaintenanceRecord[]>(`/rooms/${roomId}/maintenance`);
    return response.data;
  },

  async scheduleMaintenance(
    roomId: string,
    data: Omit<MaintenanceRecord, 'id' | 'roomId' | 'status'>
  ): Promise<MaintenanceRecord> {
    const response = await api.post<MaintenanceRecord>(`/rooms/${roomId}/maintenance`, data);
    return response.data;
  },

  async getRoomTypes(): Promise<RoomType[]> {
    const response = await api.get<RoomType[]>('/rooms/types');
    return response.data;
  },

  async getAvailableAmenities(): Promise<RoomAmenity[]> {
    const response = await api.get<RoomAmenity[]>('/rooms/amenities');
    return response.data;
  },

  async uploadRoomImage(roomId: string, image: File): Promise<RoomImage> {
    const formData = new FormData();
    formData.append('image', image);

    const response = await api.post<RoomImage>(`/rooms/${roomId}/images`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  async deleteRoomImage(roomId: string, imageUrl: string): Promise<void> {
    // Usando params em vez de data para requisição DELETE
    await api.delete(`/rooms/${roomId}/images`, {
      params: { imageUrl },
    });
  },
};