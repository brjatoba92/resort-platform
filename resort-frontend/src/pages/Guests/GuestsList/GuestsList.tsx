import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Modal } from '../../../components/common';
import { GuestForm } from '../../../components/forms';
import { Layout } from '../../../components/layout';
import type { GuestData } from '../../../components/forms';
import styles from './GuestsList.module.css';

interface Guest extends GuestData {
  id: string;
  lastStay?: string;
  totalStays: number;
  totalSpent: number;
  status: 'active' | 'inactive' | 'blacklisted';
  vipStatus?: 'regular' | 'silver' | 'gold' | 'platinum';
}

export const GuestsList: React.FC = () => {
  const navigate = useNavigate();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  // Mock data - replace with actual API call
  const guests: Guest[] = [
    {
      id: '1',
      firstName: 'John',
      lastName: 'Smith',
      email: 'john.smith@example.com',
      phone: '+1 (555) 123-4567',
      address: '123 Main St',
      city: 'New York',
      country: 'USA',
      postalCode: '10001',
      idNumber: 'AB123456',
      idType: 'passport',
      lastStay: '2024-02-15',
      totalStays: 5,
      totalSpent: 2500,
      status: 'active',
      vipStatus: 'gold'
    },
    // Add more guests...
  ];

  const filteredGuests = guests.filter(guest => {
    const fullName = `${guest.firstName} ${guest.lastName}`.toLowerCase();
    const matchesSearch = 
      fullName.includes(searchTerm.toLowerCase()) ||
      guest.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      guest.phone.includes(searchTerm);
    const matchesStatus = filterStatus === 'all' || guest.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const handleAddGuest = (data: GuestData) => {
    // TODO: Implement guest creation logic
    console.log('New guest:', data);
    setIsAddModalOpen(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return styles.statusActive;
      case 'inactive':
        return styles.statusInactive;
      case 'blacklisted':
        return styles.statusBlacklisted;
      default:
        return '';
    }
  };

  const getVipStatusColor = (status?: string) => {
    switch (status) {
      case 'platinum':
        return styles.vipPlatinum;
      case 'gold':
        return styles.vipGold;
      case 'silver':
        return styles.vipSilver;
      default:
        return styles.vipRegular;
    }
  };

  return (
    <Layout>
      <div className={styles.guestsList}>
        <div className={styles.header}>
          <div className={styles.title}>
            <h1>Guests</h1>
            <Button
              variant="primary"
              onClick={() => setIsAddModalOpen(true)}
            >
              Add Guest
            </Button>
          </div>

          <div className={styles.filters}>
            <input
              type="text"
              placeholder="Search guests..."
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
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="blacklisted">Blacklisted</option>
            </select>
          </div>
        </div>

        <div className={styles.table}>
          <table>
            <thead>
              <tr>
                <th>Guest</th>
                <th>Contact</th>
                <th>Status</th>
                <th>Last Stay</th>
                <th>Total Stays</th>
                <th>Total Spent</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredGuests.map(guest => (
                <tr key={guest.id}>
                  <td>
                    <div className={styles.guest}>
                      <div className={styles.guestName}>
                        <span>{guest.firstName} {guest.lastName}</span>
                        {guest.vipStatus && (
                          <span className={`${styles.vipStatus} ${getVipStatusColor(guest.vipStatus)}`}>
                            {guest.vipStatus}
                          </span>
                        )}
                      </div>
                      <span className={styles.guestId}>ID: {guest.idNumber}</span>
                    </div>
                  </td>
                  <td>
                    <div className={styles.contact}>
                      <span className={styles.email}>{guest.email}</span>
                      <span className={styles.phone}>{guest.phone}</span>
                    </div>
                  </td>
                  <td>
                    <span className={`${styles.status} ${getStatusColor(guest.status)}`}>
                      {guest.status}
                    </span>
                  </td>
                  <td>{guest.lastStay || 'Never'}</td>
                  <td>{guest.totalStays}</td>
                  <td>
                    <span className={styles.amount}>
                      ${guest.totalSpent}
                    </span>
                  </td>
                  <td>
                    <button
                      className={styles.viewButton}
                      onClick={() => navigate(`/guests/${guest.id}`)}
                    >
                      View Profile
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <Modal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          title="Add Guest"
        >
          <GuestForm
            onSubmit={handleAddGuest}
            isLoading={false}
          />
        </Modal>
      </div>
    </Layout>
  );
};
