import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Modal } from '../../../components/common';
import { RoomForm } from '../../../components/forms';
import { Layout } from '../../../components/layout';
import type { RoomData } from '../../../components/forms';
import styles from './RoomsList.module.css';

interface Room extends RoomData {
  id: string;
  lastCleaned?: string;
  maintenanceStatus?: 'good' | 'needs-attention' | 'maintenance-required';
}

export const RoomsList: React.FC = () => {
  const navigate = useNavigate();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  // Mock data - replace with actual API call
  const rooms: Room[] = [
    {
      id: '1',
      number: '101',
      type: 'Deluxe Ocean View',
      capacity: 2,
      price: 350,
      amenities: ['Ocean View', 'King Bed', 'Balcony', 'Mini Bar'],
      description: 'Luxurious room with panoramic ocean views',
      status: 'available',
      lastCleaned: '2024-02-15',
      maintenanceStatus: 'good'
    },
    // Add more rooms...
  ];

  const filteredRooms = rooms.filter(room => {
    const matchesSearch = 
      room.number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      room.type.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || room.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const handleAddRoom = (data: RoomData) => {
    // TODO: Implement room creation logic
    console.log('New room:', data);
    setIsAddModalOpen(false);
  };

  const getStatusColor = (status: string) => {
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

  const getMaintenanceStatusColor = (status: string) => {
    switch (status) {
      case 'good':
        return styles.maintenanceGood;
      case 'needs-attention':
        return styles.maintenanceWarning;
      case 'maintenance-required':
        return styles.maintenanceDanger;
      default:
        return '';
    }
  };

  return (
    <Layout>
      <div className={styles.roomsList}>
        <div className={styles.header}>
          <div className={styles.title}>
            <h1>Rooms Management</h1>
            <Button
              variant="primary"
              onClick={() => setIsAddModalOpen(true)}
            >
              Add New Room
            </Button>
          </div>

          <div className={styles.filters}>
            <input
              type="text"
              placeholder="Search rooms..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={styles.searchInput}
            />

            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className={styles.statusFilter}
            >
              <option value="all">All Status</option>
              <option value="available">Available</option>
              <option value="occupied">Occupied</option>
              <option value="maintenance">Maintenance</option>
              <option value="cleaning">Cleaning</option>
            </select>
          </div>
        </div>

        <div className={styles.grid}>
          {filteredRooms.map(room => (
            <div
              key={room.id}
              className={styles.roomCard}
              onClick={() => navigate(`/rooms/${room.id}`)}
            >
              <div className={styles.roomHeader}>
                <h3>Room {room.number}</h3>
                <span className={`${styles.status} ${getStatusColor(room.status)}`}>
                  {room.status}
                </span>
              </div>

              <div className={styles.roomInfo}>
                <p className={styles.type}>{room.type}</p>
                <p className={styles.price}>${room.price}/night</p>
              </div>

              <div className={styles.amenities}>
                {room.amenities.slice(0, 3).map((amenity, index) => (
                  <span key={index} className={styles.amenity}>
                    {amenity}
                  </span>
                ))}
                {room.amenities.length > 3 && (
                  <span className={styles.amenity}>
                    +{room.amenities.length - 3} more
                  </span>
                )}
              </div>

              <div className={styles.maintenance}>
                <div className={styles.maintenanceItem}>
                  <span>Last Cleaned:</span>
                  <span>{room.lastCleaned}</span>
                </div>
                <div className={styles.maintenanceItem}>
                  <span>Maintenance:</span>
                  <span className={getMaintenanceStatusColor(room.maintenanceStatus || '')}>
                    {room.maintenanceStatus?.replace('-', ' ')}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <Modal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          title="Add New Room"
        >
          <RoomForm
            onSubmit={handleAddRoom}
            isLoading={false}
          />
        </Modal>
      </div>
    </Layout>
  );
};
