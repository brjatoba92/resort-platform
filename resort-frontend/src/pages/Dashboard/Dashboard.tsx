import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  StatsCards,
  RoomsTable,
  ConsumptionTracker,
  WeatherWidget,
  CheckInOutModal
} from '../../components/dashboard';
import { Layout } from '../../components/layout';
import styles from './Dashboard.module.css';

const stats = [
  {
    title: 'Total Bookings',
    value: '156',
    change: {
      value: 12,
      type: 'increase'
    },
    icon: '📊'
  },
  {
    title: 'Occupancy Rate',
    value: '78%',
    change: {
      value: 5,
      type: 'increase'
    },
    icon: '🏨'
  },
  {
    title: 'Average Stay',
    value: '4.2 days',
    change: {
      value: 0.3,
      type: 'decrease'
    },
    icon: '📅'
  },
  {
    title: 'Revenue',
    value: '$45,678',
    change: {
      value: 8,
      type: 'increase'
    },
    icon: '💰'
  }
];

const rooms = [
  {
    number: '101',
    type: 'Deluxe Ocean View',
    status: 'available',
    guest: null,
    checkIn: null,
    checkOut: null
  },
  {
    number: '102',
    type: 'Suite',
    status: 'occupied',
    guest: 'John Smith',
    checkIn: '2024-02-15',
    checkOut: '2024-02-20'
  },
  // Add more rooms...
];

const consumption = [
  {
    type: 'Electricity',
    current: 450,
    total: 600,
    unit: 'kWh'
  },
  {
    type: 'Water',
    current: 2800,
    total: 4000,
    unit: 'L'
  },
  {
    type: 'Gas',
    current: 150,
    total: 300,
    unit: 'm³'
  }
];

const weatherData = {
  temperature: 28,
  condition: 'sunny',
  humidity: 65,
  windSpeed: 12,
  forecast: [
    { day: 'Mon', temperature: 28, condition: 'sunny' },
    { day: 'Tue', temperature: 27, condition: 'cloudy' },
    { day: 'Wed', temperature: 25, condition: 'rainy' },
    { day: 'Thu', temperature: 26, condition: 'cloudy' },
    { day: 'Fri', temperature: 29, condition: 'sunny' }
  ]
};

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [isCheckInModalOpen, setIsCheckInModalOpen] = useState(false);
  const [isCheckOutModalOpen, setIsCheckOutModalOpen] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<string>('');

  const handleCheckIn = (roomNumber: string) => {
    setSelectedRoom(roomNumber);
    setIsCheckInModalOpen(true);
  };

  const handleCheckOut = (roomNumber: string) => {
    setSelectedRoom(roomNumber);
    setIsCheckOutModalOpen(true);
  };

  const handleCheckInSubmit = (guestData: any) => {
    // TODO: Implement check-in logic
    console.log('Check-in:', { room: selectedRoom, guest: guestData });
    setIsCheckInModalOpen(false);
  };

  const handleCheckOutSubmit = (guestData: any) => {
    // TODO: Implement check-out logic
    console.log('Check-out:', { room: selectedRoom, guest: guestData });
    setIsCheckOutModalOpen(false);
  };

  return (
    <Layout>
      <div className={styles.dashboard}>
        <div className={styles.header}>
          <h1>Dashboard</h1>
        </div>

        <div className={styles.stats}>
          <StatsCards stats={stats} />
        </div>

        <div className={styles.mainContent}>
          <div className={styles.roomsSection}>
            <div className={styles.sectionHeader}>
              <h2>Room Status</h2>
              <button onClick={() => navigate('/rooms')}>View All</button>
            </div>
            <RoomsTable
              rooms={rooms}
              onCheckIn={handleCheckIn}
              onCheckOut={handleCheckOut}
            />
          </div>

          <div className={styles.sidebar}>
            <WeatherWidget
              data={weatherData}
              location="Resort Location"
            />
            <ConsumptionTracker data={consumption} />
          </div>
        </div>

        <CheckInOutModal
          isOpen={isCheckInModalOpen}
          onClose={() => setIsCheckInModalOpen(false)}
          type="check-in"
          roomNumber={selectedRoom}
          onSubmit={handleCheckInSubmit}
        />

        <CheckInOutModal
          isOpen={isCheckOutModalOpen}
          onClose={() => setIsCheckOutModalOpen(false)}
          type="check-out"
          roomNumber={selectedRoom}
          onSubmit={handleCheckOutSubmit}
        />
      </div>
    </Layout>
  );
};
