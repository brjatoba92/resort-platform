"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GuestService = void 0;
const connection_1 = __importDefault(require("@/database/connection"));
class GuestService {
    static async findOrCreateGuest(guestData) {
        let guest = await this.findGuestByEmail(guestData.email);
        if (guest) {
            const updateData = {
                name: guestData.name,
                document: guestData.document,
            };
            if (guestData.phone !== undefined)
                updateData.phone = guestData.phone;
            if (guestData.nationality !== undefined)
                updateData.nationality = guestData.nationality;
            if (guestData.language_preference !== undefined)
                updateData.language_preference = guestData.language_preference;
            const updatedGuest = await this.updateGuest(guest.id, updateData);
            return updatedGuest;
        }
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
        const result = await connection_1.default.query(query, values);
        return result.rows[0];
    }
    static async findGuestByEmail(email) {
        const query = `
            SELECT * FROM guests WHERE email = $1
        `;
        const result = await connection_1.default.query(query, [email.toLowerCase()]);
        return result.rows[0] || null;
    }
    static async findGuestById(id) {
        const query = `
            SELECT * FROM guests WHERE id = $1
        `;
        const result = await connection_1.default.query(query, [id]);
        return result.rows[0] || null;
    }
    static async updateGuest(id, guestData) {
        const updateFields = [];
        const updateValues = [];
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
        const result = await connection_1.default.query(query, updateValues);
        return result.rows[0] || null;
    }
    static async getAllGuests(filters) {
        const page = filters.page || 1;
        const limit = filters.limit || 10;
        const offset = (page - 1) * limit;
        let query = `
            SELECT * FROM guests WHERE 1=1
        `;
        let countQuery = `
            SELECT COUNT(*) FROM guests WHERE 1=1
        `;
        const queryParams = [];
        const countParams = [];
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
            connection_1.default.query(query, queryParams),
            connection_1.default.query(countQuery, countParams),
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
exports.GuestService = GuestService;
//# sourceMappingURL=guestService.js.map