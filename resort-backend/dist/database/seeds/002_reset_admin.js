"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const connection_1 = __importDefault(require("../connection"));
const authService_1 = require("../../services/authService");
const resetAdmin = async () => {
    try {
        console.log("Resetando usuário administrador...");
        await connection_1.default.query("DELETE FROM users WHERE role = 'admin'");
        console.log("Admin anterior deletado.");
        const adminData = {
            email: "admin@resort.com",
            password: "Admin@123$",
            role: "admin",
            name: "Administrador",
            phone: "(12) 95496-3870",
        };
        await authService_1.AuthService.createUser(adminData);
        console.log('✅ Usuário administrador recriado com sucesso!');
        console.log('📧 Email: admin@resort.com');
        console.log('🔒 Senha: Admin@123$');
    }
    catch (error) {
        console.error('❌ Erro ao resetar admin:', error);
    }
    finally {
        process.exit(0);
    }
};
resetAdmin();
//# sourceMappingURL=002_reset_admin.js.map