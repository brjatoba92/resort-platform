import pool from "../connection";
import { AuthService } from "../../services/authService";

export const createAdminUser = async () => {
    try {
        console.log("Criando usuario administrador inicial...");

        // Verificar se já existe um admin
        const existingAdmin = await pool.query(
            "SELECT id FROM users WHERE role = 'admin' LIMIT 1"
        );

        if (existingAdmin.rows.length > 0) {
            console.log("Admin já existe. Não criando novamente.");
            return;
        }

        // Criar admin inicial
        const adminData = {
            email: "admin@resort.com",
            password: "Admin@123$",
            role: "admin" as const,
            name: "Administrador",
            phone: "(12) 95496-3870",
        };

        await AuthService.createUser(adminData);
        console.log('✅ Usuário administrador criado com sucesso!');
        console.log('📧 Email: admin@resort.com');
        console.log('🔒 Senha: Admin@123$');
    } catch (error) {
        console.error('❌ Erro ao criar admin:', error);
        throw error;
    }
};

// Executar se chamado diretamente
if (require.main === module) {
    createAdminUser()
        .then(() => {
            console.log('✅ Seed de admin concluído!');
            process.exit(0);
        })
        .catch((error) => {
            console.error('❌ Erro no seed de admin:', error);
            process.exit(1);
        });
}