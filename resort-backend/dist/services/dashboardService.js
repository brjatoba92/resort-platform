"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DashboardService = void 0;
const connection_1 = __importDefault(require("@/database/connection"));
class DashboardService {
    static async getDashboardOverview() {
        try {
            const [roomsStats, reservationsStats, todayStats, revenueStats,] = await Promise.all([
                DashboardService.getRoomsStats(),
                DashboardService.getReservationsStats(),
                DashboardService.getTodayStats(),
                DashboardService.getRevenueStats()
            ]);
            return {
                rooms: roomsStats,
                reservations: reservationsStats,
                today: todayStats,
                revenue: revenueStats,
            };
        }
        catch (error) {
            console.error("Erro ao obter visão geral do dashboard:", error);
            throw error;
        }
    }
    static async getRoomsStats() {
        const query = `
            SELECT
                COUNT(*) AS total,
                COUNT(CASE WHEN status = 'occupied' THEN 1 END) as occupied,
                COUNT(CASE WHEN status = 'available' THEN 1 END) as available,
                COUNT(CASE WHEN status = 'cleaning' THEN 1 END) as cleaning,
                COUNT(CASE WHEN status = 'maintenance' THEN 1 END) as maintenance,
            COUNT(CASE WHEN id IN (
                SELECT room_id FROM reservations
                WHERE status = 'confirmed' AND check_in_date = CURRENT_DATE
            ) THEN 1 END) as reserved_for_today
            FROM rooms
        `;
        const result = await connection_1.default.query(query);
        return result.rows[0];
    }
    static async getReservationsStats() {
        const query = `
            SELECT
                COUNT(*) AS total,
                COUNT(CASE WHEN status = 'confirmed' THEN 1 END) as confirmed,
                COUNT(CASE WHEN status = 'pending' THEN 1 END) as pending,
                COUNT(CASE WHEN status = 'check_in' THEN 1 END) as check_in,
                COUNT(CASE WHEN status = 'check_out' THEN 1 END) as check_out,
                COUNT(CASE WHEN status = 'cancelled' THEN 1 END) as cancelled
            FROM reservations
            WHERE created_at >= CURRENT_DATE - INTERVAL '30 days'
        `;
        const result = await connection_1.default.query(query);
        return result.rows[0];
    }
    static async getTodayStats() {
        const query = `
            SELECT
                COUNT(*) AS total,
                COUNT(CASE WHEN check_in_date = CURRENT_DATE THEN 1 END) as checkins_today,
                COUNT(CASE WHEN check_out_date = CURRENT_DATE THEN 1 END) as checkouts_today,
                COUNT(CASE WHEN check_in_date = CURRENT_DATE AND status = 'confirmed' THEN 1 END) as pending_checkins,
                COUNT(CASE WHEN check_out_date = CURRENT_DATE AND status = 'confirmed' THEN 1 END) as pending_checkouts
            FROM reservations
        `;
        const result = await connection_1.default.query(query);
        return result.rows[0];
    }
    static async getRevenueStats() {
        const query = `
            SELECT
                COALESCE(SUM(CASE WHEN DATE(created_at) = CURRENT_DATE THEN total_amount END), 0) as today,
                COALESCE(SUM(CASE WHEN DATE(created_at) >= DATE_TRUNC('week', CURRENT_DATE) THEN total_amount END), 0) as this_week,
                COALESCE(SUM(CASE WHEN DATE(created_at) >= DATE_TRUNC('month', CURRENT_DATE) THEN total_amount END), 0) as this_month,
                COALESCE(SUM(CASE WHEN DATE(created_at) >= DATE_TRUNC('year', CURRENT_DATE) THEN total_amount END), 0) as this_year
            FROM reservations
            WHERE status IN ('confirmed', 'check_in', 'check_out')
                AND created_at >= CURRENT_DATE - INTERVAL '12 months'
        `;
        const result = await connection_1.default.query(query);
        return result.rows[0];
    }
    static async getOccupancyByMonth() {
        const query = `
            SELECT
                DATE_TRUNC('month', check_in_date) as month,
                COUNT(*) as total_reservations,
                COUNT(CASE WHEN status = 'checked_out' THEN 1 END) as completed_stays,
                SUM(total_amount) as revenue
            FROM reservations
            WHERE check_in_date >= CURRENT_DATE - INTERVAL '12 months'
            GROUP BY DATE_TRUNC('month', check_in_date)
            ORDER BY DATE_TRUNC('month', check_in_date)
        `;
        const result = await connection_1.default.query(query);
        return result.rows;
    }
}
exports.DashboardService = DashboardService;
//# sourceMappingURL=dashboardService.js.map