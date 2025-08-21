"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createAdminUser = void 0;
const connection_1 = __importDefault(require("../connection"));
const authService_1 = require("../../services/authService");
const createAdminUser = async () => {
    try {
        console.log("Criando usuario administrador inicial...");
        const existingAdmin = await connection_1.default.query("SELECT id FROM users WHERE role = 'admin' LIMIT 1");
        if (existingAdmin.rows.length > 0) {
            console.log("Admin já existe. Não criando novamente.");
            return;
        }
        const adminData = {
            email: "admin@resort.com",
            password: "Admin@123$",
            role: "admin",
            name: "Administrador",
            phone: "(12) 95496-3870",
        };
        await authService_1.AuthService.createUser(adminData);
        console.log('✅ Usuário administrador criado com sucesso!');
        console.log('📧 Email: admin@resort.com');
        console.log('🔒 Senha: Admin@123$');
    }
    catch (error) {
        console.error('❌ Erro ao criar admin:', error);
        throw error;
    }
};
exports.createAdminUser = createAdminUser;
if (require.main === module) {
    (0, exports.createAdminUser)()
        .then(() => {
        console.log('✅ Seed de admin concluído!');
        process.exit(0);
    })
        .catch((error) => {
        console.error('❌ Erro no seed de admin:', error);
        process.exit(1);
    });
}
//# sourceMappingURL=001_create_admin.js.map