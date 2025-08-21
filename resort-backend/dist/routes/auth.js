"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authController_1 = require("../controllers/authController");
const auth_1 = require("../middleware/auth");
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const router = (0, express_1.Router)();
const authLimiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000,
    max: 20,
    message: {
        success: false,
        message: "Muitas tentativas de login. Por favor, tente novamente mais tarde.",
    },
});
router.post("/login", authLimiter, authController_1.AuthController.login);
router.post("/refresh", authLimiter, authController_1.AuthController.refresh);
router.get("/profile", auth_1.authenticate, authController_1.AuthController.getProfile);
router.get("/logout", auth_1.authenticate, authController_1.AuthController.logout);
router.post("/users", auth_1.authenticate, (0, auth_1.authorize)(["admin"]), authController_1.AuthController.createUser);
router.get("/users", auth_1.authenticate, (0, auth_1.authorize)(["admin"]), authController_1.AuthController.listUsers);
exports.default = router;
//# sourceMappingURL=auth.js.map