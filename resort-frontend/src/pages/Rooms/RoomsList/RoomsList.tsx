import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../../utils/constants/routes';
import styles from './RoomsList.module.css';

interface Room {
  id: number;
  number: string;
  type: string;
  status: 'available' | 'occupied' | 'reserved' | 'maintenance';
  floor: string;
  capacity: number;
  price: number;
  features: string[];
  imageUrl: string;
  lastCleaning?: string;
  currentGuest?: {
    name: string;
    checkIn: string;
    checkOut: string;
  };
}

interface RoomStats {
  total: number;
  available: number;
  occupied: number;
  maintenance: number;
  occupancyRate: number;
}

const RoomsList: React.FC = () => {
  const navigate = useNavigate();
  const [rooms, setRooms] = useState<Room[]>([]);
  const [stats, setStats] = useState<RoomStats>({
    total: 0,
    available: 0,
    occupied: 0,
    maintenance: 0,
    occupancyRate: 0
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [floorFilter, setFloorFilter] = useState('all');

  useEffect(() => {
    // TODO: Implementar chamada à API
    const mockRooms: Room[] = [
      {
        id: 1,
        number: '101',
        type: 'Standard',
        status: 'available',
        floor: '1',
        capacity: 2,
        price: 250.00,
        features: ['Wi-Fi', 'TV', 'Ar-condicionado', 'Frigobar'],
        imageUrl: 'https://example.com/room-101.jpg',
        lastCleaning: '2024-02-18'
      },
      {
        id: 2,
        number: '201',
        type: 'Luxo',
        status: 'occupied',
        floor: '2',
        capacity: 3,
        price: 450.00,
        features: ['Wi-Fi', 'TV', 'Ar-condicionado', 'Frigobar', 'Vista para o mar'],
        imageUrl: 'https://example.com/room-201.jpg',
        lastCleaning: '2024-02-18',
        currentGuest: {
          name: 'João Silva',
          checkIn: '2024-02-15',
          checkOut: '2024-02-20'
        }
      },
      {
        id: 3,
        number: '301',
        type: 'Suíte',
        status: 'maintenance',
        floor: '3',
        capacity: 4,
        price: 650.00,
        features: ['Wi-Fi', 'TV', 'Ar-condicionado', 'Frigobar', 'Hidromassagem'],
        imageUrl: 'https://example.com/room-301.jpg',
        lastCleaning: '2024-02-17'
      }
    ];

    setRooms(mockRooms);

    // Calcular estatísticas
    const totalRooms = mockRooms.length;
    const availableRooms = mockRooms.filter(r => r.status === 'available').length;
    const occupiedRooms = mockRooms.filter(r => r.status === 'occupied').length;
    const maintenanceRooms = mockRooms.filter(r => r.status === 'maintenance').length;

    setStats({
      total: totalRooms,
      available: availableRooms,
      occupied: occupiedRooms,
      maintenance: maintenanceRooms,
      occupancyRate: (occupiedRooms / totalRooms) * 100
    });
  }, []);

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
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Quartos</h1>
        <button
          onClick={() => navigate(ROUTES.ROOM_LIST + '/new')}
          className={styles.addButton}
        >
          <svg className={styles.addIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Novo Quarto
        </button>
      </div>

      {/* Estatísticas */}
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statValue}>{stats.total}</div>
          <div className={styles.statLabel}>Total de Quartos</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statValue}>{stats.available}</div>
          <div className={styles.statLabel}>Disponíveis</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statValue}>{stats.occupied}</div>
          <div className={styles.statLabel}>Ocupados</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statValue}>{stats.occupancyRate.toFixed(1)}%</div>
          <div className={styles.statLabel}>Taxa de Ocupação</div>
        </div>
      </div>

      {/* Filtros */}
      <div className={styles.filters}>
        <input
          type="text"
          placeholder="Buscar quarto..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className={styles.searchInput}
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className={styles.filterSelect}
        >
          <option value="all">Todos os Status</option>
          <option value="available">Disponível</option>
          <option value="occupied">Ocupado</option>
          <option value="reserved">Reservado</option>
          <option value="maintenance">Manutenção</option>
        </select>
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className={styles.filterSelect}
        >
          <option value="all">Todos os Tipos</option>
          <option value="standard">Standard</option>
          <option value="luxo">Luxo</option>
          <option value="suite">Suíte</option>
        </select>
        <select
          value={floorFilter}
          onChange={(e) => setFloorFilter(e.target.value)}
          className={styles.filterSelect}
        >
          <option value="all">Todos os Andares</option>
          <option value="1">1º Andar</option>
          <option value="2">2º Andar</option>
          <option value="3">3º Andar</option>
        </select>
      </div>

      {/* Lista de Quartos */}
      <div className={styles.roomsGrid}>
        {rooms.map(room => (
          <div key={room.id} className={styles.roomCard}>
            <div className="relative">
              <img
                src={room.imageUrl}
                alt={`Quarto ${room.number}`}
                className={styles.roomImage}
              />
              <div className={`${styles.statusIndicator} ${styles[`indicator${room.status.charAt(0).toUpperCase() + room.status.slice(1)}`]}`} />
            </div>
            <div className={styles.roomContent}>
              <div className={styles.roomHeader}>
                <div>
                  <h3 className={styles.roomNumber}>Quarto {room.number}</h3>
                  <p className={styles.roomType}>{room.type}</p>
                </div>
                <span className={`${styles.roomStatus} ${getStatusClass(room.status)}`}>
                  {getStatusText(room.status)}
                </span>
              </div>

              <div className={styles.roomDetails}>
                <div className={styles.roomFeatures}>
                  {room.features.slice(0, 3).map((feature, index) => (
                    <span key={index} className={styles.feature}>
                      <svg className={styles.featureIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      {feature}
                    </span>
                  ))}
                  {room.features.length > 3 && (
                    <span className={styles.feature}>+{room.features.length - 3}</span>
                  )}
                </div>

                <div className={styles.roomPrice}>
                  <span className={styles.priceLabel}>Diária</span>
                  <span className={styles.priceValue}>{formatCurrency(room.price)}</span>
                </div>
              </div>

              <div className={styles.roomActions}>
                <button
                  onClick={() => navigate(`${ROUTES.ROOM_LIST}/${room.id}`)}
                  className={styles.actionButton}
                  title="Ver detalhes"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </button>
                <button
                  onClick={() => navigate(`${ROUTES.ROOM_LIST}/${room.id}/edit`)}
                  className={styles.actionButton}
                  title="Editar"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RoomsList;
