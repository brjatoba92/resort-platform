import fs from 'fs';
import path from 'path';
import pool from './connection';
import { createAdminUser } from './seeds/001_create_admin';
import { createMinibarItems } from './seeds/002_create_minibar_items';

const runMigrations = async () => {
    try {
        console.log('🔄 Executando migrações...');

        // Array de migrações para executar
        const migrations = [
            '001_create_tables.sql',
            '002_create_file_uploads_table.sql'
        ];

        for (const migrationFile of migrations) {
            console.log(`📄 Executando migração: ${migrationFile}`);
            
            // Try to find the migration file in both dist and src directories
            let migrationPath = path.join(__dirname, 'migrations', migrationFile);
            
            // If the file doesn't exist in dist, try src directory
            if (!fs.existsSync(migrationPath)) {
                const srcPath = path.join(__dirname, '..', '..', 'src', 'database', 'migrations', migrationFile);
                if (fs.existsSync(srcPath)) {
                    migrationPath = srcPath;
                }
            }

            if (fs.existsSync(migrationPath)) {
                const sql = fs.readFileSync(migrationPath, 'utf8');
                await pool.query(sql);
                console.log(`✅ Migração ${migrationFile} executada com sucesso!`);
            } else {
                console.log(`⚠️ Arquivo de migração ${migrationFile} não encontrado, pulando...`);
            }
        }

        console.log('✅ Todas as migrações executadas com sucesso!');

        // Executar seeds
        console.log('🌱 Executando seeds...');
        
        try {
            await createAdminUser();
            await createMinibarItems();
            console.log('✅ Seeds executados com sucesso!');
        } catch (seedError) {
            console.error('⚠️ Erro ao executar seeds:', seedError);
        }

        process.exit(0);
    } catch (error) {
        console.error('❌ Erro ao executar migrações:', error);
        process.exit(1);
    }
}

runMigrations();