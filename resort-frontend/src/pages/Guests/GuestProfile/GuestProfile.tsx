import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button, Modal } from '../../../components/common';
import { GuestForm } from '../../../components/forms';
import { Layout } from '../../../components/layout';
import type { GuestData } from '../../../components/forms';
import styles from './GuestProfile.module.css';

interface Stay {
  id: string;
  roomNumber: string;
  roomType: string;
  checkIn: string;
  checkOut: string;
  totalAmount: number;
  status: 'upcoming' | 'current' | 'completed' | 'cancelled';
}

interface Preference {
  id: string;
  category: string;
  description: string;
}

interface Note {
  id: string;
  date: string;
  author: string;
  content: string;
  type: 'general' | 'important' | 'system';
}

export const GuestProfile: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Mock data - replace with actual API call
  const guest = {
    id: id || '',
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
    status: 'active',
    vipStatus: 'gold',
    totalStays: 5,
    totalSpent: 2500,
    stays: [
      {
        id: '1',
        roomNumber: '101',
        roomType: 'Deluxe Ocean View',
        checkIn: '2024-02-15',
        checkOut: '2024-02-20',
        totalAmount: 1750,
        status: 'completed'
      }
    ] as Stay[],
    preferences: [
      {
        id: '1',
        category: 'Room',
        description: 'Prefers high floor with ocean view'
      },
      {
        id: '2',
        category: 'Dining',
        description: 'Vegetarian diet'
      }
    ] as Preference[],
    notes: [
      {
        id: '1',
        date: '2024-02-15',
        author: 'Reception Staff',
        content: 'Guest always tips housekeeping generously',
        type: 'general'
      }
    ] as Note[]
  };

  const handleEdit = (data: GuestData) => {
    // TODO: Implement guest update logic
    console.log('Updated guest:', data);
    setIsEditModalOpen(false);
  };

  const handleAddNote = () => {
    // TODO: Implement note addition logic
  };

  const handleAddPreference = () => {
    // TODO: Implement preference addition logic
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return styles.statusActive;
      case 'inactive':
        return styles.statusInactive;
      case 'blacklisted':
        return styles.statusBlacklisted;
      case 'upcoming':
        return styles.statusUpcoming;
      case 'current':
        return styles.statusCurrent;
      case 'completed':
        return styles.statusCompleted;
      case 'cancelled':
        return styles.statusCancelled;
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
      <div className={styles.guestProfile}>
        <div className={styles.header}>
          <div className={styles.title}>
            <button
              className={styles.backButton}
              onClick={() => navigate('/guests')}
            >
              ←
            </button>
            <div>
              <div className={styles.guestName}>
                <h1>{guest.firstName} {guest.lastName}</h1>
                {guest.vipStatus && (
                  <span className={`${styles.vipStatus} ${getVipStatusColor(guest.vipStatus)}`}>
                    {guest.vipStatus}
                  </span>
                )}
              </div>
              <p className={styles.subtitle}>Guest ID: {guest.idNumber}</p>
            </div>
          </div>
          <Button
            variant="primary"
            onClick={() => setIsEditModalOpen(true)}
          >
            Edit Profile
          </Button>
        </div>

        <div className={styles.content}>
          <div className={styles.mainInfo}>
            <div className={styles.card}>
              <h2>Personal Information</h2>
              <div className={styles.info}>
                <div className={styles.infoItem}>
                  <span>Email</span>
                  <span>{guest.email}</span>
                </div>
                <div className={styles.infoItem}>
                  <span>Phone</span>
                  <span>{guest.phone}</span>
                </div>
                <div className={styles.infoItem}>
                  <span>Address</span>
                  <span>{guest.address}</span>
                </div>
                <div className={styles.infoItem}>
                  <span>City</span>
                  <span>{guest.city}</span>
                </div>
                <div className={styles.infoItem}>
                  <span>Country</span>
                  <span>{guest.country}</span>
                </div>
                <div className={styles.infoItem}>
                  <span>Postal Code</span>
                  <span>{guest.postalCode}</span>
                </div>
                <div className={styles.infoItem}>
                  <span>ID Type</span>
                  <span>{guest.idType}</span>
                </div>
                <div className={styles.infoItem}>
                  <span>Status</span>
                  <span className={`${styles.status} ${getStatusColor(guest.status)}`}>
                    {guest.status}
                  </span>
                </div>
              </div>
            </div>

            <div className={styles.card}>
              <h2>Stay History</h2>
              <div className={styles.stays}>
                {guest.stays.map(stay => (
                  <div key={stay.id} className={styles.stay}>
                    <div className={styles.stayHeader}>
                      <div>
                        <span className={styles.roomNumber}>Room {stay.roomNumber}</span>
                        <span className={styles.roomType}>{stay.roomType}</span>
                      </div>
                      <span className={`${styles.status} ${getStatusColor(stay.status)}`}>
                        {stay.status}
                      </span>
                    </div>
                    <div className={styles.stayDates}>
                      <span>Check-in: {stay.checkIn}</span>
                      <span>Check-out: {stay.checkOut}</span>
                    </div>
                    <div className={styles.stayAmount}>
                      <span>Total:</span>
                      <span className={styles.amount}>${stay.totalAmount}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className={styles.sidebar}>
            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <h2>Guest Preferences</h2>
                <Button
                  variant="secondary"
                  size="small"
                  onClick={handleAddPreference}
                >
                  Add Preference
                </Button>
              </div>
              <div className={styles.preferences}>
                {guest.preferences.map(preference => (
                  <div key={preference.id} className={styles.preference}>
                    <span className={styles.preferenceCategory}>
                      {preference.category}
                    </span>
                    <p className={styles.preferenceDescription}>
                      {preference.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>

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
                {guest.notes.map(note => (
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
          title="Edit Guest Profile"
        >
          <GuestForm
            onSubmit={handleEdit}
            initialData={guest}
            isLoading={false}
          />
        </Modal>
      </div>
    </Layout>
  );
};
