import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button, Modal } from '../../../components/common';
import { RoomForm } from '../../../components/forms';
import { Layout } from '../../../components/layout';
import type { RoomData } from '../../../components/forms';
import styles from './RoomDetails.module.css';

interface MaintenanceLog {
  date: string;
  type: string;
  description: string;
  technician: string;
  status: 'completed' | 'pending' | 'in-progress';
}

interface CleaningLog {
  date: string;
  staff: string;
  type: 'regular' | 'deep-clean';
  notes?: string;
}

interface Booking {
  id: string;
  guestName: string;
  checkIn: string;
  checkOut: string;
  status: 'confirmed' | 'checked-in' | 'checked-out' | 'cancelled';
}

export const RoomDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Mock data - replace with actual API call
  const room: RoomData & {
    id: string;
    maintenanceLogs: MaintenanceLog[];
    cleaningLogs: CleaningLog[];
    upcomingBookings: Booking[];
  } = {
    id: id || '',
    number: '101',
    type: 'Deluxe Ocean View',
    capacity: 2,
    price: 350,
    amenities: [
      'Ocean View',
      'King Bed',
      'Balcony',
      'Mini Bar',
      'Room Service',
      'Wi-Fi',
      'Air Conditioning'
    ],
    description: 'Luxurious room with panoramic ocean views and modern amenities.',
    status: 'available',
    maintenanceLogs: [
      {
        date: '2024-02-15',
        type: 'AC Service',
        description: 'Regular maintenance of AC unit',
        technician: 'John Doe',
        status: 'completed'
      }
    ],
    cleaningLogs: [
      {
        date: '2024-02-16',
        staff: 'Mary Smith',
        type: 'regular',
        notes: 'All standard cleaning procedures completed'
      }
    ],
    upcomingBookings: [
      {
        id: '1',
        guestName: 'Alice Johnson',
        checkIn: '2024-03-01',
        checkOut: '2024-03-05',
        status: 'confirmed'
      }
    ]
  };

  const handleEdit = (data: RoomData) => {
    // TODO: Implement room update logic
    console.log('Updated room:', data);
    setIsEditModalOpen(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return styles.statusCompleted;
      case 'pending':
        return styles.statusPending;
      case 'in-progress':
        return styles.statusInProgress;
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

  return (
    <Layout>
      <div className={styles.roomDetails}>
        <div className={styles.header}>
          <div className={styles.title}>
            <button
              className={styles.backButton}
              onClick={() => navigate('/rooms')}
            >
              ←
            </button>
            <h1>Room {room.number}</h1>
          </div>
          <Button
            variant="primary"
            onClick={() => setIsEditModalOpen(true)}
          >
            Edit Room
          </Button>
        </div>

        <div className={styles.content}>
          <div className={styles.mainInfo}>
            <div className={styles.card}>
              <h2>Room Information</h2>
              <div className={styles.info}>
                <div className={styles.infoItem}>
                  <span>Type:</span>
                  <span>{room.type}</span>
                </div>
                <div className={styles.infoItem}>
                  <span>Capacity:</span>
                  <span>{room.capacity} persons</span>
                </div>
                <div className={styles.infoItem}>
                  <span>Price:</span>
                  <span>${room.price}/night</span>
                </div>
                <div className={styles.infoItem}>
                  <span>Status:</span>
                  <span>{room.status}</span>
                </div>
              </div>
              <div className={styles.description}>
                <h3>Description</h3>
                <p>{room.description}</p>
              </div>
              <div className={styles.amenities}>
                <h3>Amenities</h3>
                <div className={styles.amenitiesList}>
                  {room.amenities.map((amenity, index) => (
                    <span key={index} className={styles.amenity}>
                      {amenity}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className={styles.card}>
              <h2>Upcoming Bookings</h2>
              <div className={styles.bookings}>
                {room.upcomingBookings.map(booking => (
                  <div key={booking.id} className={styles.booking}>
                    <div className={styles.bookingHeader}>
                      <h4>{booking.guestName}</h4>
                      <span className={`${styles.status} ${getStatusColor(booking.status)}`}>
                        {booking.status}
                      </span>
                    </div>
                    <div className={styles.bookingDates}>
                      <span>Check-in: {booking.checkIn}</span>
                      <span>Check-out: {booking.checkOut}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className={styles.sidebar}>
            <div className={styles.card}>
              <h2>Maintenance Log</h2>
              <div className={styles.logs}>
                {room.maintenanceLogs.map((log, index) => (
                  <div key={index} className={styles.log}>
                    <div className={styles.logHeader}>
                      <span className={styles.logDate}>{log.date}</span>
                      <span className={`${styles.status} ${getStatusColor(log.status)}`}>
                        {log.status}
                      </span>
                    </div>
                    <h4>{log.type}</h4>
                    <p>{log.description}</p>
                    <span className={styles.technician}>By: {log.technician}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className={styles.card}>
              <h2>Cleaning Log</h2>
              <div className={styles.logs}>
                {room.cleaningLogs.map((log, index) => (
                  <div key={index} className={styles.log}>
                    <div className={styles.logHeader}>
                      <span className={styles.logDate}>{log.date}</span>
                      <span className={styles.cleaningType}>{log.type}</span>
                    </div>
                    <span className={styles.staff}>By: {log.staff}</span>
                    {log.notes && <p>{log.notes}</p>}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <Modal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          title="Edit Room"
        >
          <RoomForm
            onSubmit={handleEdit}
            initialData={room}
            isLoading={false}
          />
        </Modal>
      </div>
    </Layout>
  );
};
