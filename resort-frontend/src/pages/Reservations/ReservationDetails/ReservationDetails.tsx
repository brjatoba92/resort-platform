import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button, Modal } from '../../../components/common';
import { BookingForm } from '../../../components/forms';
import { Layout } from '../../../components/layout';
import type { BookingData } from '../../../components/forms';
import styles from './ReservationDetails.module.css';

interface Payment {
  id: string;
  date: string;
  amount: number;
  method: string;
  status: 'completed' | 'pending' | 'failed';
  reference?: string;
}

interface ServiceCharge {
  id: string;
  date: string;
  service: string;
  amount: number;
  status: 'charged' | 'pending' | 'refunded';
}

interface Note {
  id: string;
  date: string;
  author: string;
  content: string;
  type: 'general' | 'important' | 'system';
}

export const ReservationDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Mock data - replace with actual API call
  const reservation = {
    id: id || '',
    guestName: 'John Smith',
    roomNumber: '101',
    roomType: 'Deluxe Ocean View',
    checkIn: '2024-03-01',
    checkOut: '2024-03-05',
    status: 'confirmed',
    totalAmount: 1750,
    paymentStatus: 'partial',
    adults: 2,
    children: 1,
    specialRequests: 'Early check-in requested',
    payments: [
      {
        id: '1',
        date: '2024-02-15',
        amount: 875,
        method: 'Credit Card',
        status: 'completed',
        reference: 'TXN123456'
      }
    ] as Payment[],
    serviceCharges: [
      {
        id: '1',
        date: '2024-03-02',
        service: 'Room Service',
        amount: 50,
        status: 'charged'
      }
    ] as ServiceCharge[],
    notes: [
      {
        id: '1',
        date: '2024-02-15',
        author: 'Reception Staff',
        content: 'Guest requested extra pillows',
        type: 'general'
      }
    ] as Note[]
  };

  const handleEdit = (data: BookingData) => {
    // TODO: Implement reservation update logic
    console.log('Updated reservation:', data);
    setIsEditModalOpen(false);
  };

  const handleAddNote = () => {
    // TODO: Implement note addition logic
  };

  const handleAddCharge = () => {
    // TODO: Implement service charge addition logic
  };

  const handleAddPayment = () => {
    // TODO: Implement payment addition logic
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
      case 'completed':
        return styles.statusCompleted;
      case 'pending':
        return styles.statusPending;
      case 'failed':
        return styles.statusFailed;
      case 'charged':
        return styles.statusCharged;
      case 'refunded':
        return styles.statusRefunded;
      default:
        return '';
    }
  };

  const getNoteTypeColor = (type: string) => {
    switch (type) {
      case 'important':
        return styles.noteImportant;
      case 'system':
        return styles.noteSystem;
      default:
        return styles.noteGeneral;
    }
  };

  return (
    <Layout>
      <div className={styles.reservationDetails}>
        <div className={styles.header}>
          <div className={styles.title}>
            <button
              className={styles.backButton}
              onClick={() => navigate('/reservations')}
            >
              ←
            </button>
            <div>
              <h1>Reservation Details</h1>
              <p className={styles.subtitle}>Booking #{reservation.id}</p>
            </div>
          </div>
          <Button
            variant="primary"
            onClick={() => setIsEditModalOpen(true)}
          >
            Edit Reservation
          </Button>
        </div>

        <div className={styles.content}>
          <div className={styles.mainInfo}>
            <div className={styles.card}>
              <h2>Guest Information</h2>
              <div className={styles.info}>
                <div className={styles.infoItem}>
                  <span>Guest Name</span>
                  <span>{reservation.guestName}</span>
                </div>
                <div className={styles.infoItem}>
                  <span>Room</span>
                  <span>Room {reservation.roomNumber} - {reservation.roomType}</span>
                </div>
                <div className={styles.infoItem}>
                  <span>Check In</span>
                  <span>{reservation.checkIn}</span>
                </div>
                <div className={styles.infoItem}>
                  <span>Check Out</span>
                  <span>{reservation.checkOut}</span>
                </div>
                <div className={styles.infoItem}>
                  <span>Guests</span>
                  <span>{reservation.adults} adults, {reservation.children} children</span>
                </div>
                <div className={styles.infoItem}>
                  <span>Status</span>
                  <span className={`${styles.status} ${getStatusColor(reservation.status)}`}>
                    {reservation.status}
                  </span>
                </div>
              </div>
              {reservation.specialRequests && (
                <div className={styles.specialRequests}>
                  <h3>Special Requests</h3>
                  <p>{reservation.specialRequests}</p>
                </div>
              )}
            </div>

            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <h2>Payments</h2>
                <Button
                  variant="secondary"
                  size="small"
                  onClick={handleAddPayment}
                >
                  Add Payment
                </Button>
              </div>
              <div className={styles.payments}>
                {reservation.payments.map(payment => (
                  <div key={payment.id} className={styles.payment}>
                    <div className={styles.paymentHeader}>
                      <span className={styles.paymentDate}>{payment.date}</span>
                      <span className={`${styles.status} ${getStatusColor(payment.status)}`}>
                        {payment.status}
                      </span>
                    </div>
                    <div className={styles.paymentDetails}>
                      <span>{payment.method}</span>
                      <span className={styles.amount}>${payment.amount}</span>
                    </div>
                    {payment.reference && (
                      <span className={styles.reference}>Ref: {payment.reference}</span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <h2>Service Charges</h2>
                <Button
                  variant="secondary"
                  size="small"
                  onClick={handleAddCharge}
                >
                  Add Charge
                </Button>
              </div>
              <div className={styles.charges}>
                {reservation.serviceCharges.map(charge => (
                  <div key={charge.id} className={styles.charge}>
                    <div className={styles.chargeHeader}>
                      <span className={styles.chargeDate}>{charge.date}</span>
                      <span className={`${styles.status} ${getStatusColor(charge.status)}`}>
                        {charge.status}
                      </span>
                    </div>
                    <div className={styles.chargeDetails}>
                      <span>{charge.service}</span>
                      <span className={styles.amount}>${charge.amount}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className={styles.sidebar}>
            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <h2>Notes</h2>
                <Button
                  variant="secondary"
                  size="small"
                  onClick={handleAddNote}
                >
                  Add Note
                </Button>
              </div>
              <div className={styles.notes}>
                {reservation.notes.map(note => (
                  <div key={note.id} className={styles.note}>
                    <div className={styles.noteHeader}>
                      <span className={styles.noteDate}>{note.date}</span>
                      <span className={`${styles.noteType} ${getNoteTypeColor(note.type)}`}>
                        {note.type}
                      </span>
                    </div>
                    <p className={styles.noteContent}>{note.content}</p>
                    <span className={styles.noteAuthor}>By: {note.author}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <Modal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          title="Edit Reservation"
        >
          <BookingForm
            onSubmit={handleEdit}
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
