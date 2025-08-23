import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../../utils/constants/routes';
import styles from './GuestsList.module.css';

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
}

const GuestsList: React.FC = () => {
  const navigate = useNavigate();
  const [guests, setGuests] = useState<Guest[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    // TODO: Implementar chamada à API
    const mockGuests: Guest[] = [
      {
        id: 1,
        name: 'Ana Silva',
        email: 'ana.silva@email.com',
        phone: '(11) 98765-4321',
        status: 'checked-in',
        checkIn: '2024-02-15',
        checkOut: '2024-02-20',
        roomNumber: '304',
        nationality: 'Brasileira',
        document: '123.456.789-00'
      },
      {
        id: 2,
        name: 'John Doe',
        email: 'john.doe@email.com',
        phone: '(11) 91234-5678',
        status: 'reserved',
        checkIn: '2024-03-01',
        checkOut: '2024-03-05',
        roomNumber: '405',
        nationality: 'Americana',
        document: '987.654.321-00'
      },
      {
        id: 3,
        name: 'Maria Santos',
        email: 'maria.santos@email.com',
        phone: '(11) 94567-8901',
        status: 'checked-out',
        checkIn: '2024-02-10',
        checkOut: '2024-02-15',
        roomNumber: '201',
        nationality: 'Brasileira',
        document: '456.789.123-00'
      }
    ];

    setGuests(mockGuests);
    setTotalPages(3); // Mock
  }, []);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleStatusFilter = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setStatusFilter(e.target.value);
    setCurrentPage(1);
  };

  const handleDateFilter = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDateFilter(e.target.value);
    setCurrentPage(1);
  };

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

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Hóspedes</h1>
        <button
          onClick={() => navigate(ROUTES.GUEST_LIST + '/new')}
          className={styles.addButton}
        >
          <svg className={styles.addIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Novo Hóspede
        </button>
      </div>

      {/* Filtros */}
      <div className={styles.filters}>
        <input
          type="text"
          placeholder="Buscar hóspede..."
          value={searchTerm}
          onChange={handleSearch}
          className={styles.searchInput}
        />
        <select
          value={statusFilter}
          onChange={handleStatusFilter}
          className={styles.filterSelect}
        >
          <option value="all">Todos os Status</option>
          <option value="checked-in">Check-in Realizado</option>
          <option value="checked-out">Check-out Realizado</option>
          <option value="reserved">Reservado</option>
        </select>
        <input
          type="date"
          value={dateFilter}
          onChange={handleDateFilter}
          className={styles.dateInput}
          placeholder="Filtrar por data"
        />
      </div>

      {/* Lista de Hóspedes */}
      <div className={styles.guestsGrid}>
        {guests.map(guest => (
          <div key={guest.id} className={styles.guestCard}>
            <div className={styles.guestHeader}>
              <div className={styles.guestInfo}>
                <h3 className={styles.guestName}>{guest.name}</h3>
                <p className={styles.guestEmail}>{guest.email}</p>
              </div>
              <span className={`${styles.guestStatus} ${getStatusClass(guest.status)}`}>
                {getStatusText(guest.status)}
              </span>
            </div>

            <div className={styles.guestDetails}>
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>Quarto</span>
                <span className={styles.detailValue}>{guest.roomNumber || '-'}</span>
              </div>
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>Check-in</span>
                <span className={styles.detailValue}>{formatDate(guest.checkIn)}</span>
              </div>
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>Check-out</span>
                <span className={styles.detailValue}>{formatDate(guest.checkOut)}</span>
              </div>
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>Telefone</span>
                <span className={styles.detailValue}>{guest.phone}</span>
              </div>
            </div>

            <div className={styles.guestActions}>
              <button
                onClick={() => navigate(`${ROUTES.GUEST_LIST}/${guest.id}`)}
                className={styles.actionButton}
                title="Ver detalhes"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </button>
              <button
                onClick={() => navigate(`${ROUTES.GUEST_LIST}/${guest.id}/edit`)}
                className={styles.actionButton}
                title="Editar"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Paginação */}
      <div className={styles.pagination}>
        <div className={styles.paginationInfo}>
          <p>
            Página <span className="font-medium">{currentPage}</span> de{' '}
            <span className="font-medium">{totalPages}</span>
          </p>
        </div>
        <div className={styles.paginationButtons}>
          <button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className={`${styles.paginationButton} ${currentPage === 1 ? styles.paginationButtonDisabled : ''}`}
          >
            Anterior
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`${styles.paginationButton} ${
                currentPage === page ? styles.paginationButtonActive : ''
              }`}
            >
              {page}
            </button>
          ))}
          <button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className={`${styles.paginationButton} ${currentPage === totalPages ? styles.paginationButtonDisabled : ''}`}
          >
            Próxima
          </button>
        </div>
      </div>
    </div>
  );
};

export default GuestsList;
