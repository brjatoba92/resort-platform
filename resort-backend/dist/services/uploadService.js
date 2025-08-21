"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UploadService = void 0;
const connection_1 = __importDefault(require("@/database/connection"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const uuid_1 = require("uuid");
class UploadService {
    static async getAllFiles() {
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
        const result = await connection_1.default.query(query);
        return result.rows;
    }
    static async getFileById(id) {
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
        const result = await connection_1.default.query(query, [id]);
        return result.rows[0] || null;
    }
    static async createFileUpload(fileData) {
        const query = `
            INSERT INTO file_uploads (original_name, filename, path, size, mime_type, category, entity_type, entity_id, uploaded_by)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
            RETURNING id, original_name, filename, path, size, mime_type, category, entity_type, entity_id, uploaded_by, is_active, created_at
        `;
        const result = await connection_1.default.query(query, [
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
    static async updateFileUpload(id, fileData) {
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
        const result = await connection_1.default.query(query, values);
        return result.rows[0] || null;
    }
    static async deleteFileUpload(id) {
        const client = await connection_1.default.connect();
        try {
            await client.query('BEGIN');
            const fileQuery = `
                SELECT filename, path FROM file_uploads WHERE id = $1
            `;
            const fileResult = await client.query(fileQuery, [id]);
            if (fileResult.rows.length === 0) {
                await client.query('ROLLBACK');
                return false;
            }
            const file = fileResult.rows[0];
            const deleteQuery = `
                DELETE FROM file_uploads WHERE id = $1
            `;
            const deleteResult = await client.query(deleteQuery, [id]);
            if (deleteResult.rowCount === 0) {
                await client.query('ROLLBACK');
                return false;
            }
            try {
                const filePath = path_1.default.join(process.cwd(), file.path);
                if (fs_1.default.existsSync(filePath)) {
                    fs_1.default.unlinkSync(filePath);
                }
            }
            catch (error) {
                console.error('Erro ao deletar arquivo físico:', error);
            }
            await client.query('COMMIT');
            return true;
        }
        catch (error) {
            await client.query('ROLLBACK');
            throw error;
        }
        finally {
            client.release();
        }
    }
    static async getFilesByEntity(entityType, entityId) {
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
        const result = await connection_1.default.query(query, [entityType, entityId]);
        return result.rows;
    }
    static async getFilesByCategory(category) {
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
        const result = await connection_1.default.query(query, [category]);
        return result.rows;
    }
    static async processFileUpload(file, category, entityType, entityId, uploadedBy) {
        if (!this.UPLOAD_CONFIGS[category]) {
            throw new Error(`Categoria de upload inválida: ${category}`);
        }
        const config = this.UPLOAD_CONFIGS[category];
        if (file.size > config.maxFileSize) {
            throw new Error(`Arquivo muito grande. Tamanho máximo: ${config.maxFileSize / (1024 * 1024)}MB`);
        }
        if (!config.allowedMimeTypes.includes(file.mimetype)) {
            throw new Error(`Tipo de arquivo não permitido. Tipos permitidos: ${config.allowedMimeTypes.join(', ')}`);
        }
        const fileExtension = path_1.default.extname(file.originalname).toLowerCase();
        if (!config.allowedExtensions.includes(fileExtension)) {
            throw new Error(`Extensão de arquivo não permitida. Extensões permitidas: ${config.allowedExtensions.join(', ')}`);
        }
        const uniqueFilename = this.generateUniqueFilename(file.originalname);
        const uploadDir = path_1.default.join(process.cwd(), config.uploadPath);
        if (!fs_1.default.existsSync(uploadDir)) {
            fs_1.default.mkdirSync(uploadDir, { recursive: true });
        }
        const filePath = path_1.default.join(uploadDir, uniqueFilename);
        const relativePath = path_1.default.join(config.uploadPath, uniqueFilename);
        fs_1.default.writeFileSync(filePath, file.buffer);
        const fileData = {
            original_name: file.originalname,
            filename: uniqueFilename,
            path: relativePath,
            size: file.size,
            mime_type: file.mimetype,
            category: category,
            entity_type: entityType,
            entity_id: entityId || undefined,
            uploaded_by: uploadedBy
        };
        return await this.createFileUpload(fileData);
    }
    static generateUniqueFilename(originalName) {
        const extension = path_1.default.extname(originalName);
        const baseName = path_1.default.basename(originalName, extension);
        const timestamp = Date.now();
        const uuid = (0, uuid_1.v4)().substring(0, 8);
        return `${baseName}_${timestamp}_${uuid}${extension}`;
    }
    static async validateEntity(entityType, entityId) {
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
                return true;
            default:
                return false;
        }
        const result = await connection_1.default.query(query, [entityId]);
        return result.rows.length > 0;
    }
    static async fileExists(id) {
        const query = `
            SELECT id FROM file_uploads WHERE id = $1
        `;
        const result = await connection_1.default.query(query, [id]);
        return result.rows.length > 0;
    }
    static getUploadConfig(category) {
        return this.UPLOAD_CONFIGS[category] || null;
    }
    static getAvailableCategories() {
        return Object.keys(this.UPLOAD_CONFIGS);
    }
    static async getUploadStats() {
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
        const result = await connection_1.default.query(query);
        return result.rows;
    }
    static async cleanupOrphanedFiles() {
        let deleted = 0;
        let errors = 0;
        try {
            for (const [category, config] of Object.entries(this.UPLOAD_CONFIGS)) {
                const uploadDir = path_1.default.join(process.cwd(), config.uploadPath);
                if (!fs_1.default.existsSync(uploadDir)) {
                    continue;
                }
                const files = fs_1.default.readdirSync(uploadDir);
                for (const filename of files) {
                    try {
                        const query = `
                            SELECT id FROM file_uploads WHERE filename = $1
                        `;
                        const result = await connection_1.default.query(query, [filename]);
                        if (result.rows.length === 0) {
                            const filePath = path_1.default.join(uploadDir, filename);
                            fs_1.default.unlinkSync(filePath);
                            deleted++;
                        }
                    }
                    catch (error) {
                        console.error(`Erro ao processar arquivo ${filename}:`, error);
                        errors++;
                    }
                }
            }
        }
        catch (error) {
            console.error('Erro ao limpar arquivos órfãos:', error);
            errors++;
        }
        return { deleted, errors };
    }
    static getFilePath(fileUpload) {
        return path_1.default.join(process.cwd(), fileUpload.path);
    }
    static fileExistsPhysically(fileUpload) {
        const filePath = this.getFilePath(fileUpload);
        return fs_1.default.existsSync(filePath);
    }
}
exports.UploadService = UploadService;
UploadService.UPLOAD_CONFIGS = {
    room_image: {
        maxFileSize: 5 * 1024 * 1024,
        allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp'],
        allowedExtensions: ['.jpg', '.jpeg', '.png', '.webp'],
        uploadPath: 'uploads/rooms'
    },
    guest_document: {
        maxFileSize: 10 * 1024 * 1024,
        allowedMimeTypes: ['application/pdf', 'image/jpeg', 'image/png'],
        allowedExtensions: ['.pdf', '.jpg', '.jpeg', '.png'],
        uploadPath: 'uploads/guests'
    },
    payment_receipt: {
        maxFileSize: 5 * 1024 * 1024,
        allowedMimeTypes: ['application/pdf', 'image/jpeg', 'image/png'],
        allowedExtensions: ['.pdf', '.jpg', '.jpeg', '.png'],
        uploadPath: 'uploads/payments'
    },
    system_file: {
        maxFileSize: 20 * 1024 * 1024,
        allowedMimeTypes: ['application/pdf', 'image/jpeg', 'image/png', 'text/plain'],
        allowedExtensions: ['.pdf', '.jpg', '.jpeg', '.png', '.txt'],
        uploadPath: 'uploads/system'
    }
};
//# sourceMappingURL=uploadService.js.map