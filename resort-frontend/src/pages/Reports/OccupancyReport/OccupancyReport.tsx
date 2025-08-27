import React, { useState } from 'react';
import { Layout } from '../../../components/layout';
import styles from './OccupancyReport.module.css';

interface OccupancyData {
  date: string;
  totalRooms: number;
  occupiedRooms: number;
  occupancyRate: number;
  avgDailyRate: number;
  revPAR: number;
}

interface RoomTypeOccupancy {
  type: string;
  totalRooms: number;
  occupiedRooms: number;
  occupancyRate: number;
  avgRate: number;
}

interface ForecastData {
  date: string;
  predictedOccupancy: number;
  confirmedBookings: number;
  potentialRevenue: number;
}

export const OccupancyReport: React.FC = () => {
  const [dateRange, setDateRange] = useState({
    start: '',
    end: ''
  });

  // Mock data - replace with actual API call
  const dailyOccupancy: OccupancyData[] = [
    {
      date: '2024-02-15',
      totalRooms: 100,
      occupiedRooms: 78,
      occupancyRate: 78,
      avgDailyRate: 350,
      revPAR: 273
    },
    // Add more daily data...
  ];

  const roomTypeStats: RoomTypeOccupancy[] = [
    {
      type: 'Deluxe Ocean View',
      totalRooms: 40,
      occupiedRooms: 35,
      occupancyRate: 87.5,
      avgRate: 450
    },
    {
      type: 'Standard Room',
      totalRooms: 30,
      occupiedRooms: 20,
      occupancyRate: 66.67,
      avgRate: 250
    },
    {
      type: 'Suite',
      totalRooms: 20,
      occupiedRooms: 15,
      occupancyRate: 75,
      avgRate: 650
    },
    {
      type: 'Family Room',
      totalRooms: 10,
      occupiedRooms: 8,
      occupancyRate: 80,
      avgRate: 350
    }
  ];

  const forecast: ForecastData[] = [
    {
      date: '2024-03-01',
      predictedOccupancy: 85,
      confirmedBookings: 65,
      potentialRevenue: 28000
    },
    // Add more forecast data...
  ];

  const totalRooms = roomTypeStats.reduce((sum, type) => sum + type.totalRooms, 0);
  const occupiedRooms = roomTypeStats.reduce((sum, type) => sum + type.occupiedRooms, 0);
  const currentOccupancyRate = (occupiedRooms / totalRooms) * 100;
  const avgDailyRate = dailyOccupancy.reduce((sum, day) => sum + day.avgDailyRate, 0) / dailyOccupancy.length;

  const getOccupancyRateColor = (rate: number) => {
    if (rate >= 80) return styles.high;
    if (rate >= 60) return styles.medium;
    return styles.low;
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatPercentage = (value: number) => {
    return `${value.toFixed(1)}%`;
  };

  return (
    <Layout>
      <div className={styles.occupancyReport}>
        <div className={styles.header}>
          <h1>Occupancy Report</h1>
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
        </div>

        <div className={styles.summary}>
          <div className={styles.summaryCard}>
            <h3>Current Occupancy Rate</h3>
            <span className={`${styles.rate} ${getOccupancyRateColor(currentOccupancyRate)}`}>
              {formatPercentage(currentOccupancyRate)}
            </span>
            <span className={styles.details}>
              {occupiedRooms} of {totalRooms} rooms
            </span>
          </div>
          <div className={styles.summaryCard}>
            <h3>Average Daily Rate</h3>
            <span className={styles.rate}>{formatCurrency(avgDailyRate)}</span>
            <span className={styles.details}>per room</span>
          </div>
          <div className={styles.summaryCard}>
            <h3>RevPAR</h3>
            <span className={styles.rate}>
              {formatCurrency(avgDailyRate * (currentOccupancyRate / 100))}
            </span>
            <span className={styles.details}>per available room</span>
          </div>
        </div>

        <div className={styles.content}>
          <div className={styles.mainSection}>
            <div className={styles.card}>
              <h2>Daily Occupancy</h2>
              <div className={styles.table}>
                <table>
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Occupied Rooms</th>
                      <th>Total Rooms</th>
                      <th>Occupancy Rate</th>
                      <th>ADR</th>
                      <th>RevPAR</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dailyOccupancy.map(day => (
                      <tr key={day.date}>
                        <td>{day.date}</td>
                        <td>{day.occupiedRooms}</td>
                        <td>{day.totalRooms}</td>
                        <td>
                          <span className={`${styles.occupancyRate} ${getOccupancyRateColor(day.occupancyRate)}`}>
                            {formatPercentage(day.occupancyRate)}
                          </span>
                        </td>
                        <td>{formatCurrency(day.avgDailyRate)}</td>
                        <td>{formatCurrency(day.revPAR)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div className={styles.sidebar}>
            <div className={styles.card}>
              <h2>Room Type Statistics</h2>
              <div className={styles.roomTypes}>
                {roomTypeStats.map(room => (
                  <div key={room.type} className={styles.roomType}>
                    <div className={styles.roomTypeHeader}>
                      <h4>{room.type}</h4>
                      <span className={`${styles.occupancyRate} ${getOccupancyRateColor(room.occupancyRate)}`}>
                        {formatPercentage(room.occupancyRate)}
                      </span>
                    </div>
                    <div className={styles.roomTypeDetails}>
                      <div className={styles.roomTypeInfo}>
                        <span>Rooms</span>
                        <span>{room.occupiedRooms} of {room.totalRooms}</span>
                      </div>
                      <div className={styles.roomTypeInfo}>
                        <span>Average Rate</span>
                        <span>{formatCurrency(room.avgRate)}</span>
                      </div>
                    </div>
                    <div className={styles.occupancyBar}>
                      <div
                        className={`${styles.bar} ${getOccupancyRateColor(room.occupancyRate)}`}
                        style={{ width: `${room.occupancyRate}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className={styles.card}>
              <h2>Occupancy Forecast</h2>
              <div className={styles.forecast}>
                {forecast.map(day => (
                  <div key={day.date} className={styles.forecastDay}>
                    <div className={styles.forecastHeader}>
                      <h4>{day.date}</h4>
                      <span className={`${styles.occupancyRate} ${getOccupancyRateColor(day.predictedOccupancy)}`}>
                        {formatPercentage(day.predictedOccupancy)}
                      </span>
                    </div>
                    <div className={styles.forecastDetails}>
                      <div className={styles.forecastInfo}>
                        <span>Confirmed Bookings</span>
                        <span>{formatPercentage(day.confirmedBookings)}%</span>
                      </div>
                      <div className={styles.forecastInfo}>
                        <span>Potential Revenue</span>
                        <span>{formatCurrency(day.potentialRevenue)}</span>
                      </div>
                    </div>
                    <div className={styles.forecastBars}>
                      <div className={styles.barContainer}>
                        <div
                          className={styles.confirmedBar}
                          style={{ width: `${day.confirmedBookings}%` }}
                        />
                        <div
                          className={styles.predictedBar}
                          style={{ width: `${day.predictedOccupancy}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};
