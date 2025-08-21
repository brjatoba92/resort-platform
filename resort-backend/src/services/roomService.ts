import pool from "@/database/connection";
import { Room } from "@/types";

export class RoomService {
    // Listar todos os quartos com filtros
    static async getAllRooms(filters: {
        status?: string;
        type?: string;
        floor?: number;
        page?: number;
        limit?: number;
    }): Promise<{ rooms: Room[], total: number, pagination: any }> {
        const page = filters.page || 1;
        const limit = filters.limit || 10;
        const offset = (page - 1) * limit;

        let query = `
            SELECT id, number, type, capacity, price_per_night, amenities, status, description, images, floor, created_at, updated_at
            FROM rooms
            WHERE 1=1
        `;

        let constQuery = `SELECT COUNT(*) as total FROM rooms WHERE 1=1`;
        const queryParams: any[] = [];
        const countParams: any[] = [];
        let paramIndex = 1;

        // Filtros dinâmicos
        if (filters.status) {
            query += ` AND status = $${paramIndex}`;
            constQuery += ` AND status = $${paramIndex}`;
            queryParams.push(filters.status);
            countParams.push(filters.status);
            paramIndex++;
        }

        if (filters.status) {
            query += ` AND status = $${paramIndex}`;
            constQuery += ` AND status = $${paramIndex}`;
            queryParams.push(filters.status);
            countParams.push(filters.status);
            paramIndex++;
        }

        if (filters.floor) {
            query += ` AND floor = $${paramIndex}`;
            constQuery += ` AND floor = $${paramIndex}`;
            queryParams.push(filters.floor);
            countParams.push(filters.floor);
            paramIndex++;
        }

        query += ` ORDER BY number LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
        queryParams.push(limit, offset);
        
        const [roomsResult, countResult] = await Promise.all([
            pool.query(query, queryParams),
            pool.query(constQuery, countParams)
        ]);

        const total = parseInt(countResult.rows[0].total);
        const totalPages = Math.ceil(total / limit);

        return {
            rooms: roomsResult.rows,
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

    // Buscar quarto por ID
    static async getRoomById(id: string): Promise<Room | null> {
        const query = `
            SELECT id, number, type, capacity, price_per_night, amenities, status, floor, description, images, created_at, updated_at
            FROM rooms
            WHERE id = $1
        `;
        const result = await pool.query(query, [id]);
        return result.rows[0] || null;
    }

    // Criar novo quarto
    static async createRoom(roomData: {
        number: number;
        type: string;
        capacity: number;
        price_per_night: number;
        amenities: string[];
        floor?: number;
        description?: string;
        images?: string[];
    }): Promise<Room> {
        const query = `
            INSERT INTO rooms (number, type, capacity, price_per_night, amenities, floor, description, images)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
            RETURNING id, number, type, capacity, price_per_night, amenities, status, floor, description, images, created_at, updated_at
        `;
        const values = [
            roomData.number,
            roomData.type,
            roomData.capacity,
            roomData.price_per_night,
            roomData.amenities || [],
            roomData.floor,
            roomData.description,
            roomData.images || [],
        ];

        const result = await pool.query(query, values);
        return result.rows[0];
    }

    // Atualizar quarto
    static async updateRoom(id: string, roomData: {
        number?: number;
        type?: string;
        capacity?: number;
        price_per_night?: number;
        amenities?: string[];
        status?: string;
        floor?: number;
        description?: string;
        images?: string[];
    }): Promise<Room | null> {
        const existingRoom = await this.getRoomById(id);
        if (!existingRoom) return null;

        const updateFields: string[] = [];
        const updateValues: any[] = [];
        let paramIndex = 1;

        Object.entries(roomData).forEach(([key, value]) => {
            if (value !== undefined) {
                updateFields.push(`${key} = $${paramIndex}`);
                updateValues.push(value);
                paramIndex++;
            }
        });
        
        if (updateFields.length === 0) return existingRoom;
        updateFields.push(`updated_at = NOW()`);
        updateValues.push(id);

        const query = `
            UPDATE rooms
            SET ${updateFields.join(", ")}
            WHERE id = $${paramIndex}
            RETURNING id, number, type, capacity, price_per_night, amenities, status, floor, description, images, created_at, updated_at
        `;
        const result = await pool.query(query, updateValues);
        return result.rows[0];
    }

    // Deletar quarto (soft delete)
    static async deleteRoom(id: string): Promise<boolean> {
        const query = `
            UPDATE rooms
            SET status = 'maintenance', updated_at = NOW()
            WHERE id = $1 AND NOT IN (
                SELECT DISTINCT room_id
                FROM reservations
                WHERE status IN ('confirmed', 'checked_in')
            )
        `;
        const result = await pool.query(query, [id]);
        return (result.rowCount || 0) > 0;
    }

    // Verificar disponibilidade
    static async checkAvailability(roomId: number, checkIn: Date, checkOut: Date): Promise<boolean> {
        const query = `
            SELECT COUNT(*) as conflicts
            FROM reservations
            WHERE room_id = $1 
            AND (
                (check_in_date <= $2 AND check_in_date > $2) OR
                (check_out_date < $3 AND check_out_date >= $3) OR
                (check_in_date >= $2 AND check_out_date <= $3)
            )
        `;
        const result = await pool.query(query, [roomId, checkIn, checkOut]);
        return parseInt(result.rows[0].conflicts) === 0;
    }

    // Buscar quartos disponiveis
    static async getAvailableRooms(checkIn: Date, checkOut: Date):  Promise<Room[]> {
        const query = `
            SELECT r.id, r.number, r.type, r.capacity, r.price_per_night, r.amenities, r.status, r.floor, r.description, r.images
            FROM rooms r
            WHERE r.status = 'available'
                AND r.id NOT IN (
                    SELECT DISTINCT res.room_id
                    FROM reservations res
                    WHERE res.status IN ('confirmed', 'checked_in')
                    AND (
                        (check_in_date <= $1 AND check_out_date > $1) OR
                        (check_out_date < $2 AND check_out_date >= $2) OR
                        (check_in_date >= $1 AND check_out_date <= $2)
                    )
                )
            ORDER BY r.number ASC
        `;
        const result = await pool.query(query, [checkIn, checkOut]);
        return result.rows;
    }
    
}