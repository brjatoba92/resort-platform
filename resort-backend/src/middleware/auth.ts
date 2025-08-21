import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { JWTPayload } from "../types";
import { ResponseHandler } from "../utils/responses";

export interface AuthRequest extends Request {
    user?: JWTPayload;
}

export const authenticate = (req: AuthRequest, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    const token = req.headers.authorization?.split(" ")[1];
    
    if (!token) {
        return ResponseHandler.error(res, 'Token de acesso requerido', 401);
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JWTPayload;
        req.user = decoded;
        next();
        return;
    } catch (error) {
        return ResponseHandler.error(res, 'Token inválido', 401);
    }
};

export const authorize = (roles: string[]) => {
    return (req: AuthRequest, res: Response, next: NextFunction) => {
        if (!req.user) {
            return ResponseHandler.error(res, 'Usuario não autenticado', 401);
        }
        if (!roles.includes(req.user.role)) {
            return ResponseHandler.error(res, 'Acesso negado', 403);
        }
        next();
        return;
    }
}