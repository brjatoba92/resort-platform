import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { useTranslation } from 'react-i18next';
import styles from './OccupancyChart.module.css';

interface OccupancyData {
  date: string;
  occupancyRate: number;
  revenue: number;
}

interface OccupancyChartProps {
  data: OccupancyData[];
}

export const OccupancyChart: React.FC<OccupancyChartProps> = ({ data }) => {
  const { t } = useTranslation();

  return (
    <div className={styles.container}>
      <h2 className={styles.header}>{t('dashboard.occupancy.title')}</h2>
      <div className={styles.chartContainer}>
        <div className={styles.chart}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={data}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip />
              <Legend />
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="occupancyRate"
                name={t('dashboard.occupancy.rate')}
                stroke="#3182ce"
                activeDot={{ r: 8 }}
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="revenue"
                name={t('dashboard.occupancy.revenue')}
                stroke="#38a169"
                activeDot={{ r: 8 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};