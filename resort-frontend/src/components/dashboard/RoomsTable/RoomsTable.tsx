import React, { useState } from 'react';
import { Button } from '../../common/Button';
import styles from './RoomsTable.module.css';

interface Room {
  number: string;
  type: string;
  status: 'available' | 'occupied' | 'maintenance' | 'cleaning';
  guest?: string;
  checkIn?: string;
  checkOut?: string;
}

export interface RoomsTableProps {
  rooms: Room[];
  onCheckIn: (roomNumber: string) => void;
  onCheckOut: (roomNumber: string) => void;
}

export const RoomsTable: React.FC<RoomsTableProps> = ({
  rooms,
  onCheckIn,
  onCheckOut
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<Room['status'] | 'all'>('all');

  const filteredRooms = rooms.filter(room => {
    const matchesSearch = room.number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (room.guest?.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesFilter = filter === 'all' || room.status === filter;
    return matchesSearch && matchesFilter;
  });

  const getStatusColor = (status: Room['status']) => {
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
      <div className={styles.header}>
        <div className={styles.search}>
          <input
            type="text"
            placeholder="Search rooms or guests..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className={styles.filters}>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as Room['status'] | 'all')}
          >
            <option value="all">All Status</option>
            <option value="available">Available</option>
            <option value="occupied">Occupied</option>
            <option value="maintenance">Maintenance</option>
            <option value="cleaning">Cleaning</option>
          </select>
        </div>
      </div>

      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Room</th>
              <th>Type</th>
              <th>Status</th>
              <th>Guest</th>
              <th>Check In</th>
              <th>Check Out</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredRooms.map((room) => (
              <tr key={room.number}>
                <td>{room.number}</td>
                <td>{room.type}</td>
                <td>
                  <span className={`${styles.status} ${getStatusColor(room.status)}`}>
                    {room.status}
                  </span>
                </td>
                <td>{room.guest || '-'}</td>
                <td>{room.checkIn || '-'}</td>
                <td>{room.checkOut || '-'}</td>
                <td>
                  {room.status === 'available' && (
                    <Button
                      size="small"
                      onClick={() => onCheckIn(room.number)}
                    >
                      Check In
                    </Button>
                  )}
                  {room.status === 'occupied' && (
                    <Button
                      size="small"
                      variant="secondary"
                      onClick={() => onCheckOut(room.number)}
                    >
                      Check Out
                    </Button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
