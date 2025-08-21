"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const connection_1 = __importDefault(require("./connection"));
const _001_create_admin_1 = require("./seeds/001_create_admin");
const _002_create_minibar_items_1 = require("./seeds/002_create_minibar_items");
const runMigrations = async () => {
    try {
        console.log('🔄 Executando migrações...');
        const migrations = [
            '001_create_tables.sql',
            '002_create_file_uploads_table.sql'
        ];
        for (const migrationFile of migrations) {
            console.log(`📄 Executando migração: ${migrationFile}`);
            let migrationPath = path_1.default.join(__dirname, 'migrations', migrationFile);
            if (!fs_1.default.existsSync(migrationPath)) {
                const srcPath = path_1.default.join(__dirname, '..', '..', 'src', 'database', 'migrations', migrationFile);
                if (fs_1.default.existsSync(srcPath)) {
                    migrationPath = srcPath;
                }
            }
            if (fs_1.default.existsSync(migrationPath)) {
                const sql = fs_1.default.readFileSync(migrationPath, 'utf8');
                await connection_1.default.query(sql);
                console.log(`✅ Migração ${migrationFile} executada com sucesso!`);
            }
            else {
                console.log(`⚠️ Arquivo de migração ${migrationFile} não encontrado, pulando...`);
            }
        }
        console.log('✅ Todas as migrações executadas com sucesso!');
        console.log('🌱 Executando seeds...');
        try {
            await (0, _001_create_admin_1.createAdminUser)();
            await (0, _002_create_minibar_items_1.createMinibarItems)();
            console.log('✅ Seeds executados com sucesso!');
        }
        catch (seedError) {
            console.error('⚠️ Erro ao executar seeds:', seedError);
        }
        process.exit(0);
    }
    catch (error) {
        console.error('❌ Erro ao executar migrações:', error);
        process.exit(1);
    }
};
runMigrations();
//# sourceMappingURL=migrate.js.map