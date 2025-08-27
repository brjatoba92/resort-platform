import React, { useState } from 'react';
import { Modal } from '../../common/Modal';
import { Button } from '../../common/Button';
import styles from './CheckInOutModal.module.css';

interface Guest {
  name: string;
  email: string;
  phone: string;
  documents: string;
}

export interface CheckInOutModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'check-in' | 'check-out';
  roomNumber: string;
  onSubmit: (guestData: Guest) => void;
}

export const CheckInOutModal: React.FC<CheckInOutModalProps> = ({
  isOpen,
  onClose,
  type,
  roomNumber,
  onSubmit
}) => {
  const [guestData, setGuestData] = useState<Guest>({
    name: '',
    email: '',
    phone: '',
    documents: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(guestData);
    onClose();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setGuestData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`${type === 'check-in' ? 'Check-in' : 'Check-out'} - Room ${roomNumber}`}
    >
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formGroup}>
          <label htmlFor="name">Guest Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={guestData.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={guestData.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="phone">Phone</label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={guestData.phone}
            onChange={handleChange}
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="documents">Documents</label>
          <input
            type="text"
            id="documents"
            name="documents"
            value={guestData.documents}
            onChange={handleChange}
            required
          />
        </div>

        <div className={styles.actions}>
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary">
            {type === 'check-in' ? 'Complete Check-in' : 'Complete Check-out'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
