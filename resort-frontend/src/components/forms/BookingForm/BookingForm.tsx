import React, { useState } from 'react';
import { Button } from '../../common/Button';
import styles from './BookingForm.module.css';

interface Room {
  id: string;
  number: string;
  type: string;
  price: number;
}

export interface BookingFormProps {
  availableRooms: Room[];
  onSubmit: (bookingData: BookingData) => void;
  isLoading?: boolean;
}

export interface BookingData {
  checkIn: string;
  checkOut: string;
  roomId: string;
  adults: number;
  children: number;
  specialRequests?: string;
}

export const BookingForm: React.FC<BookingFormProps> = ({
  availableRooms,
  onSubmit,
  isLoading = false
}) => {
  const [formData, setFormData] = useState<BookingData>({
    checkIn: '',
    checkOut: '',
    roomId: '',
    adults: 1,
    children: 0,
    specialRequests: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'adults' || name === 'children' ? parseInt(value) || 0 : value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const today = new Date().toISOString().split('T')[0];

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <div className={styles.grid}>
        <div className={styles.formGroup}>
          <label htmlFor="checkIn">Check-in Date</label>
          <input
            type="date"
            id="checkIn"
            name="checkIn"
            min={today}
            value={formData.checkIn}
            onChange={handleChange}
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="checkOut">Check-out Date</label>
          <input
            type="date"
            id="checkOut"
            name="checkOut"
            min={formData.checkIn || today}
            value={formData.checkOut}
            onChange={handleChange}
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="roomId">Room Type</label>
          <select
            id="roomId"
            name="roomId"
            value={formData.roomId}
            onChange={handleChange}
            required
          >
            <option value="">Select a room</option>
            {availableRooms.map(room => (
              <option key={room.id} value={room.id}>
                {room.type} - Room {room.number} (${room.price}/night)
              </option>
            ))}
          </select>
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="adults">Adults</label>
          <input
            type="number"
            id="adults"
            name="adults"
            min="1"
            max="4"
            value={formData.adults}
            onChange={handleChange}
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="children">Children</label>
          <input
            type="number"
            id="children"
            name="children"
            min="0"
            max="4"
            value={formData.children}
            onChange={handleChange}
          />
        </div>
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="specialRequests">Special Requests</label>
        <textarea
          id="specialRequests"
          name="specialRequests"
          value={formData.specialRequests}
          onChange={handleChange}
          rows={4}
          placeholder="Any special requests or preferences?"
        />
      </div>

      <div className={styles.actions}>
        <Button
          type="submit"
          variant="primary"
          fullWidth
          loading={isLoading}
        >
          Book Now
        </Button>
      </div>
    </form>
  );
};
