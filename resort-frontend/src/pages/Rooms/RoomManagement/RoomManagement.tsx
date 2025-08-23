import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNotification } from '../../../context/NotificationContext';
import styles from './RoomManagement.module.css';

interface Room {
  id: string;
  number: string;
  type: string;
  status: 'available' | 'occupied' | 'maintenance' | 'cleaning';
  currentGuest?: {
    name: string;
    checkIn: string;
    checkOut: string;
  };
  maintenance?: {
    issue: string;
    startDate: string;
    estimatedEndDate: string;
  };
  cleaning?: {
    startTime: string;
    estimatedEndTime: string;
  };
}

export const RoomManagement: React.FC = () => {
  const { t } = useTranslation();
  const { showNotification } = useNotification();
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: Replace with actual API call
    const fetchRooms = async () => {
      try {
        // Simulated data
        const mockRooms: Room[] = [
          {
            id: '1',
            number: '101',
            type: 'Standard',
            status: 'available',
          },
          {
            id: '2',
            number: '102',
            type: 'Deluxe',
            status: 'occupied',
            currentGuest: {
              name: 'John Doe',
              checkIn: '2024-08-20',
              checkOut: '2024-08-25',
            },
          },
          {
            id: '3',
            number: '103',
            type: 'Suite',
            status: 'maintenance',
            maintenance: {
              issue: 'AC Repair',
              startDate: '2024-08-22',
              estimatedEndDate: '2024-08-23',
            },
          },
          {
            id: '4',
            number: '104',
            type: 'Standard',
            status: 'cleaning',
            cleaning: {
              startTime: '2024-08-22T14:00:00',
              estimatedEndTime: '2024-08-22T15:00:00',
            },
          },
        ];

        setRooms(mockRooms);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching rooms:', error);
        showNotification({
          type: 'error',
          title: t('rooms.management.error.title'),
          message: t('rooms.management.error.fetch'),
        });
      }
    };

    fetchRooms();

    // TODO: Replace with actual WebSocket connection
    const mockWebSocket = {
      onmessage: (callback: (event: { data: string }) => void) => {
        // Simulate room status updates
        const interval = setInterval(() => {
          const roomIndex = Math.floor(Math.random() * rooms.length);
          const statusOptions: Room['status'][] = ['available', 'occupied', 'maintenance', 'cleaning'];
          const newStatus = statusOptions[Math.floor(Math.random() * statusOptions.length)];

          const updatedRooms = [...rooms];
          if (updatedRooms[roomIndex]) {
            updatedRooms[roomIndex] = {
              ...updatedRooms[roomIndex],
              status: newStatus,
            };
            callback({
              data: JSON.stringify({
                type: 'room_update',
                room: updatedRooms[roomIndex],
              }),
            });
          }
        }, 10000);

        return () => clearInterval(interval);
      },
    };

    const cleanup = mockWebSocket.onmessage((event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === 'room_update') {
          setRooms((prevRooms) =>
            prevRooms.map((room) =>
              room.id === data.room.id ? { ...room, ...data.room } : room
            )
          );

          showNotification({
            type: 'info',
            title: t('rooms.management.notification.statusUpdate'),
            message: t('rooms.management.notification.roomUpdated', {
              room: data.room.number,
              status: data.room.status,
            }),
          });
        }
      } catch (error) {
        console.error('Error handling room update:', error);
      }
    });

    return () => {
      cleanup();
    };
  }, [showNotification, t]);

  if (loading) {
    return (
      <div className={styles.loading}>
        <div className={styles.loadingSpinner}></div>
      </div>
    );
  }

  const getStatusClass = (status: Room['status']) => {
    switch (status) {
      case 'available':
        return styles.statusAvailable;
      case 'occupied':
        return styles.statusOccupied;
      case 'maintenance':
        return styles.statusMaintenance;
      case 'cleaning':
        return styles.statusCleaning;
      default:
        return '';
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.header}>{t('rooms.management.title')}</h1>
      <div className={styles.roomGrid}>
        {rooms.map((room) => (
          <div key={room.id} className={styles.roomCard}>
            <div className={styles.roomContent}>
              <div className={styles.roomHeader}>
                <h2 className={styles.roomNumber}>
                  {t('rooms.management.roomNumber', { number: room.number })}
                </h2>
                <span className={`${styles.statusBadge} ${getStatusClass(room.status)}`}>
                  {t(`rooms.management.status.${room.status}`)}
                </span>
              </div>
              <p className={styles.roomType}>{room.type}</p>
              {room.currentGuest && (
                <div className={styles.infoSection}>
                  <h3 className={styles.infoTitle}>{t('rooms.management.currentGuest')}</h3>
                  <p>{room.currentGuest.name}</p>
                  <p className={styles.infoText}>
                    {t('rooms.management.checkIn')}: {room.currentGuest.checkIn}
                  </p>
                  <p className={styles.infoText}>
                    {t('rooms.management.checkOut')}: {room.currentGuest.checkOut}
                  </p>
                </div>
              )}
              {room.maintenance && (
                <div className={styles.infoSection}>
                  <h3 className={styles.infoTitle}>{t('rooms.management.maintenance')}</h3>
                  <p>{room.maintenance.issue}</p>
                  <p className={styles.infoText}>
                    {t('rooms.management.startDate')}: {room.maintenance.startDate}
                  </p>
                  <p className={styles.infoText}>
                    {t('rooms.management.estimatedEndDate')}: {room.maintenance.estimatedEndDate}
                  </p>
                </div>
              )}
              {room.cleaning && (
                <div className={styles.infoSection}>
                  <h3 className={styles.infoTitle}>{t('rooms.management.cleaning')}</h3>
                  <p className={styles.infoText}>
                    {t('rooms.management.startTime')}: {room.cleaning.startTime}
                  </p>
                  <p className={styles.infoText}>
                    {t('rooms.management.estimatedEndTime')}: {room.cleaning.estimatedEndTime}
                  </p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};