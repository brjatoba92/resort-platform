export interface Reservation {
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

export interface ReservationEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  resourceId?: string;
  reservation: Reservation;
}
