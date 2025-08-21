"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const connection_1 = __importDefault(require("../database/connection"));
class AuthService {
    static async generateHash(password) {
        const saltRounds = 12;
        return await bcryptjs_1.default.hash(password, saltRounds);
    }
    static async comparePassword(password, hash) {
        return await bcryptjs_1.default.compare(password, hash);
    }
    static generateTokens(payload) {
        const accessToken = jsonwebtoken_1.default.sign(payload, process.env.JWT_SECRET, { expiresIn: '15m' });
        const refreshToken = jsonwebtoken_1.default.sign(payload, process.env.JWT_REFRESH_SECRET, { expiresIn: '7d' });
        return { accessToken, refreshToken };
    }
    static verifyRefreshToken(token) {
        return jsonwebtoken_1.default.verify(token, process.env.JWT_REFRESH_SECRET);
    }
    static async findUserByEmail(email) {
        const query = `
        SELECT id, email, password_hash, role, name, phone, is_active, created_at, updated_at
        FROM users
        WHERE email = $1 AND is_active = true
        `;
        const result = await connection_1.default.query(query, [email]);
        return result.rows[0] || null;
    }
    static async findUserById(id) {
        const query = `
        SELECT id, email, password_hash, role, name, phone, is_active, created_at, updated_at
        FROM users
        WHERE id = $1 AND is_active = true
        `;
        const result = await connection_1.default.query(query, [id]);
        return result.rows[0] || null;
    }
    static async createUser(userData) {
        const hashedPassword = await this.generateHash(userData.password);
        const query = `
        INSERT INTO users (email, password_hash, role, name, phone)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING id, email, role, name, phone, is_active, created_at, updated_at
        `;
        const values = [
            userData.email,
            hashedPassword,
            userData.role,
            userData.name,
            userData.phone
        ];
        const result = await connection_1.default.query(query, values);
        return result.rows[0];
    }
    static async updateLastLogin(userId) {
        const query = `
        UPDATE users
        SET updated_at = NOW()
        WHERE id = $1
        `;
        await connection_1.default.query(query, [userId]);
    }
}
exports.AuthService = AuthService;
//# sourceMappingURL=authService.js.map