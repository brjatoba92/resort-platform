export declare class DashboardService {
    static getDashboardOverview(): Promise<{
        rooms: any;
        reservations: any;
        today: any;
        revenue: any;
    }>;
    static getRoomsStats(): Promise<any>;
    static getReservationsStats(): Promise<any>;
    static getTodayStats(): Promise<any>;
    static getRevenueStats(): Promise<any>;
    static getOccupancyByMonth(): Promise<any[]>;
}
//# sourceMappingURL=dashboardService.d.ts.map