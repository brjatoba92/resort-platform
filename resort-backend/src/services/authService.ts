import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import pool from "../database/connection";
import { User, JWTPayload } from "../types";

export class AuthService {
    //gerar hash da senha
    static async generateHash(password: string): Promise<string> {
        const saltRounds = 12;
        return await bcrypt.hash(password, saltRounds);
    }

    //verificar senha
    static async comparePassword(password: string, hash: string): Promise<boolean> {
        return await bcrypt.compare(password, hash);
    }

    //Gerar JWT tokens
    static generateTokens(payload: JWTPayload) {
        const accessToken = jwt.sign(
          payload,
          process.env.JWT_SECRET!,
          { expiresIn: '15m' }
        );

        const refreshToken = jwt.sign(
            payload,
            process.env.JWT_REFRESH_SECRET!,
            { expiresIn: '7d' }
        );

        return { accessToken, refreshToken };
    }

    // Verificar refresh token
    static verifyRefreshToken(token: string): JWTPayload {
        return jwt.verify(token, process.env.JWT_REFRESH_SECRET!) as JWTPayload;
    }

    // Buscar usuario por email
    static async findUserByEmail(email: string): Promise<User | null> {
        const query = `
        SELECT id, email, password_hash, role, name, phone, is_active, created_at, updated_at
        FROM users
        WHERE email = $1 AND is_active = true
        `;

        const result = await pool.query(query, [email]);
        return result.rows[0] || null;
    }

    // Buscar usuario por ID
    static async findUserById(id: number): Promise<User | null> {
        const query = `
        SELECT id, email, password_hash, role, name, phone, is_active, created_at, updated_at
        FROM users
        WHERE id = $1 AND is_active = true
        `;

        const result = await pool.query(query, [id]);
        return result.rows[0] || null;
    }
    // Criar novo usuario
    static async createUser(userData: {
        email: string;
        password: string;
        role: 'admin' | 'employee';
        name: string;
        phone?: string;
    }): Promise<User> {
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

        const result = await pool.query(query, values);
        return result.rows[0];
    }

    // Atualizar ultimo login
    static async updateLastLogin(userId: number): Promise<void> {
        const query = `
        UPDATE users
        SET updated_at = NOW()
        WHERE id = $1
        `;
        await pool.query(query, [userId]);
    }
}

