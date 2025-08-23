import { api } from './index';

interface Guest {
  id: string;
  name: string;
  email: string;
  phone: string;
  document: string;
  documentType: 'cpf' | 'passport';
  nationality: string;
  address: {
    street: string;
    number: string;
    complement?: string;
    city: string;
    state: string;
    country: string;
    zipCode: string;
  };
  birthDate: string;
  preferences?: {
    roomType?: string;
    dietaryRestrictions?: string[];
    specialRequests?: string;
  };
  status: 'active' | 'inactive' | 'blacklisted';
  lastStay?: string;
  totalStays: number;
}

interface CreateGuestData extends Omit<Guest, 'id' | 'totalStays' | 'lastStay'> {}
interface UpdateGuestData extends Partial<CreateGuestData> {}

interface GuestFilters {
  status?: Guest['status'];
  search?: string;
  nationality?: string;
  checkInDate?: string;
  checkOutDate?: string;
}

interface GuestStay {
  id: string;
  guestId: string;
  roomNumber: string;
  checkInDate: string;
  checkOutDate: string;
  status: 'scheduled' | 'checked_in' | 'checked_out' | 'cancelled';
  totalAmount: number;
  paymentStatus: 'pending' | 'paid' | 'partially_paid' | 'refunded';
}

export const guestService = {
  async getAll(filters?: GuestFilters): Promise<Guest[]> {
    const response = await api.get<Guest[]>('/guests', {
      params: filters,
    });
    return response.data;
  },

  async getById(id: string): Promise<Guest> {
    const response = await api.get<Guest>(`/guests/${id}`);
    return response.data;
  },

  async create(data: CreateGuestData): Promise<Guest> {
    const response = await api.post<Guest>('/guests', data);
    return response.data;
  },

  async update(id: string, data: UpdateGuestData): Promise<Guest> {
    const response = await api.put<Guest>(`/guests/${id}`, data);
    return response.data;
  },

  async delete(id: string): Promise<void> {
    await api.delete(`/guests/${id}`);
  },

  async getStayHistory(guestId: string): Promise<GuestStay[]> {
    const response = await api.get<GuestStay[]>(`/guests/${guestId}/stays`);
    return response.data;
  },

  async addToBlacklist(guestId: string, reason: string): Promise<Guest> {
    const response = await api.post<Guest>(`/guests/${guestId}/blacklist`, { reason });
    return response.data;
  },

  async removeFromBlacklist(guestId: string): Promise<Guest> {
    const response = await api.delete<Guest>(`/guests/${guestId}/blacklist`);
    return response.data;
  },

  async updatePreferences(guestId: string, preferences: Guest['preferences']): Promise<Guest> {
    const response = await api.put<Guest>(`/guests/${guestId}/preferences`, preferences);
    return response.data;
  },

  async getCurrentGuests(): Promise<Guest[]> {
    const response = await api.get<Guest[]>('/guests/current');
    return response.data;
  },
};