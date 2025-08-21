"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReservationService = void 0;
const connection_1 = __importDefault(require("../database/connection"));
class ReservationService {
    static async getReservations(filters = {}) {
        const page = filters.page || 1;
        const limit = filters.limit || 10;
        const offset = (page - 1) * limit;
        let query = `
                SELECT r.*, g.name as guest_name, g.email as guest_email, g.phone as guest_phone,
                room.number as room_number, room.type as room_type,
                u.name as user_name
            FROM reservations r
            LEFT JOIN guests g ON r.guest_id = g.id
            LEFT JOIN rooms room ON r.room_id = room.id
            LEFT JOIN users u ON r.user_id = u.id
            WHERE 1=1
            `;
        let countQuery = `
                SELECT COUNT(*) as total
                FROM reservations r
                WHERE 1=1
            `;
        const queryParams = [];
        const countParams = [];
        let paramIndex = 1;
        if (filters.status) {
            query += ` AND r.status = $${paramIndex}`;
            countQuery += ` AND r.status = $${paramIndex}`;
            queryParams.push(filters.status);
            countParams.push(filters.status);
            paramIndex++;
        }
        if (filters.room_id) {
            query += ` AND r.room_id = $${paramIndex}`;
            countQuery += ` AND r.room_id = $${paramIndex}`;
            queryParams.push(filters.room_id);
            countParams.push(filters.room_id);
            paramIndex++;
        }
        if (filters.date_from) {
            query += ` AND r.check_in_date >= $${paramIndex}`;
            countQuery += ` AND r.check_in_date >= $${paramIndex}`;
            queryParams.push(filters.date_from);
            countParams.push(filters.date_from);
            paramIndex++;
        }
        if (filters.date_to) {
            query += ` AND r.check_out_date <= $${paramIndex}`;
            countQuery += ` AND r.check_out_date <= $${paramIndex}`;
            queryParams.push(filters.date_to);
            countParams.push(filters.date_to);
            paramIndex++;
        }
        query += ` ORDER BY r.check_in_date DESC LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
        queryParams.push(limit, offset);
        const [reservationsResult, countResult] = await Promise.all([
            connection_1.default.query(query, queryParams),
            connection_1.default.query(countQuery, countParams)
        ]);
        const total = parseInt(countResult.rows[0].total);
        const totalPages = Math.ceil(total / limit);
        return {
            reservations: reservationsResult.rows,
            total,
            pagination: {
                page,
                limit,
                total,
                totalPages,
                hasNext: page < totalPages,
                hasPrev: page > 1,
            }
        };
    }
    static async getReservationById(id) {
        const query = `
            SELECT r.*, g.name as guest_name, g.email as guest_email, g.phone as guest_phone,
                g.document as guest_document, g.nationality as guest_nationality,
                room.number as room_number, room.type as room_type, room.capacity as room_capacity,
                u.name as created_by_name
            FROM reservations r
            LEFT JOIN guests g ON r.guest_id = g.id
            LEFT JOIN rooms room ON r.room_id = room.id
            LEFT JOIN users u ON r.user_id = u.id
            WHERE r.id = $1
        `;
        const result = await connection_1.default.query(query, [id]);
        return result.rows[0] || null;
    }
    static async createReservation(reservationData) {
        const client = await connection_1.default.connect();
        try {
            await client.query('BEGIN');
            const reservationQuery = `
                INSERT INTO reservations
                (guest_id, room_id, check_in_date, check_out_date, total_guests, total_amount, special_requests, created_by)
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
                RETURNING *
            `;
            const reservationValue = [
                reservationData.guest_id,
                reservationData.room_id,
                reservationData.check_in_date,
                reservationData.check_out_date,
                reservationData.total_guests,
                reservationData.total_amount,
                reservationData.special_requests,
                reservationData.created_by,
            ];
            const reservationResult = await client.query(reservationQuery, reservationValue);
            const reservation = reservationResult.rows[0];
            const fullReservationQuery = `
                SELECT r.*, g.name as guest_name, g.email as guest_email, g.phone as guest_phone,
                    g.document as guest_document, g.nationality as guest_nationality,
                    room.number as room_number, room.type as room_type, room.capacity as room_capacity,
                    u.name as created_by_name
                FROM reservations r
                LEFT JOIN guests g ON r.guest_id = g.id
                LEFT JOIN rooms room ON r.room_id = room.id
                LEFT JOIN users u ON r.user_id = u.id
                WHERE r.id = $1
            `;
            const fullResult = await client.query(fullReservationQuery, [reservation.id]);
            await client.query('COMMIT');
            return fullResult.rows[0];
        }
        catch (error) {
            await client.query('ROLLBACK');
            throw error;
        }
        finally {
            client.release();
        }
    }
    static async checkIn(reservationId) {
        const client = await connection_1.default.connect();
        try {
            await client.query('BEGIN');
            const reservationQuery = `
                UPDATE reservations
                SET status = 'checked_in', check_in_date = NOW(), updated_at = NOW()
                WHERE id = $1 AND status = 'confirmed'
                RETURNING *
            `;
            const reservationResult = await client.query(reservationQuery, [reservationId]);
            if (reservationResult.rows.length === 0) {
                await client.query('ROLLBACK');
                return null;
            }
            const reservation = reservationResult.rows[0];
            await client.query(`
                UPDATE rooms
                SET status = 'occupied', updated_at = NOW()
                WHERE id = $1`, [reservation.room_id]);
            await client.query('COMMIT');
            return await this.getReservationById(reservationId);
        }
        catch (error) {
            await client.query('ROLLBACK');
            throw error;
        }
        finally {
            client.release();
        }
    }
    static async checkOut(reservationId, additionalCharges = 0) {
        const client = await connection_1.default.connect();
        try {
            await client.query('BEGIN');
            const reservationQuery = `
                UPDATE reservations
                SET status = 'checked_out', 
                    actual_check_out = NOW(), 
                    total_amount = total_amount + $2,
                    updated_at = NOW()
                WHERE id = $1 AND status = 'checked_in'
                RETURNING *
            `;
            const reservationResult = await client.query(reservationQuery, [reservationId, additionalCharges]);
            if (reservationResult.rows.length === 0) {
                await client.query('ROLLBACK');
                return null;
            }
            const reservation = reservationResult.rows[0];
            await client.query(`
                UPDATE rooms SET status = 'cleaning', updated_at = NOW() WHERE id = $1`, [reservation.room_id]);
            await client.query('COMMIT');
            return await this.getReservationById(reservationId);
        }
        catch (error) {
            await client.query('ROLLBACK');
            throw error;
        }
        finally {
            client.release();
        }
    }
    static async cancelReservation(reservationId) {
        const query = `
          UPDATE reservations 
          SET status = 'cancelled', updated_at = NOW()
          WHERE id = $1 AND status = 'pending'
          RETURNING *
        `;
        const result = await connection_1.default.query(query, [reservationId]);
        return result.rows[0] ? await this.getReservationById(reservationId) : null;
    }
    static async getUpcomingCheckOuts() {
        const query = `
            SELECT r.*, g.name as guest_name, g.email as guest_email, g.phone as guest_phone,
            room.number as room_number, room.type as room_type
        FROM reservations r
        JOIN guests g ON r.guest_id = g.id
        JOIN rooms room ON r.room_id = room.id
        WHERE r.status = 'checked_in'
        AND r.check_out_date = CURRENT_DATE
        AND r.actual_check_out IS NULL
        ORDER BY r.check_out_date ASC
        `;
        const result = await connection_1.default.query(query);
        return result.rows;
    }
    static async getTodayCheckIns() {
        const query = `
            SELECT r.*, g.name as guest_name, g.email as guest_email, g.phone as guest_phone,
                room.number as room_number, room.type as room_type
            FROM reservations r
            JOIN guests g ON r.guest_id = g.id
            JOIN rooms room ON r.room_id = room.id
            WHERE r.status = 'confirmed'
            AND r.check_in_date = CURRENT_DATE
            AND r.actual_check_in IS NULL
            ORDER BY r.check_in_date ASC
        `;
        const result = await connection_1.default.query(query);
        return result.rows;
    }
}
exports.ReservationService = ReservationService;
//# sourceMappingURL=reservationService.js.map