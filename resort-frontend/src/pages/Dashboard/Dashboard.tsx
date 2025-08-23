import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  UsersIcon,
  CurrencyDollarIcon,
  CalendarIcon,
  SunIcon,
} from '@heroicons/react/24/outline';
import { OccupancyChart, MetricsCard } from '../../components/dashboard';
import styles from './Dashboard.module.css';

interface DashboardStats {
  occupancy: {
    percentage: number;
    occupied: number;
    total: number;
    trend: number;
  };
  reservations: {
    today: number;
    checkIns: number;
    checkOuts: number;
    trend: number;
  };
  revenue: {
    daily: number;
    change: number;
  };
  weather: {
    temperature: number;
    condition: string;
  };
}

interface Activity {
  id: number;
  title: string;
  description: string;
  time: string;
  type: 'check-in' | 'check-out' | 'reservation' | 'maintenance';
}

interface OccupancyData {
  date: string;
  occupancyRate: number;
  revenue: number;
}

const Dashboard: React.FC = () => {
  const { t } = useTranslation();
  const [stats, setStats] = useState<DashboardStats>({
    occupancy: { percentage: 75, occupied: 32, total: 40, trend: 5 },
    reservations: { today: 12, checkIns: 5, checkOuts: 7, trend: 8 },
    revenue: { daily: 15750, change: 12 },
    weather: { temperature: 28, condition: 'Ensolarado' }
  });

  const [activities, setActivities] = useState<Activity[]>([
    {
      id: 1,
      title: 'Check-in realizado',
      description: 'João Silva - Quarto 204',
      time: 'Há 5 minutos',
      type: 'check-in'
    },
    {
      id: 2,
      title: 'Nova reserva',
      description: 'Maria Santos - 3 noites',
      time: 'Há 15 minutos',
      type: 'reservation'
    },
    {
      id: 3,
      title: 'Manutenção agendada',
      description: 'Quarto 305 - Ar condicionado',
      time: 'Há 30 minutos',
      type: 'maintenance'
    }
  ]);

  const [occupancyData, setOccupancyData] = useState<OccupancyData[]>([
    { date: '2024-08-16', occupancyRate: 65, revenue: 12500 },
    { date: '2024-08-17', occupancyRate: 70, revenue: 13200 },
    { date: '2024-08-18', occupancyRate: 72, revenue: 14000 },
    { date: '2024-08-19', occupancyRate: 68, revenue: 13800 },
    { date: '2024-08-20', occupancyRate: 75, revenue: 15750 },
  ]);

  useEffect(() => {
    // TODO: Implementar chamadas à API para buscar dados reais
    // fetchDashboardStats();
    // fetchRecentActivities();
    // fetchOccupancyData();
  }, []);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">{t('dashboard.title')}</h1>

      {/* Métricas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <MetricsCard
          title={t('dashboard.metrics.occupancy')}
          value={`${stats.occupancy.percentage}%`}
          description={t('dashboard.metrics.occupancyDescription', {
            occupied: stats.occupancy.occupied,
            total: stats.occupancy.total,
          })}
          trend={{ value: stats.occupancy.trend, isPositive: true }}
          icon={<UsersIcon className="h-8 w-8" />}
        />

        <MetricsCard
          title={t('dashboard.metrics.reservations')}
          value={stats.reservations.today}
          description={t('dashboard.metrics.reservationsDescription', {
            checkIns: stats.reservations.checkIns,
            checkOuts: stats.reservations.checkOuts,
          })}
          trend={{ value: stats.reservations.trend, isPositive: true }}
          icon={<CalendarIcon className="h-8 w-8" />}
        />

        <MetricsCard
          title={t('dashboard.metrics.revenue')}
          value={formatCurrency(stats.revenue.daily)}
          description={t('dashboard.metrics.revenueDescription')}
          trend={{ value: stats.revenue.change, isPositive: true }}
          icon={<CurrencyDollarIcon className="h-8 w-8" />}
        />

        <MetricsCard
          title={t('dashboard.metrics.weather')}
          value={`${stats.weather.temperature}°C`}
          description={stats.weather.condition}
          icon={<SunIcon className="h-8 w-8" />}
        />
      </div>

      {/* Gráfico de Ocupação */}
      <div className="mb-8">
        <OccupancyChart data={occupancyData} />
      </div>

      {/* Atividades Recentes */}
      <section className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">{t('dashboard.activities.title')}</h2>
        <div className="space-y-4">
          {activities.map(activity => (
            <div
              key={activity.id}
              className="border-b last:border-b-0 pb-4 last:pb-0"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium">{activity.title}</h3>
                  <p className="text-sm text-gray-600">{activity.description}</p>
                </div>
                <span className="text-sm text-gray-500">{activity.time}</span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Dashboard;