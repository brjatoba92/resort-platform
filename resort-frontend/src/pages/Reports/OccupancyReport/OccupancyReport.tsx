import React, { useState, useEffect } from 'react';
import styles from './OccupancyReport.module.css';

interface OccupancyStats {
  currentOccupancy: number;
  averageOccupancy: number;
  totalRooms: number;
  occupiedRooms: number;
  revenue: number;
  previousPeriodComparison: number;
}

interface DailyOccupancy {
  date: string;
  occupancyRate: number;
  occupiedRooms: number;
  revenue: number;
}

const OccupancyReport: React.FC = () => {
  const [period, setPeriod] = useState('week');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [stats, setStats] = useState<OccupancyStats>({
    currentOccupancy: 75,
    averageOccupancy: 68,
    totalRooms: 40,
    occupiedRooms: 30,
    revenue: 45000,
    previousPeriodComparison: 8.5
  });
  const [dailyData, setDailyData] = useState<DailyOccupancy[]>([]);

  useEffect(() => {
    // TODO: Implementar chamada à API
    const mockDailyData: DailyOccupancy[] = [
      { date: '2024-02-14', occupancyRate: 65, occupiedRooms: 26, revenue: 39000 },
      { date: '2024-02-15', occupancyRate: 70, occupiedRooms: 28, revenue: 42000 },
      { date: '2024-02-16', occupancyRate: 75, occupiedRooms: 30, revenue: 45000 },
      { date: '2024-02-17', occupancyRate: 80, occupiedRooms: 32, revenue: 48000 },
      { date: '2024-02-18', occupancyRate: 85, occupiedRooms: 34, revenue: 51000 },
      { date: '2024-02-19', occupancyRate: 75, occupiedRooms: 30, revenue: 45000 },
      { date: '2024-02-20', occupancyRate: 70, occupiedRooms: 28, revenue: 42000 }
    ];

    setDailyData(mockDailyData);
  }, [period, startDate, endDate]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const formatPercentage = (value: number) => {
    return `${value.toFixed(1)}%`;
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Relatório de Ocupação</h1>
      </div>

      {/* Filtros */}
      <div className={styles.filters}>
        <select
          value={period}
          onChange={(e) => setPeriod(e.target.value)}
          className={styles.filterSelect}
        >
          <option value="week">Última Semana</option>
          <option value="month">Último Mês</option>
          <option value="quarter">Último Trimestre</option>
          <option value="custom">Período Personalizado</option>
        </select>

        {period === 'custom' && (
          <>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className={styles.dateInput}
            />
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className={styles.dateInput}
            />
          </>
        )}
      </div>

      {/* Estatísticas */}
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={`${styles.statValue} ${styles.occupancyRate}`}>
            {formatPercentage(stats.currentOccupancy)}
          </div>
          <div className={styles.statLabel}>Taxa de Ocupação Atual</div>
          <div className={styles.indicator}>
            <svg
              className={`${styles.indicatorIcon} ${
                stats.previousPeriodComparison >= 0 ? styles.indicatorUp : styles.indicatorDown
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d={
                  stats.previousPeriodComparison >= 0
                    ? 'M13 7h8m0 0v8m0-8l-8 8-4-4-6 6'
                    : 'M13 17h8m0 0v-8m0 8l-8-8-4 4-6-6'
                }
              />
            </svg>
            <span className="text-sm">
              {stats.previousPeriodComparison >= 0 ? '+' : ''}
              {stats.previousPeriodComparison}% vs período anterior
            </span>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={`${styles.statValue} ${styles.averageRate}`}>
            {formatPercentage(stats.averageOccupancy)}
          </div>
          <div className={styles.statLabel}>Média de Ocupação</div>
          <div className="text-sm text-gray-500">
            {stats.occupiedRooms} de {stats.totalRooms} quartos
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={`${styles.statValue} ${styles.revenue}`}>
            {formatCurrency(stats.revenue)}
          </div>
          <div className={styles.statLabel}>Receita Total</div>
        </div>
      </div>

      {/* Gráfico */}
      <div className={styles.chartContainer}>
        <h2 className={styles.chartTitle}>Ocupação Diária</h2>
        <div className={styles.chart}>
          {/* TODO: Implementar gráfico com biblioteca de visualização */}
          <p className="text-gray-500">Gráfico de ocupação será exibido aqui</p>
        </div>
      </div>

      {/* Tabela de Dados */}
      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead className={styles.tableHeader}>
            <tr>
              <th className={styles.tableHeaderCell}>Data</th>
              <th className={styles.tableHeaderCell}>Taxa de Ocupação</th>
              <th className={styles.tableHeaderCell}>Quartos Ocupados</th>
              <th className={styles.tableHeaderCell}>Receita</th>
            </tr>
          </thead>
          <tbody className={styles.tableBody}>
            {dailyData.map((day, index) => (
              <tr key={index} className={styles.tableRow}>
                <td className={styles.tableCell}>{formatDate(day.date)}</td>
                <td className={styles.tableCell}>{formatPercentage(day.occupancyRate)}</td>
                <td className={styles.tableCell}>{day.occupiedRooms}</td>
                <td className={styles.tableCell}>{formatCurrency(day.revenue)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OccupancyReport;
