import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ROUTES } from '../../../utils/constants/routes';
import styles from './RoomDetails.module.css';

interface Room {
  id: number;
  number: string;
  type: string;
  status: 'available' | 'occupied' | 'reserved' | 'maintenance';
  floor: string;
  capacity: number;
  price: number;
  features: string[];
  images: string[];
  description: string;
  lastCleaning?: string;
  nextCleaning?: string;
  maintenanceHistory: {
    id: number;
    date: string;
    type: string;
    description: string;
  }[];
  currentGuest?: {
    name: string;
    checkIn: string;
    checkOut: string;
  };
}

const RoomDetails: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [room, setRoom] = useState<Room | null>(null);
  const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => {
    // TODO: Implementar chamada à API
    const mockRoom: Room = {
      id: 1,
      number: '301',
      type: 'Suíte Luxo',
      status: 'available',
      floor: '3',
      capacity: 4,
      price: 650.00,
      description: 'Suíte luxuosa com vista para o mar, ideal para famílias. Conta com área de estar separada e varanda privativa.',
      features: [
        'Wi-Fi',
        'TV 55"',
        'Ar-condicionado',
        'Frigobar',
        'Cofre',
        'Hidromassagem',
        'Vista para o mar',
        'Varanda',
        'Room Service 24h',
        'King Size Bed'
      ],
      images: [
        'https://example.com/room-301-1.jpg',
        'https://example.com/room-301-2.jpg',
        'https://example.com/room-301-3.jpg',
        'https://example.com/room-301-4.jpg'
      ],
      lastCleaning: '2024-02-18 09:00:00',
      nextCleaning: '2024-02-19 09:00:00',
      maintenanceHistory: [
        {
          id: 1,
          date: '2024-02-15',
          type: 'Preventiva',
          description: 'Manutenção do ar-condicionado'
        },
        {
          id: 2,
          date: '2024-02-10',
          type: 'Corretiva',
          description: 'Troca de lâmpadas'
        }
      ]
    };

    setRoom(mockRoom);
  }, [id]);

  const getStatusClass = (status: Room['status']) => {
    switch (status) {
      case 'available':
        return styles.statusAvailable;
      case 'occupied':
        return styles.statusOccupied;
      case 'reserved':
        return styles.statusReserved;
      case 'maintenance':
        return styles.statusMaintenance;
      default:
        return '';
    }
  };

  const getStatusText = (status: Room['status']) => {
    switch (status) {
      case 'available':
        return 'Disponível';
      case 'occupied':
        return 'Ocupado';
      case 'reserved':
        return 'Reservado';
      case 'maintenance':
        return 'Manutenção';
      default:
        return status;
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (!room) {
    return <div>Carregando...</div>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <button
          onClick={() => navigate(ROUTES.ROOM_LIST)}
          className={styles.backButton}
        >
          <svg className={styles.backIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Voltar para Lista
        </button>
        <h1 className={styles.title}>Detalhes do Quarto</h1>
      </div>

      <div className={styles.content}>
        {/* Card Principal */}
        <div className={styles.mainCard}>
          {/* Galeria */}
          <div className={styles.gallery}>
            <img
              src={room.images[selectedImage]}
              alt={`Quarto ${room.number}`}
              className={styles.mainImage}
            />
            <div className={styles.thumbnails}>
              {room.images.map((image, index) => (
                <div
                  key={index}
                  className={`${styles.thumbnail} ${selectedImage === index ? styles.thumbnailActive : ''}`}
                  onClick={() => setSelectedImage(index)}
                >
                  <img
                    src={image}
                    alt={`Thumbnail ${index + 1}`}
                    className={styles.thumbnailImage}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Informações do Quarto */}
          <div className={styles.roomInfo}>
            <div className={styles.roomHeader}>
              <div>
                <h2 className={styles.roomNumber}>Quarto {room.number}</h2>
                <p className={styles.roomType}>{room.type}</p>
              </div>
              <span className={`${styles.roomStatus} ${getStatusClass(room.status)}`}>
                {getStatusText(room.status)}
              </span>
            </div>

            <p className="text-gray-600">{room.description}</p>

            {/* Características */}
            <div className={styles.section}>
              <h3 className={styles.sectionTitle}>Características</h3>
              <div className={styles.features}>
                {room.features.map((feature, index) => (
                  <div key={index} className={styles.feature}>
                    <svg className={styles.featureIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className={styles.sidebar}>
          {/* Ações */}
          <div className={styles.actionCard}>
            <div className="mb-4">
              <span className="text-lg font-medium text-gray-900">
                {formatCurrency(room.price)}
              </span>
              <span className="text-gray-500"> / diária</span>
            </div>
            
            <button
              onClick={() => navigate(`${ROUTES.ROOM_LIST}/${id}/edit`)}
              className={`${styles.actionButton} ${styles.primaryButton}`}
            >
              Editar Quarto
            </button>
            
            {room.status === 'available' && (
              <button
                onClick={() => {/* TODO: Implementar reserva */}}
                className={`${styles.actionButton} ${styles.secondaryButton}`}
              >
                Fazer Reserva
              </button>
            )}

            {room.status === 'available' && (
              <button
                onClick={() => {/* TODO: Implementar manutenção */}}
                className={`${styles.actionButton} ${styles.dangerButton}`}
              >
                Colocar em Manutenção
              </button>
            )}

            {/* Status de Limpeza */}
            <div className={styles.cleaningInfo}>
              <div className={styles.cleaningStatus}>
                <span>Última Limpeza</span>
                <span className={styles.cleaningDate}>
                  {room.lastCleaning ? formatDate(room.lastCleaning) : 'N/A'}
                </span>
              </div>
              <div className={styles.cleaningStatus}>
                <span>Próxima Limpeza</span>
                <span className={styles.cleaningDate}>
                  {room.nextCleaning ? formatDate(room.nextCleaning) : 'N/A'}
                </span>
              </div>
            </div>
          </div>

          {/* Histórico de Manutenção */}
          <div className={styles.actionCard}>
            <h3 className={styles.sectionTitle}>Histórico de Manutenção</h3>
            <div className={styles.timeline}>
              {room.maintenanceHistory.map(event => (
                <div key={event.id} className={styles.timelineItem}>
                  <span className={styles.timelineDate}>{formatDate(event.date)}</span>
                  <h4 className={styles.timelineTitle}>{event.type}</h4>
                  <p className={styles.timelineDescription}>{event.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoomDetails;
