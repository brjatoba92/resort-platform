import { api } from './index';

interface Reservation {
  id: string;
  guestId: string;
  roomId: string;
  checkInDate: string;
  checkOutDate: string;
  status: 'pending' | 'confirmed' | 'checked_in' | 'checked_out' | 'cancelled';
  numberOfGuests: number;
  totalAmount: number;
  paymentStatus: 'pending' | 'partially_paid' | 'paid' | 'refunded';
  specialRequests?: string;
  createdAt: string;
  updatedAt: string;
  cancellationReason?: string;
  cancellationDate?: string;
}

interface CreateReservationData {
  guestId: string;
  roomId: string;
  checkInDate: string;
  checkOutDate: string;
  numberOfGuests: number;
  specialRequests?: string;
}

interface UpdateReservationData extends Partial<CreateReservationData> {}

interface ReservationFilters {
  status?: Reservation['status'];
  paymentStatus?: Reservation['paymentStatus'];
  startDate?: string;
  endDate?: string;
  guestId?: string;
  roomId?: string;
}

interface RoomAvailability {
  roomId: string;
  roomNumber: string;
  roomType: string;
  available: boolean;
  price: number;
}

interface PriceCalculation {
  basePrice: number;
  taxes: number;
  fees: number;
  totalAmount: number;
  breakdown: {
    description: string;
    amount: number;
  }[];
}

export const reservationService = {
  async getAll(filters?: ReservationFilters): Promise<Reservation[]> {
    const response = await api.get<Reservation[]>('/reservations', {
      params: filters,
    });
    return response.data;
  },

  async getById(id: string): Promise<Reservation> {
    const response = await api.get<Reservation>(`/reservations/${id}`);
    return response.data;
  },

  async create(data: CreateReservationData): Promise<Reservation> {
    const response = await api.post<Reservation>('/reservations', data);
    return response.data;
  },

  async update(id: string, data: UpdateReservationData): Promise<Reservation> {
    const response = await api.put<Reservation>(`/reservations/${id}`, data);
    return response.data;
  },

  async cancel(id: string, reason: string): Promise<Reservation> {
    const response = await api.post<Reservation>(`/reservations/${id}/cancel`, { reason });
    return response.data;
  },

  async checkIn(id: string): Promise<Reservation> {
    const response = await api.post<Reservation>(`/reservations/${id}/check-in`);
    return response.data;
  },

  async checkOut(id: string): Promise<Reservation> {
    const response = await api.post<Reservation>(`/reservations/${id}/check-out`);
    return response.data;
  },

  async getAvailability(
    startDate: string,
    endDate: string,
    roomType?: string,
    numberOfGuests?: number
  ): Promise<RoomAvailability[]> {
    const response = await api.get<RoomAvailability[]>('/reservations/availability', {
      params: { startDate, endDate, roomType, numberOfGuests },
    });
    return response.data;
  },

  async calculatePrice(
    roomId: string,
    checkInDate: string,
    checkOutDate: string,
    numberOfGuests: number
  ): Promise<PriceCalculation> {
    const response = await api.post<PriceCalculation>('/reservations/calculate-price', {
      roomId,
      checkInDate,
      checkOutDate,
      numberOfGuests,
    });
    return response.data;
  },

  async getCurrentReservations(): Promise<Reservation[]> {
    const response = await api.get<Reservation[]>('/reservations/current');
    return response.data;
  },

  async getUpcomingCheckIns(days: number = 7): Promise<Reservation[]> {
    const response = await api.get<Reservation[]>('/reservations/upcoming-check-ins', {
      params: { days },
    });
    return response.data;
  },

  async getUpcomingCheckOuts(days: number = 7): Promise<Reservation[]> {
    const response = await api.get<Reservation[]>('/reservations/upcoming-check-outs', {
      params: { days },
    });
    return response.data;
  },
};