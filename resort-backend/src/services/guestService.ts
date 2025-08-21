import pool from "@/database/connection";
import { Guest } from "@/types";

export class GuestService {
    // Buscar ou criar hospede
    static async findOrCreateGuest(guestData: {
        name: string;
        email: string;
        phone?: string;
        document: string;
        nationality?: string;
        language_preference?: string;
    }): Promise<Guest> {
        // Primeiro tentar encontrar por email
        let guest = await this.findGuestByEmail(guestData.email);
        
        if (guest) {
            // Atualizar dados se necessário
            const updateData: any = {
                name: guestData.name,
                document: guestData.document,
            };
            
            if (guestData.phone !== undefined) updateData.phone = guestData.phone;
            if (guestData.nationality !== undefined) updateData.nationality = guestData.nationality;
            if (guestData.language_preference !== undefined) updateData.language_preference = guestData.language_preference;
            
            const updatedGuest = await this.updateGuest(guest.id, updateData);
            return updatedGuest!;
        }

        // Criar novo hospede
        const query = `
            INSERT INTO guests (name, email, phone, document, nationality, language_preference)
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING *
        `;

        const values = [
            guestData.name,
            guestData.email,
            guestData.phone,
            guestData.document,
            guestData.nationality,
            guestData.language_preference || 'pt-BR',
        ];
        const result = await pool.query(query, values);
        return result.rows[0];
    }

    // Buscar hospede por email
    static async findGuestByEmail(email: string): Promise<Guest | null> {
        const query = `
            SELECT * FROM guests WHERE email = $1
        `;
        const result = await pool.query(query, [email.toLowerCase()]);
        return result.rows[0] || null;
    }

    // Buscar hospede por ID
    static async findGuestById(id: number): Promise<Guest | null> {
        const query = `
            SELECT * FROM guests WHERE id = $1
        `;
        const result = await pool.query(query, [id]);
        return result.rows[0] || null;
    }

    // Atualizar hospede
    static async updateGuest(id: number, guestData: {
        name?: string;
        phone?: string;
        document?: string;
        nationality?: string;
        language_preference?: string;
    }): Promise<Guest | null> {
        const updateFields: string[] = [];
        const updateValues: any[] = [];
        let paramIndex = 1;

        Object.entries(guestData).forEach(([key, value]) => {
            if (value !== undefined) {
                updateFields.push(`${key} = $${paramIndex}`);
                updateValues.push(value);
                paramIndex++;
            }
        });

        if (updateFields.length === 0) {
            return await this.findGuestById(id);
        }

        updateFields.push(`updated_at = NOW()`);
        updateValues.push(id);

        const query = `
            UPDATE guests
            SET ${updateFields.join(', ')}
            WHERE id = $${paramIndex}
            RETURNING *
        `;

        const result = await pool.query(query, updateValues);
        return result.rows[0] || null;
    }

    // Listar hospede com paginação
    static async getAllGuests(filters: {
        search?: string;
        page?: number;
        limit?: number;
    }): Promise<{
        guests: Guest[];
        total: number;
        pagination: any;
    }> {
        const page = filters.page || 1;
        const limit = filters.limit || 10;
        const offset = (page - 1) * limit;

        let query = `
            SELECT * FROM guests WHERE 1=1
        `;
        let countQuery = `
            SELECT COUNT(*) FROM guests WHERE 1=1
        `;

        const queryParams: any[] = [];
        const countParams: any[] = [];
        let paramIndex = 1;

        if (filters.search) {
            const searchTerm = `%${filters.search}%`;
            query += ` AND (name ILIKE $${paramIndex} OR email ILIKE $${paramIndex} OR document ILIKE $${paramIndex})`;
            countQuery += ` AND (name ILIKE $${paramIndex} OR email ILIKE $${paramIndex} OR document ILIKE $${paramIndex})`;
            queryParams.push(searchTerm);
            countParams.push(searchTerm);
            paramIndex++;
        }

        query += ` ORDER BY created_at DESC LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
        queryParams.push(limit, offset);

        const [guestsResult, countResult] = await Promise.all([
            pool.query(query, queryParams),
            pool.query(countQuery, countParams),
        ]);

        const total = parseInt(countResult.rows[0].total);
        const totalPages = Math.ceil(total / limit);

        return {
            guests: guestsResult.rows,
            total,
            pagination: {
                page,
                limit,
                total,
                totalPages,
                hasNext: page < totalPages,
                hasPrev: page > 1
            }
        };
    }
}