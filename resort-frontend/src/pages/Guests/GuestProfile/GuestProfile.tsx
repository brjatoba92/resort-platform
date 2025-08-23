import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ROUTES } from '../../../utils/constants/routes';
import styles from './GuestProfile.module.css';

interface Guest {
  id: number;
  name: string;
  email: string;
  phone: string;
  status: 'checked-in' | 'checked-out' | 'reserved';
  checkIn?: string;
  checkOut?: string;
  roomNumber?: string;
  nationality: string;
  document: string;
  address: string;
  emergencyContact: string;
  preferences: string[];
}

interface Consumption {
  id: number;
  description: string;
  value: number;
  date: string;
}

interface TimelineEvent {
  id: number;
  date: string;
  title: string;
  description: string;
  type: 'check-in' | 'check-out' | 'room-change' | 'service';
}

const GuestProfile: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [guest, setGuest] = useState<Guest | null>(null);
  const [consumption, setConsumption] = useState<Consumption[]>([]);
  const [timeline, setTimeline] = useState<TimelineEvent[]>([]);

  useEffect(() => {
    // TODO: Implementar chamada à API
    const mockGuest: Guest = {
      id: 1,
      name: 'Ana Silva',
      email: 'ana.silva@email.com',
      phone: '(11) 98765-4321',
      status: 'checked-in',
      checkIn: '2024-02-15',
      checkOut: '2024-02-20',
      roomNumber: '304',
      nationality: 'Brasileira',
      document: '123.456.789-00',
      address: 'Rua das Flores, 123 - São Paulo, SP',
      emergencyContact: 'João Silva - (11) 98765-4322',
      preferences: ['Quarto silencioso', 'Travesseiros extras', 'Vista para o mar']
    };

    const mockConsumption: Consumption[] = [
      {
        id: 1,
        description: 'Restaurante - Jantar',
        value: 150.00,
        date: '2024-02-15'
      },
      {
        id: 2,
        description: 'Serviço de Quarto',
        value: 80.00,
        date: '2024-02-16'
      },
      {
        id: 3,
        description: 'Spa',
        value: 200.00,
        date: '2024-02-17'
      }
    ];

    const mockTimeline: TimelineEvent[] = [
      {
        id: 1,
        date: '2024-02-15 14:00',
        title: 'Check-in realizado',
        description: 'Check-in realizado no quarto 304',
        type: 'check-in'
      },
      {
        id: 2,
        date: '2024-02-16 10:30',
        title: 'Serviço de Spa',
        description: 'Agendamento de massagem relaxante',
        type: 'service'
      },
      {
        id: 3,
        date: '2024-02-17 09:15',
        title: 'Troca de Quarto',
        description: 'Mudança para quarto com vista para o mar',
        type: 'room-change'
      }
    ];

    setGuest(mockGuest);
    setConsumption(mockConsumption);
    setTimeline(mockTimeline);
  }, [id]);

  const getStatusClass = (status: Guest['status']) => {
    switch (status) {
      case 'checked-in':
        return styles.statusCheckedIn;
      case 'checked-out':
        return styles.statusCheckedOut;
      case 'reserved':
        return styles.statusReserved;
      default:
        return '';
    }
  };

  const getStatusText = (status: Guest['status']) => {
    switch (status) {
      case 'checked-in':
        return 'Check-in realizado';
      case 'checked-out':
        return 'Check-out realizado';
      case 'reserved':
        return 'Reservado';
      default:
        return status;
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const getTotalConsumption = () => {
    return consumption.reduce((total, item) => total + item.value, 0);
  };

  if (!guest) {
    return <div>Carregando...</div>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <button
          onClick={() => navigate(ROUTES.GUEST_LIST)}
          className={styles.backButton}
        >
          <svg className={styles.backIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Voltar para Lista
        </button>
        <h1 className={styles.title}>Perfil do Hóspede</h1>
      </div>

      <div className={styles.content}>
        {/* Card Principal */}
        <div className={styles.mainCard}>
          <div className={styles.profileHeader}>
            <div className={styles.profileInfo}>
              <div className={styles.avatar}>
                {guest.name.split(' ').map(n => n[0]).join('')}
              </div>
              <div className={styles.guestInfo}>
                <h2 className={styles.name}>{guest.name}</h2>
                <p className={styles.email}>{guest.email}</p>
                <span className={`${styles.status} ${getStatusClass(guest.status)}`}>
                  {getStatusText(guest.status)}
                </span>
              </div>
            </div>
          </div>

          {/* Informações da Estadia */}
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Informações da Estadia</h3>
            <div className={styles.infoGrid}>
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>Quarto</span>
                <span className={styles.infoValue}>{guest.roomNumber}</span>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>Check-in</span>
                <span className={styles.infoValue}>{formatDate(guest.checkIn)}</span>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>Check-out</span>
                <span className={styles.infoValue}>{formatDate(guest.checkOut)}</span>
              </div>
            </div>
          </div>

          {/* Informações Pessoais */}
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Informações Pessoais</h3>
            <div className={styles.infoGrid}>
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>Telefone</span>
                <span className={styles.infoValue}>{guest.phone}</span>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>Documento</span>
                <span className={styles.infoValue}>{guest.document}</span>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>Nacionalidade</span>
                <span className={styles.infoValue}>{guest.nationality}</span>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>Endereço</span>
                <span className={styles.infoValue}>{guest.address}</span>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>Contato de Emergência</span>
                <span className={styles.infoValue}>{guest.emergencyContact}</span>
              </div>
            </div>
          </div>

          {/* Preferências */}
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Preferências</h3>
            <div className="flex flex-wrap gap-2">
              {guest.preferences.map((pref, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-primary-50 text-primary-700 rounded-full text-sm"
                >
                  {pref}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className={styles.sidebar}>
          {/* Ações */}
          <div className={styles.actionCard}>
            <button
              onClick={() => navigate(`${ROUTES.GUEST_LIST}/${id}/edit`)}
              className={`${styles.actionButton} ${styles.primaryButton}`}
            >
              Editar Hóspede
            </button>
            {guest.status === 'checked-in' && (
              <button
                onClick={() => {/* TODO: Implementar check-out */}}
                className={`${styles.actionButton} ${styles.secondaryButton}`}
              >
                Realizar Check-out
              </button>
            )}
          </div>

          {/* Consumo */}
          <div className={styles.consumptionCard}>
            <h3 className={styles.sectionTitle}>Consumo</h3>
            <div className={styles.consumptionList}>
              {consumption.map(item => (
                <div key={item.id} className={styles.consumptionItem}>
                  <span className={styles.consumptionName}>{item.description}</span>
                  <span className={styles.consumptionValue}>{formatCurrency(item.value)}</span>
                </div>
              ))}
            </div>
            <div className={styles.consumptionTotal}>
              <span className={styles.totalLabel}>Total</span>
              <span className={styles.totalValue}>{formatCurrency(getTotalConsumption())}</span>
            </div>
          </div>

          {/* Histórico */}
          <div className={styles.actionCard}>
            <h3 className={styles.sectionTitle}>Histórico</h3>
            <div className={styles.timeline}>
              {timeline.map(event => (
                <div key={event.id} className={styles.timelineItem}>
                  <span className={styles.timelineDate}>{event.date}</span>
                  <h4 className={styles.timelineTitle}>{event.title}</h4>
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

export default GuestProfile;
