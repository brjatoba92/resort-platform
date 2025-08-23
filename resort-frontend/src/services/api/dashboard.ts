import { api } from './index';

interface DashboardStats {
  totalGuests: number;
  totalRooms: number;
  occupiedRooms: number;
  availableRooms: number;
  todayCheckIns: number;
  todayCheckOuts: number;
  weeklyRevenue: number;
  monthlyRevenue: number;
  upcomingReservations: number;
  averageOccupancy: number;
}

interface RevenueData {
  date: string;
  amount: number;
}

interface OccupancyData {
  date: string;
  occupiedRooms: number;
  totalRooms: number;
}

interface TopRoom {
  roomNumber: string;
  occupancyRate: number;
  revenue: number;
}

interface UpcomingEvent {
  date: string;
  checkIns: number;
  checkOuts: number;
}

export const dashboardService = {
  async getStats(): Promise<DashboardStats> {
    const response = await api.get<DashboardStats>('/dashboard/stats');
    return response.data;
  },

  async getRevenueHistory(period: 'week' | 'month' | 'year'): Promise<RevenueData[]> {
    const response = await api.get<RevenueData[]>('/dashboard/revenue', {
      params: { period },
    });
    return response.data;
  },

  async getOccupancyHistory(period: 'week' | 'month' | 'year'): Promise<OccupancyData[]> {
    const response = await api.get<OccupancyData[]>('/dashboard/occupancy', {
      params: { period },
    });
    return response.data;
  },

  async getTopRooms(limit: number = 5): Promise<TopRoom[]> {
    const response = await api.get<TopRoom[]>('/dashboard/top-rooms', {
      params: { limit },
    });
    return response.data;
  },

  async getUpcomingEvents(days: number = 7): Promise<UpcomingEvent[]> {
    const response = await api.get<UpcomingEvent[]>('/dashboard/upcoming-events', {
      params: { days },
    });
    return response.data;
  },
};