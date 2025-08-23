import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ROUTES } from '../../../utils/constants/routes';
import styles from './ReservationDetails.module.css';

interface Reservation {
  id: number;
  reservationNumber: string;
  status: 'pending' | 'confirmed' | 'checked-in' | 'checked-out' | 'canceled';
  guest: {
    name: string;
    email: string;
    phone: string;
    document: string;
  };
  room: {
    number: string;
    type: string;
    price: number;
  };
  checkIn: string;
  checkOut: string;
  guests: number;
  totalAmount: number;
  paymentStatus: 'pending' | 'partial' | 'paid';
  payments: {
    id: number;
    date: string;
    amount: number;
    method: string;
  }[];
  history: {
    id: number;
    date: string;
    action: string;
    description: string;
  }[];
  additionalServices: {
    id: number;
    name: string;
    price: number;
  }[];
  notes?: string;
  createdAt: string;
}

const ReservationDetails: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [reservation, setReservation] = useState<Reservation | null>(null);

  useEffect(() => {
    // TODO: Implementar chamada à API
    const mockReservation: Reservation = {
      id: 1,
      reservationNumber: 'RES-2024-001',
      status: 'confirmed',
      guest: {
        name: 'João Silva',
        email: 'joao.silva@email.com',
        phone: '(11) 98765-4321',
        document: '123.456.789-00'
      },
      room: {
        number: '301',
        type: 'Suíte Luxo',
        price: 450.00
      },
      checkIn: '2024-02-20',
      checkOut: '2024-02-25',
      guests: 2,
      totalAmount: 2250.00,
      paymentStatus: 'partial',
      payments: [
        {
          id: 1,
          date: '2024-02-15',
          amount: 1125.00,
          method: 'Cartão de Crédito'
        }
      ],
      history: [
        {
          id: 1,
          date: '2024-02-15 10:30',
          action: 'Reserva Criada',
          description: 'Reserva criada via website'
        },
        {
          id: 2,
          date: '2024-02-15 10:35',
          action: 'Pagamento',
          description: 'Pagamento parcial recebido'
        },
        {
          id: 3,
          date: '2024-02-15 11:00',
          action: 'Confirmação',
          description: 'Reserva confirmada após pagamento'
        }
      ],
      additionalServices: [
        {
          id: 1,
          name: 'Café da manhã',
          price: 50.00
        },
        {
          id: 2,
          name: 'Estacionamento',
          price: 30.00
        }
      ],
      notes: 'Hóspede solicitou quarto silencioso',
      createdAt: '2024-02-15 10:30'
    };

    setReservation(mockReservation);
  }, [id]);

  const getStatusClass = (status: Reservation['status']) => {
    switch (status) {
      case 'pending':
        return styles.statusPending;
      case 'confirmed':
        return styles.statusConfirmed;
      case 'checked-in':
        return styles.statusCheckedIn;
      case 'checked-out':
        return styles.statusCheckedOut;
      case 'canceled':
        return styles.statusCanceled;
      default:
        return '';
    }
  };

  const getStatusText = (status: Reservation['status']) => {
    switch (status) {
      case 'pending':
        return 'Pendente';
      case 'confirmed':
        return 'Confirmada';
      case 'checked-in':
        return 'Check-in Realizado';
      case 'checked-out':
        return 'Check-out Realizado';
      case 'canceled':
        return 'Cancelada';
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

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('pt-BR');
  };

  const getRemainingAmount = () => {
    if (!reservation) return 0;
    const paidAmount = reservation.payments.reduce((sum, payment) => sum + payment.amount, 0);
    return reservation.totalAmount - paidAmount;
  };

  if (!reservation) {
    return <div>Carregando...</div>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <button
          onClick={() => navigate(ROUTES.RESERVATION_LIST)}
          className={styles.backButton}
        >
          <svg className={styles.backIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Voltar para Lista
        </button>
        <h1 className={styles.title}>Detalhes da Reserva</h1>
      </div>

      <div className={styles.content}>
        {/* Card Principal */}
        <div className={styles.mainCard}>
          <div className={styles.reservationHeader}>
            <div className={styles.reservationInfo}>
              <div>
                <span className={styles.reservationId}>
                  Reserva #{reservation.reservationNumber}
                </span>
                <p className="text-sm text-gray-500 mt-1">
                  Criada em {formatDateTime(reservation.createdAt)}
                </p>
              </div>
              <span className={`${styles.status} ${getStatusClass(reservation.status)}`}>
                {getStatusText(reservation.status)}
              </span>
            </div>
          </div>

          {/* Informações do Hóspede */}
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Informações do Hóspede</h3>
            <div className={styles.infoGrid}>
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>Nome</span>
                <span className={styles.infoValue}>{reservation.guest.name}</span>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>Email</span>
                <span className={styles.infoValue}>{reservation.guest.email}</span>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>Telefone</span>
                <span className={styles.infoValue}>{reservation.guest.phone}</span>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>Documento</span>
                <span className={styles.infoValue}>{reservation.guest.document}</span>
              </div>
            </div>
          </div>

          {/* Detalhes da Reserva */}
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Detalhes da Reserva</h3>
            <div className={styles.infoGrid}>
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>Quarto</span>
                <span className={styles.infoValue}>
                  {reservation.room.number} - {reservation.room.type}
                </span>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>Check-in</span>
                <span className={styles.infoValue}>{formatDate(reservation.checkIn)}</span>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>Check-out</span>
                <span className={styles.infoValue}>{formatDate(reservation.checkOut)}</span>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>Hóspedes</span>
                <span className={styles.infoValue}>{reservation.guests}</span>
              </div>
            </div>
          </div>

          {/* Serviços Adicionais */}
          {reservation.additionalServices.length > 0 && (
            <div className={styles.section}>
              <h3 className={styles.sectionTitle}>Serviços Adicionais</h3>
              <div className={styles.summary}>
                {reservation.additionalServices.map(service => (
                  <div key={service.id} className={styles.summaryItem}>
                    <span className={styles.summaryLabel}>{service.name}</span>
                    <span className={styles.summaryValue}>{formatCurrency(service.price)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Observações */}
          {reservation.notes && (
            <div className={styles.section}>
              <h3 className={styles.sectionTitle}>Observações</h3>
              <p className="text-sm text-gray-600">{reservation.notes}</p>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className={styles.sidebar}>
          {/* Ações */}
          <div className={styles.actionCard}>
            <button
              onClick={() => navigate(`${ROUTES.RESERVATION_LIST}/${id}/edit`)}
              className={`${styles.actionButton} ${styles.primaryButton}`}
            >
              Editar Reserva
            </button>

            {reservation.status === 'confirmed' && (
              <button
                onClick={() => {/* TODO: Implementar check-in */}}
                className={`${styles.actionButton} ${styles.secondaryButton}`}
              >
                Realizar Check-in
              </button>
            )}

            {reservation.status !== 'canceled' && (
              <button
                onClick={() => {/* TODO: Implementar cancelamento */}}
                className={`${styles.actionButton} ${styles.dangerButton}`}
              >
                Cancelar Reserva
              </button>
            )}
          </div>

          {/* Pagamento */}
          <div className={styles.actionCard}>
            <h3 className={styles.sectionTitle}>Resumo do Pagamento</h3>
            <div className={styles.summary}>
              <div className={styles.summaryItem}>
                <span className={styles.summaryLabel}>Diárias ({reservation.room.type})</span>
                <span className={styles.summaryValue}>{formatCurrency(reservation.room.price)}</span>
              </div>
              {reservation.additionalServices.map(service => (
                <div key={service.id} className={styles.summaryItem}>
                  <span className={styles.summaryLabel}>{service.name}</span>
                  <span className={styles.summaryValue}>{formatCurrency(service.price)}</span>
                </div>
              ))}
              <div className={styles.summaryTotal}>
                <span className={styles.totalLabel}>Total</span>
                <span className={styles.totalValue}>{formatCurrency(reservation.totalAmount)}</span>
              </div>
            </div>

            <div className={styles.paymentInfo}>
              <h4 className="text-sm font-medium text-gray-900 mb-2">Pagamentos Realizados</h4>
              {reservation.payments.map(payment => (
                <div key={payment.id} className={styles.paymentStatus}>
                  <span>{payment.method}</span>
                  <span>{formatCurrency(payment.amount)}</span>
                </div>
              ))}
              <div className={styles.summaryTotal}>
                <span className={styles.totalLabel}>Restante</span>
                <span className={styles.totalValue}>{formatCurrency(getRemainingAmount())}</span>
              </div>
            </div>
          </div>

          {/* Histórico */}
          <div className={styles.actionCard}>
            <h3 className={styles.sectionTitle}>Histórico</h3>
            <div className={styles.timeline}>
              {reservation.history.map(event => (
                <div key={event.id} className={styles.timelineItem}>
                  <span className={styles.timelineDate}>{formatDateTime(event.date)}</span>
                  <h4 className={styles.timelineTitle}>{event.action}</h4>
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

export default ReservationDetails;
