import { useState, useEffect, useCallback } from 'react';
import { useApi } from './useApi';
import { useRealTimeData } from './useRealTimeData';

interface Reservation {
  id: string;
  roomId: string;
  guestId: string;
  guestName: string;
  checkInDate: string;
  checkOutDate: string;
  status: 'pending' | 'confirmed' | 'checked_in' | 'checked_out' | 'cancelled';
  numberOfGuests: number;
  totalAmount: number;
  paymentStatus: 'pending' | 'partially_paid' | 'paid' | 'refunded';
  specialRequests?: string;
  createdAt: string;
  updatedAt: string;
}

interface ReservationFilters {
  startDate?: string;
  endDate?: string;
  status?: Reservation['status'];
  roomId?: string;
  guestId?: string;
}

export function useReservations(filters?: ReservationFilters) {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  
  const api = useApi();

  // Subscribe to real-time updates
  const { data: realtimeData } = useRealTimeData<Reservation[]>({
    channel: 'reservations',
    onError: (error) => {
      console.error('Real-time reservations error:', error);
    }
  });

  // Update reservations when real-time data changes
  useEffect(() => {
    if (realtimeData) {
      setReservations(realtimeData);
    }
  }, [realtimeData]);

  // Fetch initial reservations
  const fetchReservations = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await api.get<Reservation[]>('/reservations', {
        params: filters
      });
      setReservations(response);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch reservations'));
      console.error('Error fetching reservations:', err);
    } finally {
      setIsLoading(false);
    }
  }, [api, filters]);

  useEffect(() => {
    fetchReservations();
  }, [fetchReservations]);

  const createReservation = useCallback(async (data: Omit<Reservation, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const response = await api.post<Reservation>('/reservations', data);
      setReservations(prev => [...prev, response]);
      return response;
    } catch (err) {
      throw err instanceof Error ? err : new Error('Failed to create reservation');
    }
  }, [api]);

  const updateReservation = useCallback(async (id: string, data: Partial<Reservation>) => {
    try {
      const response = await api.put<Reservation>(`/reservations/${id}`, data);
      setReservations(prev => prev.map(res => res.id === id ? response : res));
      return response;
    } catch (err) {
      throw err instanceof Error ? err : new Error('Failed to update reservation');
    }
  }, [api]);

  const deleteReservation = useCallback(async (id: string) => {
    try {
      await api.delete(`/reservations/${id}`);
      setReservations(prev => prev.filter(res => res.id !== id));
    } catch (err) {
      throw err instanceof Error ? err : new Error('Failed to delete reservation');
    }
  }, [api]);

  const checkIn = useCallback(async (id: string) => {
    try {
      const response = await api.post<Reservation>(`/reservations/${id}/check-in`);
      setReservations(prev => prev.map(res => res.id === id ? response : res));
      return response;
    } catch (err) {
      throw err instanceof Error ? err : new Error('Failed to check in');
    }
  }, [api]);

  const checkOut = useCallback(async (id: string) => {
    try {
      const response = await api.post<Reservation>(`/reservations/${id}/check-out`);
      setReservations(prev => prev.map(res => res.id === id ? response : res));
      return response;
    } catch (err) {
      throw err instanceof Error ? err : new Error('Failed to check out');
    }
  }, [api]);

  const cancelReservation = useCallback(async (id: string, reason: string) => {
    try {
      const response = await api.post<Reservation>(`/reservations/${id}/cancel`, { reason });
      setReservations(prev => prev.map(res => res.id === id ? response : res));
      return response;
    } catch (err) {
      throw err instanceof Error ? err : new Error('Failed to cancel reservation');
    }
  }, [api]);

  return {
    reservations,
    isLoading,
    error,
    createReservation,
    updateReservation,
    deleteReservation,
    checkIn,
    checkOut,
    cancelReservation,
    refresh: fetchReservations,
  };
}
