import pool from "@/database/connection";
import { MinibarItem, MinibarConsumption, MinibarItemCreate, MinibarItemUpdate, MinibarConsumptionCreate } from "@/types";

export class MinibarService {
    // ========================================
    // GESTÃO DE ITENS DO MINIBAR
    // ========================================

    // Listar todos os itens do minibar
    static async getAllItems(): Promise<MinibarItem[]> {
        const query = `
            SELECT id, name, price, category, is_active, created_at
            FROM minibar_items
            ORDER BY category, name
        `;
        
        const result = await pool.query(query);
        return result.rows;
    }

    // Obter item por ID
    static async getItemById(id: number): Promise<MinibarItem | null> {
        const query = `
            SELECT id, name, price, category, is_active, created_at
            FROM minibar_items
            WHERE id = $1
        `;
        
        const result = await pool.query(query, [id]);
        return result.rows[0] || null;
    }

    // Criar novo item
    static async createItem(itemData: MinibarItemCreate): Promise<MinibarItem> {
        const query = `
            INSERT INTO minibar_items (name, price, category)
            VALUES ($1, $2, $3)
            RETURNING id, name, price, category, is_active, created_at
        `;
        
        const result = await pool.query(query, [
            itemData.name,
            itemData.price,
            itemData.category
        ]);
        
        return result.rows[0];
    }

    // Atualizar item
    static async updateItem(id: number, itemData: MinibarItemUpdate): Promise<MinibarItem | null> {
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
        
        const result = await pool.query(query, values);
        return result.rows[0] || null;
    }

    // Deletar item (soft delete - desativar)
    static async deleteItem(id: number): Promise<boolean> {
        const query = `
            UPDATE minibar_items
            SET is_active = false
            WHERE id = $1
        `;
        
        const result = await pool.query(query, [id]);
        return (result.rowCount || 0) > 0;
    }

    // Obter itens por categoria
    static async getItemsByCategory(category: string): Promise<MinibarItem[]> {
        const query = `
            SELECT id, name, price, category, is_active, created_at
            FROM minibar_items
            WHERE category = $1 AND is_active = true
            ORDER BY name
        `;
        
        const result = await pool.query(query, [category]);
        return result.rows;
    }

    // ========================================
    // GESTÃO DE CONSUMO DO MINIBAR
    // ========================================

    // Registrar consumo
    static async recordConsumption(consumptionData: MinibarConsumptionCreate): Promise<MinibarConsumption> {
        // Primeiro, obter o preço do item
        const itemQuery = `
            SELECT price FROM minibar_items WHERE id = $1 AND is_active = true
        `;
        const itemResult = await pool.query(itemQuery, [consumptionData.minibar_item_id]);
        
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
        
        const result = await pool.query(query, [
            consumptionData.reservation_id,
            consumptionData.minibar_item_id,
            consumptionData.quantity,
            unitPrice,
            totalPrice,
            consumptionData.recorded_by
        ]);
        
        return result.rows[0];
    }

    // Obter consumo por reserva
    static async getConsumptionByReservation(reservationId: number): Promise<MinibarConsumption[]> {
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
        
        const result = await pool.query(query, [reservationId]);
        return result.rows;
    }

    // Obter consumo por período
    static async getConsumptionByPeriod(startDate: Date, endDate: Date): Promise<MinibarConsumption[]> {
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
        
        const result = await pool.query(query, [startDate, endDate]);
        return result.rows;
    }

    // Obter total de consumo por reserva
    static async getTotalConsumptionByReservation(reservationId: number): Promise<number> {
        const query = `
            SELECT COALESCE(SUM(total_price), 0) as total
            FROM minibar_consumption
            WHERE reservation_id = $1
        `;
        
        const result = await pool.query(query, [reservationId]);
        return parseFloat(result.rows[0].total);
    }

    // Obter estatísticas de consumo
    static async getConsumptionStats(startDate?: Date, endDate?: Date): Promise<any> {
        let dateFilter = '';
        let params: any[] = [];
        
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
        
        const result = await pool.query(query, params);
        return result.rows;
    }

    // Obter consumo por item
    static async getConsumptionByItem(itemId: number, startDate?: Date, endDate?: Date): Promise<MinibarConsumption[]> {
        let dateFilter = '';
        let params: any[] = [itemId];
        
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
        
        const result = await pool.query(query, params);
        return result.rows;
    }

    // Verificar se reserva existe e está ativa
    static async validateReservation(reservationId: number): Promise<boolean> {
        const query = `
            SELECT id FROM reservations 
            WHERE id = $1 AND status IN ('confirmed', 'checked_in')
        `;
        
        const result = await pool.query(query, [reservationId]);
        return result.rows.length > 0;
    }

    // Obter categorias disponíveis
    static async getCategories(): Promise<string[]> {
        const query = `
            SELECT DISTINCT category
            FROM minibar_items
            WHERE is_active = true
            ORDER BY category
        `;
        
        const result = await pool.query(query);
        return result.rows.map(row => row.category);
    }
}
