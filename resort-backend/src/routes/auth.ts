import { Router } from "express";
import { AuthController } from "../controllers/authController";
import { authenticate, authorize } from "../middleware/auth";
import rateLimit from "express-rate-limit";

const router = Router();

// Rate limiting mais restritivo para autenticação
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 20, // maximo de 20 refresh por IP
    message: {
        success: false,
        message: "Muitas tentativas de login. Por favor, tente novamente mais tarde.",
    },
});

// Rotas publicas
router.post("/login", authLimiter, AuthController.login);
router.post("/refresh", authLimiter, AuthController.refresh);
// Rotas protegidas - requer autenticacao
router.get("/profile", authenticate, AuthController.getProfile);
router.get("/logout", authenticate, AuthController.logout);
// Rotas restritas - apenas admins
router.post("/users", authenticate, authorize(["admin"]), AuthController.createUser);
router.get("/users", authenticate, authorize(["admin"]), AuthController.listUsers);

export default router;