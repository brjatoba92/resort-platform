import React from 'react';
import { Button } from '../../common';
import styles from './RoomsTable.module.css';

interface Room {
  id: string;
  number: string;
  type: string;
  status: 'available' | 'occupied' | 'maintenance' | 'cleaning';
  currentGuest?: {
    name: string;
    checkIn: string;
    checkOut: string;
  };
  nextBooking?: {
    guestName: string;
    checkIn: string;
    checkOut: string;
  };
}

interface RoomsTableProps {
  rooms: Room[];
  onStatusChange: (roomId: string, status: Room['status']) => Promise<void>;
  onViewDetails: (roomId: string) => void;
}

export const RoomsTable: React.FC<RoomsTableProps> = ({
  rooms,
  onStatusChange,
  onViewDetails,
}) => {
  const [loading, setLoading] = React.useState<string | null>(null);

  const handleStatusChange = async (roomId: string, newStatus: Room['status']) => {
    try {
      setLoading(roomId);
      await onStatusChange(roomId, newStatus);
    } finally {
      setLoading(null);
    }
  };

  const getStatusClass = (status: Room['status']) => {
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

  const getStatusText = (status: Room['status']) => {
    switch (status) {
      case 'available':
        return 'Disponível';
      case 'occupied':
        return 'Ocupado';
      case 'maintenance':
        return 'Manutenção';
      case 'cleaning':
        return 'Limpeza';
      default:
        return status;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>Status dos Quartos</h2>
        <div className={styles.legend}>
          <span className={`${styles.legendItem} ${styles.statusAvailable}`}>Disponível</span>
          <span className={`${styles.legendItem} ${styles.statusOccupied}`}>Ocupado</span>
          <span className={`${styles.legendItem} ${styles.statusMaintenance}`}>Manutenção</span>
          <span className={`${styles.legendItem} ${styles.statusCleaning}`}>Limpeza</span>
        </div>
      </div>

      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Quarto</th>
              <th>Tipo</th>
              <th>Status</th>
              <th>Hóspede Atual</th>
              <th>Check-in</th>
              <th>Check-out</th>
              <th>Próxima Reserva</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {rooms.map((room) => (
              <tr key={room.id}>
                <td>{room.number}</td>
                <td>{room.type}</td>
                <td>
                  <span className={getStatusClass(room.status)}>
                    {getStatusText(room.status)}
                  </span>
                </td>
                <td>{room.currentGuest?.name || '-'}</td>
                <td>{room.currentGuest ? formatDate(room.currentGuest.checkIn) : '-'}</td>
                <td>{room.currentGuest ? formatDate(room.currentGuest.checkOut) : '-'}</td>
                <td>
                  {room.nextBooking ? (
                    <div className={styles.nextBooking}>
                      <span>{room.nextBooking.guestName}</span>
                      <span className={styles.nextBookingDates}>
                        {formatDate(room.nextBooking.checkIn)} - {formatDate(room.nextBooking.checkOut)}
                      </span>
                    </div>
                  ) : (
                    '-'
                  )}
                </td>
                <td>
                  <div className={styles.actions}>
                    <Button
                      size="small"
                      variant="secondary"
                      onClick={() => onViewDetails(room.id)}
                    >
                      Detalhes
                    </Button>
                    {room.status !== 'cleaning' && (
                      <Button
                        size="small"
                        onClick={() => handleStatusChange(room.id, 'cleaning')}
                        isLoading={loading === room.id}
                      >
                        Solicitar Limpeza
                      </Button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
