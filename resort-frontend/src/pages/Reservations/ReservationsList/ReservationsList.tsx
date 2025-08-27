import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Modal } from '../../../components/common';
import { BookingForm } from '../../../components/forms';
import { Layout } from '../../../components/layout';
import type { BookingData } from '../../../components/forms';
import styles from './ReservationsList.module.css';

interface Reservation {
  id: string;
  guestName: string;
  roomNumber: string;
  roomType: string;
  checkIn: string;
  checkOut: string;
  status: 'confirmed' | 'checked-in' | 'checked-out' | 'cancelled';
  totalAmount: number;
  paymentStatus: 'pending' | 'partial' | 'paid';
  specialRequests?: string;
  adults: number;
  children: number;
}

export const ReservationsList: React.FC = () => {
  const navigate = useNavigate();
  const [isNewBookingModalOpen, setIsNewBookingModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [dateRange, setDateRange] = useState({
    start: '',
    end: ''
  });

  // Mock data - replace with actual API call
  const reservations: Reservation[] = [
    {
      id: '1',
      guestName: 'John Smith',
      roomNumber: '101',
      roomType: 'Deluxe Ocean View',
      checkIn: '2024-03-01',
      checkOut: '2024-03-05',
      status: 'confirmed',
      totalAmount: 1750,
      paymentStatus: 'paid',
      adults: 2,
      children: 1,
      specialRequests: 'Early check-in requested'
    },
    // Add more reservations...
  ];

  const filteredReservations = reservations.filter(reservation => {
    const matchesSearch = 
      reservation.guestName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reservation.roomNumber.includes(searchTerm);
    const matchesStatus = filterStatus === 'all' || reservation.status === filterStatus;
    const matchesDate = (!dateRange.start || reservation.checkIn >= dateRange.start) &&
      (!dateRange.end || reservation.checkOut <= dateRange.end);
    return matchesSearch && matchesStatus && matchesDate;
  });

  const handleNewBooking = (data: BookingData) => {
    // TODO: Implement booking creation logic
    console.log('New booking:', data);
    setIsNewBookingModalOpen(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return styles.statusConfirmed;
      case 'checked-in':
        return styles.statusCheckedIn;
      case 'checked-out':
        return styles.statusCheckedOut;
      case 'cancelled':
        return styles.statusCancelled;
      default:
        return '';
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return styles.paymentPaid;
      case 'partial':
        return styles.paymentPartial;
      case 'pending':
        return styles.paymentPending;
      default:
        return '';
    }
  };

  return (
    <Layout>
      <div className={styles.reservationsList}>
        <div className={styles.header}>
          <div className={styles.title}>
            <h1>Reservations</h1>
            <Button
              variant="primary"
              onClick={() => setIsNewBookingModalOpen(true)}
            >
              New Booking
            </Button>
          </div>

          <div className={styles.filters}>
            <input
              type="text"
              placeholder="Search guest or room..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={styles.searchInput}
            />

            <div className={styles.dateFilters}>
              <input
                type="date"
                value={dateRange.start}
                onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
                className={styles.dateInput}
              />
              <span>to</span>
              <input
                type="date"
                value={dateRange.end}
                onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
                className={styles.dateInput}
              />
            </div>

            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className={styles.statusFilter}
            >
              <option value="all">All Status</option>
              <option value="confirmed">Confirmed</option>
              <option value="checked-in">Checked In</option>
              <option value="checked-out">Checked Out</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>

        <div className={styles.table}>
          <table>
            <thead>
              <tr>
                <th>Guest</th>
                <th>Room</th>
                <th>Check In</th>
                <th>Check Out</th>
                <th>Status</th>
                <th>Payment</th>
                <th>Amount</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredReservations.map(reservation => (
                <tr key={reservation.id}>
                  <td>
                    <div className={styles.guest}>
                      <span className={styles.guestName}>{reservation.guestName}</span>
                      <span className={styles.guestDetails}>
                        {reservation.adults} adults, {reservation.children} children
                      </span>
                    </div>
                  </td>
                  <td>
                    <div className={styles.room}>
                      <span className={styles.roomNumber}>Room {reservation.roomNumber}</span>
                      <span className={styles.roomType}>{reservation.roomType}</span>
                    </div>
                  </td>
                  <td>{reservation.checkIn}</td>
                  <td>{reservation.checkOut}</td>
                  <td>
                    <span className={`${styles.status} ${getStatusColor(reservation.status)}`}>
                      {reservation.status}
                    </span>
                  </td>
                  <td>
                    <span className={`${styles.paymentStatus} ${getPaymentStatusColor(reservation.paymentStatus)}`}>
                      {reservation.paymentStatus}
                    </span>
                  </td>
                  <td>
                    <span className={styles.amount}>
                      ${reservation.totalAmount}
                    </span>
                  </td>
                  <td>
                    <button
                      className={styles.viewButton}
                      onClick={() => navigate(`/reservations/${reservation.id}`)}
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <Modal
          isOpen={isNewBookingModalOpen}
          onClose={() => setIsNewBookingModalOpen(false)}
          title="New Booking"
        >
          <BookingForm
            onSubmit={handleNewBooking}
            isLoading={false}
            availableRooms={[
              {
                id: '1',
                number: '101',
                type: 'Deluxe Ocean View',
                price: 350
              }
            ]}
          />
        </Modal>
      </div>
    </Layout>
  );
};
