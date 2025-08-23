import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ROUTES } from '../../../utils/constants/routes';
import { SearchFilters, SearchFiltersValues } from '../../../components/common';

interface Reservation {
  id: number;
  guestName: string;
  roomNumber: string;
  checkIn: string;
  checkOut: string;
  status: 'pending' | 'confirmed' | 'checked-in' | 'checked-out' | 'canceled';
  guests: number;
  totalAmount: number;
  paymentStatus: 'pending' | 'partial' | 'paid';
  createdAt: string;
  roomType: string;
}

interface ReservationStats {
  today: number;
  pending: number;
  confirmed: number;
  canceled: number;
}

const ReservationsList: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [filteredReservations, setFilteredReservations] = useState<Reservation[]>([]);
  const [stats, setStats] = useState<ReservationStats>({
    today: 0,
    pending: 0,
    confirmed: 0,
    canceled: 0,
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    // TODO: Implementar chamada à API
    const mockReservations: Reservation[] = [
      {
        id: 1,
        guestName: 'João Silva',
        roomNumber: '101',
        checkIn: '2024-02-20',
        checkOut: '2024-02-25',
        status: 'confirmed',
        guests: 2,
        totalAmount: 1250.0,
        paymentStatus: 'paid',
        createdAt: '2024-02-15',
        roomType: 'standard',
      },
      {
        id: 2,
        guestName: 'Maria Santos',
        roomNumber: '205',
        checkIn: '2024-02-22',
        checkOut: '2024-02-24',
        status: 'pending',
        guests: 3,
        totalAmount: 900.0,
        paymentStatus: 'pending',
        createdAt: '2024-02-16',
        roomType: 'deluxe',
      },
      {
        id: 3,
        guestName: 'Pedro Costa',
        roomNumber: '304',
        checkIn: '2024-02-18',
        checkOut: '2024-02-23',
        status: 'checked-in',
        guests: 2,
        totalAmount: 1500.0,
        paymentStatus: 'partial',
        createdAt: '2024-02-17',
        roomType: 'suite',
      },
    ];

    setReservations(mockReservations);
    setFilteredReservations(mockReservations);
    setStats({
      today: 5,
      pending: 8,
      confirmed: 12,
      canceled: 2,
    });
    updateTotalPages(mockReservations.length);
  }, []);

  const updateTotalPages = (totalItems: number) => {
    setTotalPages(Math.ceil(totalItems / itemsPerPage));
  };

  const handleFiltersSubmit = (values: SearchFiltersValues) => {
    const filtered = reservations.filter((reservation) => {
      const matchesSearch =
        !values.searchTerm ||
        reservation.guestName.toLowerCase().includes(values.searchTerm.toLowerCase());

      const matchesStatus = !values.status || reservation.status === values.status;

      const matchesDateRange =
        (!values.dateRange.start && !values.dateRange.end) ||
        ((!values.dateRange.start ||
          new Date(reservation.checkIn) >= new Date(values.dateRange.start)) &&
          (!values.dateRange.end ||
            new Date(reservation.checkOut) <= new Date(values.dateRange.end)));

      const matchesRoomType = !values.roomType || reservation.roomType === values.roomType;

      const matchesGuestCount =
        !values.guestCount ||
        (values.guestCount === '4' ? reservation.guests >= 4 : reservation.guests === Number(values.guestCount));

      const matchesPriceRange =
        (!values.priceRange.min || reservation.totalAmount >= Number(values.priceRange.min)) &&
        (!values.priceRange.max || reservation.totalAmount <= Number(values.priceRange.max));

      return (
        matchesSearch &&
        matchesStatus &&
        matchesDateRange &&
        matchesRoomType &&
        matchesGuestCount &&
        matchesPriceRange
      );
    });

    setFilteredReservations(filtered);
    setCurrentPage(1);
    updateTotalPages(filtered.length);
  };

  const handleFiltersReset = () => {
    setFilteredReservations(reservations);
    setCurrentPage(1);
    updateTotalPages(reservations.length);
  };

  const getStatusClass = (status: Reservation['status']) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'checked-in':
        return 'bg-blue-100 text-blue-800';
      case 'checked-out':
        return 'bg-gray-100 text-gray-800';
      case 'canceled':
        return 'bg-red-100 text-red-800';
      default:
        return '';
    }
  };

  const getStatusText = (status: Reservation['status']) => {
    switch (status) {
      case 'pending':
        return t('reservations.status.pending');
      case 'confirmed':
        return t('reservations.status.confirmed');
      case 'checked-in':
        return t('reservations.status.checkedIn');
      case 'checked-out':
        return t('reservations.status.checkedOut');
      case 'canceled':
        return t('reservations.status.canceled');
      default:
        return status;
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const getCurrentPageItems = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredReservations.slice(startIndex, endIndex);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">{t('reservations.title')}</h1>
        <button
          onClick={() => navigate(ROUTES.RESERVATION_LIST + '/new')}
          className="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700 flex items-center"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          {t('reservations.newReservation')}
        </button>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="text-3xl font-bold text-blue-600">{stats.today}</div>
          <div className="text-gray-600">{t('reservations.stats.today')}</div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="text-3xl font-bold text-yellow-600">{stats.pending}</div>
          <div className="text-gray-600">{t('reservations.stats.pending')}</div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="text-3xl font-bold text-green-600">{stats.confirmed}</div>
          <div className="text-gray-600">{t('reservations.stats.confirmed')}</div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="text-3xl font-bold text-red-600">{stats.canceled}</div>
          <div className="text-gray-600">{t('reservations.stats.canceled')}</div>
        </div>
      </div>

      {/* Filtros */}
      <div className="mb-8">
        <SearchFilters onSubmit={handleFiltersSubmit} onReset={handleFiltersReset} />
      </div>

      {/* Tabela de Reservas */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('reservations.table.guest')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('reservations.table.room')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('reservations.table.checkIn')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('reservations.table.checkOut')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('reservations.table.status')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('reservations.table.amount')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('reservations.table.actions')}
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {getCurrentPageItems().map((reservation) => (
                <tr key={reservation.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">{reservation.guestName}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{reservation.roomNumber}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{formatDate(reservation.checkIn)}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{formatDate(reservation.checkOut)}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusClass(
                        reservation.status
                      )}`}
                    >
                      {getStatusText(reservation.status)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {formatCurrency(reservation.totalAmount)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => navigate(`${ROUTES.RESERVATION_LIST}/${reservation.id}`)}
                        className="text-blue-600 hover:text-blue-900"
                        title={t('common.view')}
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                          />
                        </svg>
                      </button>
                      <button
                        onClick={() => navigate(`${ROUTES.RESERVATION_LIST}/${reservation.id}/edit`)}
                        className="text-green-600 hover:text-green-900"
                        title={t('common.edit')}
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                          />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Paginação */}
      <div className="flex items-center justify-between mt-6">
        <div className="text-sm text-gray-700">
          {t('common.pagination.showing', {
            start: (currentPage - 1) * itemsPerPage + 1,
            end: Math.min(currentPage * itemsPerPage, filteredReservations.length),
            total: filteredReservations.length,
          })}
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className={`px-3 py-1 rounded-md ${
              currentPage === 1
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            {t('common.pagination.previous')}
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`px-3 py-1 rounded-md ${
                currentPage === page
                  ? 'bg-primary-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              {page}
            </button>
          ))}
          <button
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className={`px-3 py-1 rounded-md ${
              currentPage === totalPages
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            {t('common.pagination.next')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReservationsList;