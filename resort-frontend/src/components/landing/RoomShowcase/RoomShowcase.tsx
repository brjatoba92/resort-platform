import React, { useState } from 'react';
import { Button } from '../../common/Button';
import styles from './RoomShowcase.module.css';

interface Room {
  id: string;
  name: string;
  type: string;
  price: number;
  description: string;
  amenities: string[];
  images: string[];
}

export interface RoomShowcaseProps {
  title: string;
  subtitle: string;
  rooms: Room[];
  onBookNow: (roomId: string) => void;
}

export const RoomShowcase: React.FC<RoomShowcaseProps> = ({
  title,
  subtitle,
  rooms,
  onBookNow
}) => {
  const [activeRoom, setActiveRoom] = useState<string>(rooms[0]?.id);
  const [activeImage, setActiveImage] = useState<number>(0);

  const selectedRoom = rooms.find(room => room.id === activeRoom);

  const handleNextImage = () => {
    if (selectedRoom) {
      setActiveImage((prev) => 
        prev === selectedRoom.images.length - 1 ? 0 : prev + 1
      );
    }
  };

  const handlePrevImage = () => {
    if (selectedRoom) {
      setActiveImage((prev) => 
        prev === 0 ? selectedRoom.images.length - 1 : prev - 1
      );
    }
  };

  return (
    <section className={styles.showcase}>
      <div className={styles.header}>
        <h2 className={styles.title}>{title}</h2>
        <p className={styles.subtitle}>{subtitle}</p>
      </div>

      <div className={styles.content}>
        <div className={styles.roomList}>
          {rooms.map(room => (
            <button
              key={room.id}
              className={`${styles.roomButton} ${activeRoom === room.id ? styles.active : ''}`}
              onClick={() => {
                setActiveRoom(room.id);
                setActiveImage(0);
              }}
            >
              <h3 className={styles.roomName}>{room.name}</h3>
              <p className={styles.roomType}>{room.type}</p>
              <span className={styles.price}>${room.price}/night</span>
            </button>
          ))}
        </div>

        {selectedRoom && (
          <div className={styles.roomDetails}>
            <div className={styles.imageGallery}>
              <img
                src={selectedRoom.images[activeImage]}
                alt={selectedRoom.name}
                className={styles.mainImage}
              />
              
              <button
                className={`${styles.galleryControl} ${styles.prev}`}
                onClick={handlePrevImage}
                aria-label="Previous image"
              >
                ←
              </button>
              <button
                className={`${styles.galleryControl} ${styles.next}`}
                onClick={handleNextImage}
                aria-label="Next image"
              >
                →
              </button>

              <div className={styles.imageDots}>
                {selectedRoom.images.map((_, index) => (
                  <button
                    key={index}
                    className={`${styles.dot} ${index === activeImage ? styles.activeDot : ''}`}
                    onClick={() => setActiveImage(index)}
                    aria-label={`Image ${index + 1}`}
                  />
                ))}
              </div>
            </div>

            <div className={styles.info}>
              <p className={styles.description}>{selectedRoom.description}</p>
              
              <div className={styles.amenities}>
                <h4>Room Amenities</h4>
                <ul>
                  {selectedRoom.amenities.map((amenity, index) => (
                    <li key={index}>{amenity}</li>
                  ))}
                </ul>
              </div>

              <Button
                variant="primary"
                fullWidth
                onClick={() => onBookNow(selectedRoom.id)}
              >
                Book Now
              </Button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
