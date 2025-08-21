"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorize = exports.authenticate = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const responses_1 = require("../utils/responses");
const authenticate = (req, res, next) => {
    const authHeader = req.headers.authorization;
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
        return responses_1.ResponseHandler.error(res, 'Token de acesso requerido', 401);
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
        return;
    }
    catch (error) {
        return responses_1.ResponseHandler.error(res, 'Token inválido', 401);
    }
};
exports.authenticate = authenticate;
const authorize = (roles) => {
    return (req, res, next) => {
        if (!req.user) {
            return responses_1.ResponseHandler.error(res, 'Usuario não autenticado', 401);
        }
        if (!roles.includes(req.user.role)) {
            return responses_1.ResponseHandler.error(res, 'Acesso negado', 403);
        }
        next();
        return;
    };
};
exports.authorize = authorize;
//# sourceMappingURL=auth.js.map