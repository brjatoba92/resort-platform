import React, { useState, useEffect } from 'react';
import styles from './RevenueReport.module.css';

interface RevenueStats {
  totalRevenue: number;
  averageDailyRevenue: number;
  occupancyRevenue: number;
  additionalServicesRevenue: number;
  previousPeriodComparison: number;
}

interface RevenueCategory {
  name: string;
  value: number;
  percentage: number;
}

interface DailyRevenue {
  date: string;
  totalRevenue: number;
  occupancyRevenue: number;
  additionalRevenue: number;
  occupancyRate: number;
}

const RevenueReport: React.FC = () => {
  const [period, setPeriod] = useState('week');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [stats, setStats] = useState<RevenueStats>({
    totalRevenue: 150000,
    averageDailyRevenue: 21428.57,
    occupancyRevenue: 120000,
    additionalServicesRevenue: 30000,
    previousPeriodComparison: 12.5
  });
  const [categories, setCategories] = useState<RevenueCategory[]>([]);
  const [dailyData, setDailyData] = useState<DailyRevenue[]>([]);

  useEffect(() => {
    // TODO: Implementar chamada à API
    const mockCategories: RevenueCategory[] = [
      { name: 'Diárias', value: 120000, percentage: 80 },
      { name: 'Restaurante', value: 15000, percentage: 10 },
      { name: 'Serviços de Spa', value: 9000, percentage: 6 },
      { name: 'Room Service', value: 4500, percentage: 3 },
      { name: 'Outros', value: 1500, percentage: 1 }
    ];

    const mockDailyData: DailyRevenue[] = [
      {
        date: '2024-02-14',
        totalRevenue: 20000,
        occupancyRevenue: 16000,
        additionalRevenue: 4000,
        occupancyRate: 65
      },
      {
        date: '2024-02-15',
        totalRevenue: 22000,
        occupancyRevenue: 17500,
        additionalRevenue: 4500,
        occupancyRate: 70
      },
      {
        date: '2024-02-16',
        totalRevenue: 21000,
        occupancyRevenue: 16800,
        additionalRevenue: 4200,
        occupancyRate: 75
      },
      {
        date: '2024-02-17',
        totalRevenue: 23000,
        occupancyRevenue: 18400,
        additionalRevenue: 4600,
        occupancyRate: 80
      },
      {
        date: '2024-02-18',
        totalRevenue: 22500,
        occupancyRevenue: 18000,
        additionalRevenue: 4500,
        occupancyRate: 85
      },
      {
        date: '2024-02-19',
        totalRevenue: 21500,
        occupancyRevenue: 17200,
        additionalRevenue: 4300,
        occupancyRate: 75
      },
      {
        date: '2024-02-20',
        totalRevenue: 20000,
        occupancyRevenue: 16000,
        additionalRevenue: 4000,
        occupancyRate: 70
      }
    ];

    setCategories(mockCategories);
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
        <h1 className={styles.title}>Relatório de Receita</h1>
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
          <div className={`${styles.statValue} ${styles.totalRevenue}`}>
            {formatCurrency(stats.totalRevenue)}
          </div>
          <div className={styles.statLabel}>Receita Total</div>
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
          <div className={`${styles.statValue} ${styles.averageDaily}`}>
            {formatCurrency(stats.averageDailyRevenue)}
          </div>
          <div className={styles.statLabel}>Média Diária</div>
        </div>

        <div className={styles.statCard}>
          <div className={`${styles.statValue} ${styles.occupancyRevenue}`}>
            {formatCurrency(stats.occupancyRevenue)}
          </div>
          <div className={styles.statLabel}>Receita de Diárias</div>
        </div>

        <div className={styles.statCard}>
          <div className={`${styles.statValue} ${styles.additionalRevenue}`}>
            {formatCurrency(stats.additionalServicesRevenue)}
          </div>
          <div className={styles.statLabel}>Serviços Adicionais</div>
        </div>
      </div>

      {/* Gráficos */}
      <div className={styles.chartsGrid}>
        <div className={styles.chartContainer}>
          <h2 className={styles.chartTitle}>Receita Diária</h2>
          <div className={styles.chart}>
            {/* TODO: Implementar gráfico com biblioteca de visualização */}
            <p className="text-gray-500">Gráfico de receita será exibido aqui</p>
          </div>
        </div>

        <div className={styles.chartContainer}>
          <h2 className={styles.chartTitle}>Distribuição da Receita</h2>
          <div className={styles.revenueDetails}>
            {categories.map((category, index) => (
              <div key={index} className={styles.revenueCategory}>
                <div>
                  <span className={styles.categoryName}>{category.name}</span>
                  <span className={styles.categoryPercentage}>
                    {' '}
                    ({formatPercentage(category.percentage)})
                  </span>
                </div>
                <span className={styles.categoryValue}>
                  {formatCurrency(category.value)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tabela de Dados */}
      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead className={styles.tableHeader}>
            <tr>
              <th className={styles.tableHeaderCell}>Data</th>
              <th className={styles.tableHeaderCell}>Receita Total</th>
              <th className={styles.tableHeaderCell}>Diárias</th>
              <th className={styles.tableHeaderCell}>Serviços Adicionais</th>
              <th className={styles.tableHeaderCell}>Taxa de Ocupação</th>
            </tr>
          </thead>
          <tbody className={styles.tableBody}>
            {dailyData.map((day, index) => (
              <tr key={index} className={styles.tableRow}>
                <td className={styles.tableCell}>{formatDate(day.date)}</td>
                <td className={styles.tableCell}>{formatCurrency(day.totalRevenue)}</td>
                <td className={styles.tableCell}>{formatCurrency(day.occupancyRevenue)}</td>
                <td className={styles.tableCell}>{formatCurrency(day.additionalRevenue)}</td>
                <td className={styles.tableCell}>{formatPercentage(day.occupancyRate)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RevenueReport;
