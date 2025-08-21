import { Request, Response } from "express";
import { AuthService } from "../services/authService";
import { ResponseHandler } from "../utils/responses";
import { loginSchema, createUserSchema, refreshTokenSchema } from "../utils/validators";
import { JWTPayload } from "../types";
import { AuthRequest } from "../middleware/auth"
import pool from "../database/connection";

export class AuthController {
    // Login de usuario
    static async login(req: Request, res: Response) {
        try {
            // validar dados de entrada
            const { error } = loginSchema.validate(req.body);
            if (error) {
                return ResponseHandler.error(res, error.details?.[0]?.message || 'Erro de validação', 400);
            }

            // se a validacao nao retorna um erro, continuar
            const { email, password } = req.body;

            // buscar usuario
            const user = await AuthService.findUserByEmail(email.toLowerCase());
            if (!user) {
                return ResponseHandler.error(res, "Credenciais inválidas", 401);
            }

            // comparar senha
            const isPasswordValid = await AuthService.comparePassword(password, user.password_hash);
            if (!isPasswordValid) {
                return ResponseHandler.error(res, "Credenciais inválidas", 401);
            }

            // gerar tokens
            const tokenPayload: JWTPayload = {
                userId: user.id,
                email: user.email,
                role: user.role,
            };

            const { accessToken, refreshToken } = AuthService.generateTokens(tokenPayload);

            // Atualizar ultimo login
            await AuthService.updateLastLogin(user.id);

            // remover senha da resposta
            const { password_hash, ...userResponse } = user;

            return ResponseHandler.success(res, {
                user: userResponse,
                tokens: {
                    accessToken,
                    refreshToken,
                },
            }, "Login realizado com sucesso", 200);

        } catch (error) {
            console.error("Erro ao realizar login:", error);
            return ResponseHandler.error(res, "Erro ao realizar login", 500);
        }
    }
    // Refresh token
    static async refresh(req: Request, res: Response) {
        try {
            // validar dados de entrada
            const { error } = refreshTokenSchema.validate(req.body);
            if (error) {
                return ResponseHandler.error(res, error.details?.[0]?.message || 'Erro de validação', 400);
            }

            const { refreshToken } = req.body;

            // Verificar refresh token
            let decoded: JWTPayload;
            try {
                decoded = AuthService.verifyRefreshToken(refreshToken);
            } catch (tokenError) {
                return ResponseHandler.error(res, "Refresh Token inválido", 401);
            }

            // Verificar se usuário ainda existe e está ativo
            const user = await AuthService.findUserById(decoded.userId);
            if (!user) {
                return ResponseHandler.error(res, "Usuário não encontrado", 401);
            }

            // Gerar novos tokens
            const tokenPayload: JWTPayload = {
                userId: user.id,
                email: user.email,
                role: user.role,
            };

            const newTokens = AuthService.generateTokens(tokenPayload);

            return ResponseHandler.success(res, {
                tokens: {
                    accessToken: newTokens.accessToken,
                    refreshToken: newTokens.refreshToken,
                },
            }, "Token atualizado com sucesso", 200);
        } catch (error) {
            console.error("Erro no refresh:", error);
            return ResponseHandler.error(res, "Erro ao atualizar token", 500);
        }
    }
    // Criar novo usuario (apenas admins)
    static async createUser(req: Request, res: Response) {
        try {
            // validar dados de entrada
            const { error } = createUserSchema.validate(req.body);
            if (error) {
                return ResponseHandler.error(res, error.details?.[0]?.message || 'Erro de validação', 400);
            }

            const { email, password, name, role, phone } = req.body;

            // verificar se email já existe
            const existingUser = await AuthService.findUserByEmail(email.toLowerCase());
            if (existingUser) {
                return ResponseHandler.error(res, "Email já em uso", 400);
            }

            // criar usuario
            const newUser = await AuthService.createUser({
                email: email.toLowerCase(),
                password,
                name,
                role,
                phone
            });

            // Remover campos sensiveis da resposta
            const { password_hash, ...userResponse } = newUser as any;

            return ResponseHandler.success(res, userResponse, "Usuário criado com sucesso", 201);
        } catch (error) {
            console.error("Erro ao criar usuário:", error);
            return ResponseHandler.error(res, "Erro interno do servidor", 500);
        }
    }

    // Obter perfil do usuario logado
    static async getProfile(req: AuthRequest, res: Response) {
        try {
            if (!req.user) {
                return ResponseHandler.error(res, "Usuário não autenticado", 401);
            }

            const user = await AuthService.findUserById(req.user.userId);
            if (!user) {
                return ResponseHandler.error(res, "Usuário não encontrado", 404);
            }

            // Remover senha da resposta
            const { password_hash, ...userProfile } = user;

            return ResponseHandler.success(res, userProfile, "Perfil obtido com sucesso");
        } catch (error) {
            console.error("Erro ao obter perfil:", error);
            return ResponseHandler.error(res, "Erro interno do servidor", 500);
        }
    }
    // Logout (invalidar token - opcional)
  static async logout(req: AuthRequest, res: Response) {
    try {
      // Em uma implementação mais robusta, você adicionaria o token a uma blacklist
      // Por enquanto, apenas retornamos sucesso
      return ResponseHandler.success(res, null, 'Logout realizado com sucesso');
    } catch (error) {
      console.error('Erro no logout:', error);
      return ResponseHandler.error(res, 'Erro interno do servidor', 500);
    }
  }

  // Listar usuarios (apenas admins)
  static async listUsers(req: AuthRequest, res: Response) {
    try {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
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
            pool.query(query, [limit, offset]),
            pool.query(countQuery)
        ]);

        const users = usersResult.rows;
        const total = parseInt(countResult.rows[0].total);
        const totalPages = Math.ceil(total / limit);

        return ResponseHandler.success(res, {
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
    } catch (error) {
        console.error("Erro ao listar usuários:", error);
        return ResponseHandler.error(res, "Erro interno do servidor", 500);
    }
  }
}