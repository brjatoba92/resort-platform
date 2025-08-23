import React from 'react';
import { Link } from 'react-router-dom';
import * as Fa from 'react-icons/fa';
import styles from './RoomShowcase.module.css';

const rooms = [
  {
    id: '1',
    type: 'Deluxe Ocean View',
    description: 'Spacious room with stunning ocean views',
    price: 299,
    features: ['King Bed', 'Ocean View', 'Balcony', 'Mini Bar'],
    image: '/images/rooms/deluxe-ocean.jpg'
  },
  {
    id: '2',
    type: 'Premium Suite',
    description: 'Luxury suite with separate living area',
    price: 499,
    features: ['King Bed', 'Living Room', 'Jacuzzi', 'Kitchen'],
    image: '/images/rooms/premium-suite.jpg'
  },
  {
    id: '3',
    type: 'Family Villa',
    description: 'Perfect for family stays with extra space',
    price: 699,
    features: ['2 Bedrooms', 'Private Pool', 'Kitchen', 'Garden'],
    image: '/images/rooms/family-villa.jpg'
  }
];

export function RoomShowcase() {
  return (
    <section className={styles.showcase}>
      <h2 className={styles.title}>Our Rooms</h2>
      <div className={styles.grid}>
        {rooms.map(room => (
          <article key={room.id} className={styles.room}>
            <div className={styles.content}>
              <h3 className={styles.roomType}>{room.type}</h3>
              <p className={styles.description}>{room.description}</p>
              <ul className={styles.features}>
                {room.features.map((feature, index) => (
                  <li key={index}>
                    <Fa.FaCheck className={styles.checkIcon} />
                    {feature}
                  </li>
                ))}
              </ul>
              <p className={styles.price}>
                <span>${room.price}</span> / night
              </p>
              <Link to={`/rooms/${room.id}`} className={styles.button}>
                View Details
              </Link>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}