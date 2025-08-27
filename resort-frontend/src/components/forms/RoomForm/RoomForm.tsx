import React, { useState } from 'react';
import { Button } from '../../common/Button';
import styles from './RoomForm.module.css';

export interface RoomData {
  number: string;
  type: string;
  capacity: number;
  price: number;
  amenities: string[];
  description: string;
  status: 'available' | 'occupied' | 'maintenance' | 'cleaning';
}

export interface RoomFormProps {
  onSubmit: (data: RoomData) => void;
  initialData?: Partial<RoomData>;
  isLoading?: boolean;
}

const roomTypes = [
  'Standard',
  'Deluxe',
  'Suite',
  'Family',
  'Presidential'
];

const amenitiesList = [
  'Wi-Fi',
  'TV',
  'Air Conditioning',
  'Mini Bar',
  'Safe',
  'Balcony',
  'Ocean View',
  'Room Service',
  'King Bed',
  'Twin Beds'
];

export const RoomForm: React.FC<RoomFormProps> = ({
  onSubmit,
  initialData = {},
  isLoading = false
}) => {
  const [formData, setFormData] = useState<RoomData>({
    number: initialData.number || '',
    type: initialData.type || 'Standard',
    capacity: initialData.capacity || 2,
    price: initialData.price || 0,
    amenities: initialData.amenities || [],
    description: initialData.description || '',
    status: initialData.status || 'available'
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checkbox = e.target as HTMLInputElement;
      const amenity = checkbox.value;
      
      setFormData(prev => ({
        ...prev,
        amenities: checkbox.checked
          ? [...prev.amenities, amenity]
          : prev.amenities.filter(a => a !== amenity)
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'number' ? parseFloat(value) || 0 : value
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <div className={styles.grid}>
        <div className={styles.formGroup}>
          <label htmlFor="number">Room Number</label>
          <input
            type="text"
            id="number"
            name="number"
            value={formData.number}
            onChange={handleChange}
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="type">Room Type</label>
          <select
            id="type"
            name="type"
            value={formData.type}
            onChange={handleChange}
            required
          >
            {roomTypes.map(type => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="capacity">Capacity</label>
          <input
            type="number"
            id="capacity"
            name="capacity"
            min="1"
            max="8"
            value={formData.capacity}
            onChange={handleChange}
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="price">Price per Night ($)</label>
          <input
            type="number"
            id="price"
            name="price"
            min="0"
            step="0.01"
            value={formData.price}
            onChange={handleChange}
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="status">Status</label>
          <select
            id="status"
            name="status"
            value={formData.status}
            onChange={handleChange}
            required
          >
            <option value="available">Available</option>
            <option value="occupied">Occupied</option>
            <option value="maintenance">Maintenance</option>
            <option value="cleaning">Cleaning</option>
          </select>
        </div>
      </div>

      <div className={styles.formGroup}>
        <label>Amenities</label>
        <div className={styles.amenities}>
          {amenitiesList.map(amenity => (
            <label key={amenity} className={styles.checkbox}>
              <input
                type="checkbox"
                name="amenities"
                value={amenity}
                checked={formData.amenities.includes(amenity)}
                onChange={handleChange}
              />
              <span>{amenity}</span>
            </label>
          ))}
        </div>
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="description">Description</label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows={4}
          placeholder="Enter room description..."
          required
        />
      </div>

      <div className={styles.actions}>
        <Button
          type="submit"
          variant="primary"
          fullWidth
          loading={isLoading}
        >
          {initialData.number ? 'Update Room' : 'Create Room'}
        </Button>
      </div>
    </form>
  );
};
