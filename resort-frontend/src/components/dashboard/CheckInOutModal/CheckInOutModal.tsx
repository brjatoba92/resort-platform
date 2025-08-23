import React from 'react';
import { Modal, Button } from '../../common';
import styles from './CheckInOutModal.module.css';

interface Guest {
  id: string;
  name: string;
  room: string;
  checkIn?: string;
  checkOut?: string;
  status: 'pending' | 'checked_in' | 'checked_out';
}

interface CheckInOutModalProps {
  isOpen: boolean;
  onClose: () => void;
  guest: Guest;
  type: 'check-in' | 'check-out';
  onConfirm: (guestId: string) => Promise<void>;
}

export const CheckInOutModal: React.FC<CheckInOutModalProps> = ({
  isOpen,
  onClose,
  guest,
  type,
  onConfirm,
}) => {
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string>();

  const handleConfirm = async () => {
    try {
      setIsLoading(true);
      setError(undefined);
      await onConfirm(guest.id);
      onClose();
    } catch (err) {
      setError('Ocorreu um erro ao processar a operação.');
    } finally {
      setIsLoading(false);
    }
  };

  const title = type === 'check-in' ? 'Confirmar Check-in' : 'Confirmar Check-out';
  const action = type === 'check-in' ? 'check-in' : 'check-out';

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
    >
      <div className={styles.content}>
        <div className={styles.guestInfo}>
          <div className={styles.infoItem}>
            <span className={styles.label}>Hóspede:</span>
            <span className={styles.value}>{guest.name}</span>
          </div>
          <div className={styles.infoItem}>
            <span className={styles.label}>Quarto:</span>
            <span className={styles.value}>{guest.room}</span>
          </div>
          {type === 'check-in' && guest.checkIn && (
            <div className={styles.infoItem}>
              <span className={styles.label}>Data de Check-in:</span>
              <span className={styles.value}>{new Date(guest.checkIn).toLocaleDateString()}</span>
            </div>
          )}
          {type === 'check-out' && guest.checkOut && (
            <div className={styles.infoItem}>
              <span className={styles.label}>Data de Check-out:</span>
              <span className={styles.value}>{new Date(guest.checkOut).toLocaleDateString()}</span>
            </div>
          )}
        </div>

        <p className={styles.confirmation}>
          Tem certeza que deseja realizar o {action} do hóspede?
        </p>

        {error && <p className={styles.error}>{error}</p>}

        <div className={styles.actions}>
          <Button
            variant="secondary"
            onClick={onClose}
            disabled={isLoading}
          >
            Cancelar
          </Button>
          <Button
            onClick={handleConfirm}
            isLoading={isLoading}
            loadingText={`Processando ${action}...`}
          >
            Confirmar
          </Button>
        </div>
      </div>
    </Modal>
  );
};
