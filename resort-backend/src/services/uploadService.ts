import pool from "@/database/connection";
import { FileUpload, FileUploadCreate, FileUploadUpdate, UploadConfig } from "@/types";
import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

export class UploadService {
    // ========================================
    // CONFIGURAÇÕES DE UPLOAD
    // ========================================

    private static readonly UPLOAD_CONFIGS: Record<string, UploadConfig> = {
        room_image: {
            maxFileSize: 5 * 1024 * 1024, // 5MB
            allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp'],
            allowedExtensions: ['.jpg', '.jpeg', '.png', '.webp'],
            uploadPath: 'uploads/rooms'
        },
        guest_document: {
            maxFileSize: 10 * 1024 * 1024, // 10MB
            allowedMimeTypes: ['application/pdf', 'image/jpeg', 'image/png'],
            allowedExtensions: ['.pdf', '.jpg', '.jpeg', '.png'],
            uploadPath: 'uploads/guests'
        },
        payment_receipt: {
            maxFileSize: 5 * 1024 * 1024, // 5MB
            allowedMimeTypes: ['application/pdf', 'image/jpeg', 'image/png'],
            allowedExtensions: ['.pdf', '.jpg', '.jpeg', '.png'],
            uploadPath: 'uploads/payments'
        },
        system_file: {
            maxFileSize: 20 * 1024 * 1024, // 20MB
            allowedMimeTypes: ['application/pdf', 'image/jpeg', 'image/png', 'text/plain'],
            allowedExtensions: ['.pdf', '.jpg', '.jpeg', '.png', '.txt'],
            uploadPath: 'uploads/system'
        }
    };

    // ========================================
    // GESTÃO DE ARQUIVOS
    // ========================================

    // Listar todos os arquivos
    static async getAllFiles(): Promise<FileUpload[]> {
        const query = `
            SELECT 
                f.id,
                f.original_name,
                f.filename,
                f.path,
                f.size,
                f.mime_type,
                f.category,
                f.entity_type,
                f.entity_id,
                f.uploaded_by,
                f.is_active,
                f.created_at,
                u.name as uploaded_by_name
            FROM file_uploads f
            LEFT JOIN users u ON f.uploaded_by = u.id
            ORDER BY f.created_at DESC
        `;
        
        const result = await pool.query(query);
        return result.rows;
    }

    // Obter arquivo por ID
    static async getFileById(id: number): Promise<FileUpload | null> {
        const query = `
            SELECT 
                f.id,
                f.original_name,
                f.filename,
                f.path,
                f.size,
                f.mime_type,
                f.category,
                f.entity_type,
                f.entity_id,
                f.uploaded_by,
                f.is_active,
                f.created_at,
                u.name as uploaded_by_name
            FROM file_uploads f
            LEFT JOIN users u ON f.uploaded_by = u.id
            WHERE f.id = $1
        `;
        
        const result = await pool.query(query, [id]);
        return result.rows[0] || null;
    }

    // Criar novo registro de arquivo
    static async createFileUpload(fileData: FileUploadCreate): Promise<FileUpload> {
        const query = `
            INSERT INTO file_uploads (original_name, filename, path, size, mime_type, category, entity_type, entity_id, uploaded_by)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
            RETURNING id, original_name, filename, path, size, mime_type, category, entity_type, entity_id, uploaded_by, is_active, created_at
        `;
        
        const result = await pool.query(query, [
            fileData.original_name,
            fileData.filename,
            fileData.path,
            fileData.size,
            fileData.mime_type,
            fileData.category,
            fileData.entity_type,
            fileData.entity_id,
            fileData.uploaded_by
        ]);
        
        return result.rows[0];
    }

    // Atualizar arquivo
    static async updateFileUpload(id: number, fileData: FileUploadUpdate): Promise<FileUpload | null> {
        const fields = [];
        const values = [];
        let paramCount = 1;

        if (fileData.is_active !== undefined) {
            fields.push(`is_active = $${paramCount}`);
            values.push(fileData.is_active);
            paramCount++;
        }

        if (fileData.entity_id !== undefined) {
            fields.push(`entity_id = $${paramCount}`);
            values.push(fileData.entity_id);
            paramCount++;
        }

        if (fields.length === 0) {
            return this.getFileById(id);
        }

        values.push(id);
        const query = `
            UPDATE file_uploads
            SET ${fields.join(', ')}
            WHERE id = $${paramCount}
            RETURNING id, original_name, filename, path, size, mime_type, category, entity_type, entity_id, uploaded_by, is_active, created_at
        `;
        
        const result = await pool.query(query, values);
        return result.rows[0] || null;
    }

    // Deletar arquivo
    static async deleteFileUpload(id: number): Promise<boolean> {
        const client = await pool.connect();
        
        try {
            await client.query('BEGIN');

            // Obter informações do arquivo
            const fileQuery = `
                SELECT filename, path FROM file_uploads WHERE id = $1
            `;
            
            const fileResult = await client.query(fileQuery, [id]);
            
            if (fileResult.rows.length === 0) {
                await client.query('ROLLBACK');
                return false;
            }

            const file = fileResult.rows[0];

            // Deletar registro do banco
            const deleteQuery = `
                DELETE FROM file_uploads WHERE id = $1
            `;
            
            const deleteResult = await client.query(deleteQuery, [id]);
            
            if (deleteResult.rowCount === 0) {
                await client.query('ROLLBACK');
                return false;
            }

            // Deletar arquivo físico
            try {
                const filePath = path.join(process.cwd(), file.path);
                if (fs.existsSync(filePath)) {
                    fs.unlinkSync(filePath);
                }
            } catch (error) {
                console.error('Erro ao deletar arquivo físico:', error);
                // Não falhar se o arquivo físico não existir
            }

            await client.query('COMMIT');
            return true;

        } catch (error) {
            await client.query('ROLLBACK');
            throw error;
        } finally {
            client.release();
        }
    }

    // ========================================
    // GESTÃO DE ARQUIVOS POR ENTIDADE
    // ========================================

    // Obter arquivos por entidade
    static async getFilesByEntity(entityType: string, entityId: number): Promise<FileUpload[]> {
        const query = `
            SELECT 
                f.id,
                f.original_name,
                f.filename,
                f.path,
                f.size,
                f.mime_type,
                f.category,
                f.entity_type,
                f.entity_id,
                f.uploaded_by,
                f.is_active,
                f.created_at,
                u.name as uploaded_by_name
            FROM file_uploads f
            LEFT JOIN users u ON f.uploaded_by = u.id
            WHERE f.entity_type = $1 AND f.entity_id = $2 AND f.is_active = true
            ORDER BY f.created_at DESC
        `;
        
        const result = await pool.query(query, [entityType, entityId]);
        return result.rows;
    }

    // Obter arquivos por categoria
    static async getFilesByCategory(category: string): Promise<FileUpload[]> {
        const query = `
            SELECT 
                f.id,
                f.original_name,
                f.filename,
                f.path,
                f.size,
                f.mime_type,
                f.category,
                f.entity_type,
                f.entity_id,
                f.uploaded_by,
                f.is_active,
                f.created_at,
                u.name as uploaded_by_name
            FROM file_uploads f
            LEFT JOIN users u ON f.uploaded_by = u.id
            WHERE f.category = $1 AND f.is_active = true
            ORDER BY f.created_at DESC
        `;
        
        const result = await pool.query(query, [category]);
        return result.rows;
    }

    // ========================================
    // PROCESSAMENTO DE UPLOAD
    // ========================================

    // Processar upload de arquivo
    static async processFileUpload(
        file: Express.Multer.File,
        category: string,
        entityType: string,
        entityId: number | undefined,
        uploadedBy: number
    ): Promise<FileUpload> {
        // Validar categoria
        if (!this.UPLOAD_CONFIGS[category]) {
            throw new Error(`Categoria de upload inválida: ${category}`);
        }

        const config = this.UPLOAD_CONFIGS[category];

        // Validar tamanho do arquivo
        if (file.size > config.maxFileSize) {
            throw new Error(`Arquivo muito grande. Tamanho máximo: ${config.maxFileSize / (1024 * 1024)}MB`);
        }

        // Validar tipo MIME
        if (!config.allowedMimeTypes.includes(file.mimetype)) {
            throw new Error(`Tipo de arquivo não permitido. Tipos permitidos: ${config.allowedMimeTypes.join(', ')}`);
        }

        // Validar extensão
        const fileExtension = path.extname(file.originalname).toLowerCase();
        if (!config.allowedExtensions.includes(fileExtension)) {
            throw new Error(`Extensão de arquivo não permitida. Extensões permitidas: ${config.allowedExtensions.join(', ')}`);
        }

        // Gerar nome único para o arquivo
        const uniqueFilename = this.generateUniqueFilename(file.originalname);
        
        // Criar diretório se não existir
        const uploadDir = path.join(process.cwd(), config.uploadPath);
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }

        // Caminho completo do arquivo
        const filePath = path.join(uploadDir, uniqueFilename);
        const relativePath = path.join(config.uploadPath, uniqueFilename);

        // Mover arquivo para o diretório de destino
        fs.writeFileSync(filePath, file.buffer);

        // Criar registro no banco de dados
        const fileData: FileUploadCreate = {
            original_name: file.originalname,
            filename: uniqueFilename,
            path: relativePath,
            size: file.size,
            mime_type: file.mimetype,
            category: category as any,
            entity_type: entityType as any,
            entity_id: entityId || undefined,
            uploaded_by: uploadedBy
        };

        return await this.createFileUpload(fileData);
    }

    // Gerar nome único para arquivo
    private static generateUniqueFilename(originalName: string): string {
        const extension = path.extname(originalName);
        const baseName = path.basename(originalName, extension);
        const timestamp = Date.now();
        const uuid = uuidv4().substring(0, 8);
        
        return `${baseName}_${timestamp}_${uuid}${extension}`;
    }

    // ========================================
    // VALIDAÇÕES
    // ========================================

    // Validar se entidade existe
    static async validateEntity(entityType: string, entityId: number): Promise<boolean> {
        let query = '';
        
        switch (entityType) {
            case 'room':
                query = 'SELECT id FROM rooms WHERE id = $1';
                break;
            case 'guest':
                query = 'SELECT id FROM guests WHERE id = $1';
                break;
            case 'payment':
                query = 'SELECT id FROM payments WHERE id = $1';
                break;
            case 'system':
                return true; // Sistema não precisa de validação de ID
            default:
                return false;
        }

        const result = await pool.query(query, [entityId]);
        return result.rows.length > 0;
    }

    // Verificar se arquivo existe
    static async fileExists(id: number): Promise<boolean> {
        const query = `
            SELECT id FROM file_uploads WHERE id = $1
        `;
        
        const result = await pool.query(query, [id]);
        return result.rows.length > 0;
    }

    // ========================================
    // UTILITÁRIOS
    // ========================================

    // Obter configurações de upload
    static getUploadConfig(category: string): UploadConfig | null {
        return this.UPLOAD_CONFIGS[category] || null;
    }

    // Obter categorias disponíveis
    static getAvailableCategories(): string[] {
        return Object.keys(this.UPLOAD_CONFIGS);
    }

    // Obter estatísticas de upload
    static async getUploadStats(): Promise<any> {
        const query = `
            SELECT 
                category,
                entity_type,
                COUNT(*) as total_files,
                SUM(size) as total_size,
                AVG(size) as average_size
            FROM file_uploads
            WHERE is_active = true
            GROUP BY category, entity_type
            ORDER BY total_files DESC
        `;
        
        const result = await pool.query(query);
        return result.rows;
    }

    // Limpar arquivos órfãos (arquivos físicos sem registro no banco)
    static async cleanupOrphanedFiles(): Promise<{ deleted: number; errors: number }> {
        let deleted = 0;
        let errors = 0;

        try {
            // Verificar arquivos em cada categoria
            for (const [category, config] of Object.entries(this.UPLOAD_CONFIGS)) {
                const uploadDir = path.join(process.cwd(), config.uploadPath);
                
                if (!fs.existsSync(uploadDir)) {
                    continue;
                }

                const files = fs.readdirSync(uploadDir);
                
                for (const filename of files) {
                    try {
                        // Verificar se existe registro no banco
                        const query = `
                            SELECT id FROM file_uploads WHERE filename = $1
                        `;
                        
                        const result = await pool.query(query, [filename]);
                        
                        if (result.rows.length === 0) {
                            // Arquivo órfão, deletar
                            const filePath = path.join(uploadDir, filename);
                            fs.unlinkSync(filePath);
                            deleted++;
                        }
                    } catch (error) {
                        console.error(`Erro ao processar arquivo ${filename}:`, error);
                        errors++;
                    }
                }
            }
        } catch (error) {
            console.error('Erro ao limpar arquivos órfãos:', error);
            errors++;
        }

        return { deleted, errors };
    }

    // Obter caminho completo do arquivo
    static getFilePath(fileUpload: FileUpload): string {
        return path.join(process.cwd(), fileUpload.path);
    }

    // Verificar se arquivo físico existe
    static fileExistsPhysically(fileUpload: FileUpload): boolean {
        const filePath = this.getFilePath(fileUpload);
        return fs.existsSync(filePath);
    }
}
