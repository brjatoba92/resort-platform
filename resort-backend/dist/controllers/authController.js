"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const authService_1 = require("../services/authService");
const responses_1 = require("../utils/responses");
const validators_1 = require("../utils/validators");
const connection_1 = __importDefault(require("../database/connection"));
class AuthController {
    static async login(req, res) {
        try {
            const { error } = validators_1.loginSchema.validate(req.body);
            if (error) {
                return responses_1.ResponseHandler.error(res, error.details?.[0]?.message || 'Erro de validação', 400);
            }
            const { email, password } = req.body;
            const user = await authService_1.AuthService.findUserByEmail(email.toLowerCase());
            if (!user) {
                return responses_1.ResponseHandler.error(res, "Credenciais inválidas", 401);
            }
            const isPasswordValid = await authService_1.AuthService.comparePassword(password, user.password_hash);
            if (!isPasswordValid) {
                return responses_1.ResponseHandler.error(res, "Credenciais inválidas", 401);
            }
            const tokenPayload = {
                userId: user.id,
                email: user.email,
                role: user.role,
            };
            const { accessToken, refreshToken } = authService_1.AuthService.generateTokens(tokenPayload);
            await authService_1.AuthService.updateLastLogin(user.id);
            const { password_hash, ...userResponse } = user;
            return responses_1.ResponseHandler.success(res, {
                user: userResponse,
                tokens: {
                    accessToken,
                    refreshToken,
                },
            }, "Login realizado com sucesso", 200);
        }
        catch (error) {
            console.error("Erro ao realizar login:", error);
            return responses_1.ResponseHandler.error(res, "Erro ao realizar login", 500);
        }
    }
    static async refresh(req, res) {
        try {
            const { error } = validators_1.refreshTokenSchema.validate(req.body);
            if (error) {
                return responses_1.ResponseHandler.error(res, error.details?.[0]?.message || 'Erro de validação', 400);
            }
            const { refreshToken } = req.body;
            let decoded;
            try {
                decoded = authService_1.AuthService.verifyRefreshToken(refreshToken);
            }
            catch (tokenError) {
                return responses_1.ResponseHandler.error(res, "Refresh Token inválido", 401);
            }
            const user = await authService_1.AuthService.findUserById(decoded.userId);
            if (!user) {
                return responses_1.ResponseHandler.error(res, "Usuário não encontrado", 401);
            }
            const tokenPayload = {
                userId: user.id,
                email: user.email,
                role: user.role,
            };
            const newTokens = authService_1.AuthService.generateTokens(tokenPayload);
            return responses_1.ResponseHandler.success(res, {
                tokens: {
                    accessToken: newTokens.accessToken,
                    refreshToken: newTokens.refreshToken,
                },
            }, "Token atualizado com sucesso", 200);
        }
        catch (error) {
            console.error("Erro no refresh:", error);
            return responses_1.ResponseHandler.error(res, "Erro ao atualizar token", 500);
        }
    }
    static async createUser(req, res) {
        try {
            const { error } = validators_1.createUserSchema.validate(req.body);
            if (error) {
                return responses_1.ResponseHandler.error(res, error.details?.[0]?.message || 'Erro de validação', 400);
            }
            const { email, password, name, role, phone } = req.body;
            const existingUser = await authService_1.AuthService.findUserByEmail(email.toLowerCase());
            if (existingUser) {
                return responses_1.ResponseHandler.error(res, "Email já em uso", 400);
            }
            const newUser = await authService_1.AuthService.createUser({
                email: email.toLowerCase(),
                password,
                name,
                role,
                phone
            });
            const { password_hash, ...userResponse } = newUser;
            return responses_1.ResponseHandler.success(res, userResponse, "Usuário criado com sucesso", 201);
        }
        catch (error) {
            console.error("Erro ao criar usuário:", error);
            return responses_1.ResponseHandler.error(res, "Erro interno do servidor", 500);
        }
    }
    static async getProfile(req, res) {
        try {
            if (!req.user) {
                return responses_1.ResponseHandler.error(res, "Usuário não autenticado", 401);
            }
            const user = await authService_1.AuthService.findUserById(req.user.userId);
            if (!user) {
                return responses_1.ResponseHandler.error(res, "Usuário não encontrado", 404);
            }
            const { password_hash, ...userProfile } = user;
            return responses_1.ResponseHandler.success(res, userProfile, "Perfil obtido com sucesso");
        }
        catch (error) {
            console.error("Erro ao obter perfil:", error);
            return responses_1.ResponseHandler.error(res, "Erro interno do servidor", 500);
        }
    }
    static async logout(req, res) {
        try {
            return responses_1.ResponseHandler.success(res, null, 'Logout realizado com sucesso');
        }
        catch (error) {
            console.error('Erro no logout:', error);
            return responses_1.ResponseHandler.error(res, 'Erro interno do servidor', 500);
        }
    }
    static async listUsers(req, res) {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const offset = (page - 1) * limit;
            const query = `
            SELECT id, email, role, name, phone, is_active, created_at, updated_at
            FROM users
            WHERE is_active = true
            ORDER BY created_at DESC
            LIMIT $1 OFFSET $2
        `;
            const countQuery = `
            SELECT COUNT(*) as total
            FROM users
            WHERE is_active = true
        `;
            const [usersResult, countResult] = await Promise.all([
                connection_1.default.query(query, [limit, offset]),
                connection_1.default.query(countQuery)
            ]);
            const users = usersResult.rows;
            const total = parseInt(countResult.rows[0].total);
            const totalPages = Math.ceil(total / limit);
            return responses_1.ResponseHandler.success(res, {
                users,
                pagination: {
                    page,
                    limit,
                    total,
                    totalPages,
                    hasNext: page < totalPages,
                    hasPrev: page > 1,
                }
            }, "Usuários listados com sucesso", 200);
        }
        catch (error) {
            console.error("Erro ao listar usuários:", error);
            return responses_1.ResponseHandler.error(res, "Erro interno do servidor", 500);
        }
    }
}
exports.AuthController = AuthController;
//# sourceMappingURL=authController.js.map