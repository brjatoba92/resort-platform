"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MinibarService = void 0;
const connection_1 = __importDefault(require("@/database/connection"));
class MinibarService {
    static async getAllItems() {
        const query = `
            SELECT id, name, price, category, is_active, created_at
            FROM minibar_items
            ORDER BY category, name
        `;
        const result = await connection_1.default.query(query);
        return result.rows;
    }
    static async getItemById(id) {
        const query = `
            SELECT id, name, price, category, is_active, created_at
            FROM minibar_items
            WHERE id = $1
        `;
        const result = await connection_1.default.query(query, [id]);
        return result.rows[0] || null;
    }
    static async createItem(itemData) {
        const query = `
            INSERT INTO minibar_items (name, price, category)
            VALUES ($1, $2, $3)
            RETURNING id, name, price, category, is_active, created_at
        `;
        const result = await connection_1.default.query(query, [
            itemData.name,
            itemData.price,
            itemData.category
        ]);
        return result.rows[0];
    }
    static async updateItem(id, itemData) {
        const fields = [];
        const values = [];
        let paramCount = 1;
        if (itemData.name !== undefined) {
            fields.push(`name = $${paramCount}`);
            values.push(itemData.name);
            paramCount++;
        }
        if (itemData.price !== undefined) {
            fields.push(`price = $${paramCount}`);
            values.push(itemData.price);
            paramCount++;
        }
        if (itemData.category !== undefined) {
            fields.push(`category = $${paramCount}`);
            values.push(itemData.category);
            paramCount++;
        }
        if (itemData.is_active !== undefined) {
            fields.push(`is_active = $${paramCount}`);
            values.push(itemData.is_active);
            paramCount++;
        }
        if (fields.length === 0) {
            return this.getItemById(id);
        }
        values.push(id);
        const query = `
            UPDATE minibar_items
            SET ${fields.join(', ')}
            WHERE id = $${paramCount}
            RETURNING id, name, price, category, is_active, created_at
        `;
        const result = await connection_1.default.query(query, values);
        return result.rows[0] || null;
    }
    static async deleteItem(id) {
        const query = `
            UPDATE minibar_items
            SET is_active = false
            WHERE id = $1
        `;
        const result = await connection_1.default.query(query, [id]);
        return (result.rowCount || 0) > 0;
    }
    static async getItemsByCategory(category) {
        const query = `
            SELECT id, name, price, category, is_active, created_at
            FROM minibar_items
            WHERE category = $1 AND is_active = true
            ORDER BY name
        `;
        const result = await connection_1.default.query(query, [category]);
        return result.rows;
    }
    static async recordConsumption(consumptionData) {
        const itemQuery = `
            SELECT price FROM minibar_items WHERE id = $1 AND is_active = true
        `;
        const itemResult = await connection_1.default.query(itemQuery, [consumptionData.minibar_item_id]);
        if (itemResult.rows.length === 0) {
            throw new Error('Item do minibar não encontrado ou inativo');
        }
        const unitPrice = itemResult.rows[0].price;
        const totalPrice = unitPrice * consumptionData.quantity;
        const query = `
            INSERT INTO minibar_consumption 
            (reservation_id, minibar_item_id, quantity, unit_price, total_price, recorded_by)
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING id, reservation_id, minibar_item_id, quantity, unit_price, total_price, consumed_at, recorded_by
        `;
        const result = await connection_1.default.query(query, [
            consumptionData.reservation_id,
            consumptionData.minibar_item_id,
            consumptionData.quantity,
            unitPrice,
            totalPrice,
            consumptionData.recorded_by
        ]);
        return result.rows[0];
    }
    static async getConsumptionByReservation(reservationId) {
        const query = `
            SELECT 
                mc.id,
                mc.reservation_id,
                mc.minibar_item_id,
                mc.quantity,
                mc.unit_price,
                mc.total_price,
                mc.consumed_at,
                mc.recorded_by,
                mi.name as item_name,
                mi.category as item_category,
                u.name as recorded_by_name
            FROM minibar_consumption mc
            LEFT JOIN minibar_items mi ON mc.minibar_item_id = mi.id
            LEFT JOIN users u ON mc.recorded_by = u.id
            WHERE mc.reservation_id = $1
            ORDER BY mc.consumed_at DESC
        `;
        const result = await connection_1.default.query(query, [reservationId]);
        return result.rows;
    }
    static async getConsumptionByPeriod(startDate, endDate) {
        const query = `
            SELECT 
                mc.id,
                mc.reservation_id,
                mc.minibar_item_id,
                mc.quantity,
                mc.unit_price,
                mc.total_price,
                mc.consumed_at,
                mc.recorded_by,
                mi.name as item_name,
                mi.category as item_category,
                u.name as recorded_by_name,
                g.name as guest_name,
                r.number as room_number
            FROM minibar_consumption mc
            LEFT JOIN minibar_items mi ON mc.minibar_item_id = mi.id
            LEFT JOIN users u ON mc.recorded_by = u.id
            LEFT JOIN reservations res ON mc.reservation_id = res.id
            LEFT JOIN guests g ON res.guest_id = g.id
            LEFT JOIN rooms r ON res.room_id = r.id
            WHERE mc.consumed_at BETWEEN $1 AND $2
            ORDER BY mc.consumed_at DESC
        `;
        const result = await connection_1.default.query(query, [startDate, endDate]);
        return result.rows;
    }
    static async getTotalConsumptionByReservation(reservationId) {
        const query = `
            SELECT COALESCE(SUM(total_price), 0) as total
            FROM minibar_consumption
            WHERE reservation_id = $1
        `;
        const result = await connection_1.default.query(query, [reservationId]);
        return parseFloat(result.rows[0].total);
    }
    static async getConsumptionStats(startDate, endDate) {
        let dateFilter = '';
        let params = [];
        if (startDate && endDate) {
            dateFilter = 'WHERE consumed_at BETWEEN $1 AND $2';
            params = [startDate, endDate];
        }
        const query = `
            SELECT 
                mi.category,
                mi.name as item_name,
                COUNT(mc.id) as consumption_count,
                SUM(mc.quantity) as total_quantity,
                SUM(mc.total_price) as total_revenue
            FROM minibar_items mi
            LEFT JOIN minibar_consumption mc ON mi.id = mc.minibar_item_id
            ${dateFilter}
            GROUP BY mi.id, mi.category, mi.name
            ORDER BY total_revenue DESC
        `;
        const result = await connection_1.default.query(query, params);
        return result.rows;
    }
    static async getConsumptionByItem(itemId, startDate, endDate) {
        let dateFilter = '';
        let params = [itemId];
        if (startDate && endDate) {
            dateFilter = 'AND consumed_at BETWEEN $2 AND $3';
            params = [itemId, startDate, endDate];
        }
        const query = `
            SELECT 
                mc.id,
                mc.reservation_id,
                mc.minibar_item_id,
                mc.quantity,
                mc.unit_price,
                mc.total_price,
                mc.consumed_at,
                mc.recorded_by,
                mi.name as item_name,
                mi.category as item_category,
                u.name as recorded_by_name,
                g.name as guest_name,
                r.number as room_number
            FROM minibar_consumption mc
            LEFT JOIN minibar_items mi ON mc.minibar_item_id = mi.id
            LEFT JOIN users u ON mc.recorded_by = u.id
            LEFT JOIN reservations res ON mc.reservation_id = res.id
            LEFT JOIN guests g ON res.guest_id = g.id
            LEFT JOIN rooms r ON res.room_id = r.id
            WHERE mc.minibar_item_id = $1 ${dateFilter}
            ORDER BY mc.consumed_at DESC
        `;
        const result = await connection_1.default.query(query, params);
        return result.rows;
    }
    static async validateReservation(reservationId) {
        const query = `
            SELECT id FROM reservations 
            WHERE id = $1 AND status IN ('confirmed', 'checked_in')
        `;
        const result = await connection_1.default.query(query, [reservationId]);
        return result.rows.length > 0;
    }
    static async getCategories() {
        const query = `
            SELECT DISTINCT category
            FROM minibar_items
            WHERE is_active = true
            ORDER BY category
        `;
        const result = await connection_1.default.query(query);
        return result.rows.map(row => row.category);
    }
}
exports.MinibarService = MinibarService;
//# sourceMappingURL=minibarService.js.map