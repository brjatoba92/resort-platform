import pool from "@/database/connection";

export class DashboardService {
    // Obter visão geral do dashboard
    static async getDashboardOverview() {
        try {
            // Executar múltiplas queries em paralelo
            const [
                roomsStats,
                reservationsStats,
                todayStats,
                revenueStats,
            ] = await Promise.all([
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
        } catch (error) {
            console.error("Erro ao obter visão geral do dashboard:", error);
            throw error;
        }
    }

    // Obter estatísticas de quartos
    static async getRoomsStats(): Promise<any> {
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

        const result = await pool.query(query);
        return result.rows[0];
    }

    // Estatísticas das reservas
    static async getReservationsStats(): Promise<any> {
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

        const result = await pool.query(query);
        return result.rows[0];
    }

    // Estatísticas de hoje
    static async getTodayStats(): Promise<any> {
        const query = `
            SELECT
                COUNT(*) AS total,
                COUNT(CASE WHEN check_in_date = CURRENT_DATE THEN 1 END) as checkins_today,
                COUNT(CASE WHEN check_out_date = CURRENT_DATE THEN 1 END) as checkouts_today,
                COUNT(CASE WHEN check_in_date = CURRENT_DATE AND status = 'confirmed' THEN 1 END) as pending_checkins,
                COUNT(CASE WHEN check_out_date = CURRENT_DATE AND status = 'confirmed' THEN 1 END) as pending_checkouts
            FROM reservations
        `;

        const result = await pool.query(query);
        return result.rows[0];
    }

    // Estatísticas de receita
    static async getRevenueStats(): Promise<any> {
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

        const result = await pool.query(query);
        return result.rows[0];
    }

    // Obter ocupação por mês (para graficos)
    static async getOccupancyByMonth(): Promise<any[]> {
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

        const result = await pool.query(query);
        return result.rows;
    }
}