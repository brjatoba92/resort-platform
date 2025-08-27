import React, { useState } from 'react';
import { Layout } from '../../../components/layout';
import styles from './RevenueReport.module.css';

interface RevenueData {
  date: string;
  roomRevenue: number;
  foodRevenue: number;
  spaRevenue: number;
  otherRevenue: number;
  totalRevenue: number;
  expenses: number;
  netRevenue: number;
}

interface MonthlyStats {
  month: string;
  totalRevenue: number;
  percentageChange: number;
  topSource: string;
}

interface RevenueBySource {
  source: string;
  amount: number;
  percentage: number;
}

export const RevenueReport: React.FC = () => {
  const [dateRange, setDateRange] = useState({
    start: '',
    end: ''
  });

  // Mock data - replace with actual API call
  const dailyRevenue: RevenueData[] = [
    {
      date: '2024-02-15',
      roomRevenue: 5000,
      foodRevenue: 1200,
      spaRevenue: 800,
      otherRevenue: 300,
      totalRevenue: 7300,
      expenses: 3000,
      netRevenue: 4300
    },
    // Add more daily data...
  ];

  const monthlyStats: MonthlyStats[] = [
    {
      month: 'February 2024',
      totalRevenue: 205000,
      percentageChange: 12.5,
      topSource: 'Room Revenue'
    },
    // Add more monthly stats...
  ];

  const revenueBySource: RevenueBySource[] = [
    {
      source: 'Room Revenue',
      amount: 150000,
      percentage: 73.17
    },
    {
      source: 'Food & Beverage',
      amount: 35000,
      percentage: 17.07
    },
    {
      source: 'Spa Services',
      amount: 15000,
      percentage: 7.32
    },
    {
      source: 'Other Services',
      amount: 5000,
      percentage: 2.44
    }
  ];

  const totalRevenue = revenueBySource.reduce((sum, item) => sum + item.amount, 0);
  const totalExpenses = dailyRevenue.reduce((sum, day) => sum + day.expenses, 0);
  const netRevenue = dailyRevenue.reduce((sum, day) => sum + day.netRevenue, 0);

  const getPercentageChangeColor = (change: number) => {
    if (change > 0) return styles.positive;
    if (change < 0) return styles.negative;
    return '';
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  return (
    <Layout>
      <div className={styles.revenueReport}>
        <div className={styles.header}>
          <h1>Revenue Report</h1>
          <div className={styles.dateFilters}>
            <input
              type="date"
              value={dateRange.start}
              onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
              className={styles.dateInput}
            />
            <span>to</span>
            <input
              type="date"
              value={dateRange.end}
              onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
              className={styles.dateInput}
            />
          </div>
        </div>

        <div className={styles.summary}>
          <div className={styles.summaryCard}>
            <h3>Total Revenue</h3>
            <span className={styles.amount}>{formatCurrency(totalRevenue)}</span>
          </div>
          <div className={styles.summaryCard}>
            <h3>Total Expenses</h3>
            <span className={styles.amount}>{formatCurrency(totalExpenses)}</span>
          </div>
          <div className={styles.summaryCard}>
            <h3>Net Revenue</h3>
            <span className={styles.amount}>{formatCurrency(netRevenue)}</span>
          </div>
        </div>

        <div className={styles.content}>
          <div className={styles.mainSection}>
            <div className={styles.card}>
              <h2>Daily Revenue</h2>
              <div className={styles.table}>
                <table>
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Room Revenue</th>
                      <th>F&B Revenue</th>
                      <th>Spa Revenue</th>
                      <th>Other Revenue</th>
                      <th>Total Revenue</th>
                      <th>Expenses</th>
                      <th>Net Revenue</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dailyRevenue.map(day => (
                      <tr key={day.date}>
                        <td>{day.date}</td>
                        <td>{formatCurrency(day.roomRevenue)}</td>
                        <td>{formatCurrency(day.foodRevenue)}</td>
                        <td>{formatCurrency(day.spaRevenue)}</td>
                        <td>{formatCurrency(day.otherRevenue)}</td>
                        <td>{formatCurrency(day.totalRevenue)}</td>
                        <td>{formatCurrency(day.expenses)}</td>
                        <td>{formatCurrency(day.netRevenue)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div className={styles.sidebar}>
            <div className={styles.card}>
              <h2>Monthly Overview</h2>
              <div className={styles.monthlyStats}>
                {monthlyStats.map(stat => (
                  <div key={stat.month} className={styles.monthlyStat}>
                    <div className={styles.monthlyHeader}>
                      <h4>{stat.month}</h4>
                      <span className={`${styles.percentageChange} ${getPercentageChangeColor(stat.percentageChange)}`}>
                        {stat.percentageChange > 0 ? '+' : ''}{stat.percentageChange}%
                      </span>
                    </div>
                    <div className={styles.monthlyDetails}>
                      <div className={styles.monthlyRevenue}>
                        <span>Total Revenue</span>
                        <span>{formatCurrency(stat.totalRevenue)}</span>
                      </div>
                      <div className={styles.monthlyTopSource}>
                        <span>Top Source</span>
                        <span>{stat.topSource}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className={styles.card}>
              <h2>Revenue by Source</h2>
              <div className={styles.sourcesChart}>
                <div className={styles.sourceBars}>
                  {revenueBySource.map(source => (
                    <div key={source.source} className={styles.sourceBar}>
                      <div className={styles.sourceInfo}>
                        <span className={styles.sourceName}>{source.source}</span>
                        <span className={styles.sourceAmount}>{formatCurrency(source.amount)}</span>
                      </div>
                      <div className={styles.barContainer}>
                        <div
                          className={styles.bar}
                          style={{ width: `${source.percentage}%` }}
                        />
                        <span className={styles.percentage}>{source.percentage.toFixed(1)}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};
