"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UploadController = void 0;
const uploadService_1 = require("@/services/uploadService");
const responses_1 = require("@/utils/responses");
const validators_1 = require("@/utils/validators");
class UploadController {
    static async getAllFiles(req, res) {
        try {
            const files = await uploadService_1.UploadService.getAllFiles();
            return responses_1.ResponseHandler.success(res, files, "Arquivos listados com sucesso");
        }
        catch (error) {
            console.error("Erro ao listar arquivos:", error);
            return responses_1.ResponseHandler.error(res, "Erro ao listar arquivos", 500);
        }
    }
    static async getFileById(req, res) {
        try {
            const { id } = req.params;
            if (!id) {
                return responses_1.ResponseHandler.error(res, "ID do arquivo é obrigatório", 400);
            }
            const file = await uploadService_1.UploadService.getFileById(parseInt(id));
            if (!file) {
                return responses_1.ResponseHandler.error(res, "Arquivo não encontrado", 404);
            }
            return responses_1.ResponseHandler.success(res, file, "Arquivo encontrado com sucesso");
        }
        catch (error) {
            console.error("Erro ao obter arquivo:", error);
            return responses_1.ResponseHandler.error(res, "Erro ao obter arquivo", 500);
        }
    }
    static async uploadFile(req, res) {
        try {
            const { error } = validators_1.uploadFileSchema.validate(req.body);
            if (error) {
                return responses_1.ResponseHandler.error(res, error.details[0]?.message || "Dados inválidos", 400);
            }
            if (!req.file) {
                return responses_1.ResponseHandler.error(res, "Nenhum arquivo foi enviado", 400);
            }
            const { category, entity_type, entity_id } = req.body;
            if (entity_id) {
                const isValidEntity = await uploadService_1.UploadService.validateEntity(entity_type, parseInt(entity_id));
                if (!isValidEntity) {
                    return responses_1.ResponseHandler.error(res, "Entidade não encontrada", 400);
                }
            }
            const fileUpload = await uploadService_1.UploadService.processFileUpload(req.file, category, entity_type, entity_id ? parseInt(entity_id) : undefined, req.user.userId);
            return responses_1.ResponseHandler.success(res, fileUpload, "Arquivo enviado com sucesso", 201);
        }
        catch (error) {
            console.error("Erro ao fazer upload:", error);
            return responses_1.ResponseHandler.error(res, error instanceof Error ? error.message : "Erro ao fazer upload", 500);
        }
    }
    static async updateFileUpload(req, res) {
        try {
            const { id } = req.params;
            if (!id) {
                return responses_1.ResponseHandler.error(res, "ID do arquivo é obrigatório", 400);
            }
            const { error } = validators_1.updateFileUploadSchema.validate(req.body);
            if (error) {
                return responses_1.ResponseHandler.error(res, error.details[0]?.message || "Dados inválidos", 400);
            }
            const file = await uploadService_1.UploadService.updateFileUpload(parseInt(id), req.body);
            if (!file) {
                return responses_1.ResponseHandler.error(res, "Arquivo não encontrado", 404);
            }
            return responses_1.ResponseHandler.success(res, file, "Arquivo atualizado com sucesso");
        }
        catch (error) {
            console.error("Erro ao atualizar arquivo:", error);
            return responses_1.ResponseHandler.error(res, "Erro ao atualizar arquivo", 500);
        }
    }
    static async deleteFileUpload(req, res) {
        try {
            const { id } = req.params;
            if (!id) {
                return responses_1.ResponseHandler.error(res, "ID do arquivo é obrigatório", 400);
            }
            const deleted = await uploadService_1.UploadService.deleteFileUpload(parseInt(id));
            if (!deleted) {
                return responses_1.ResponseHandler.error(res, "Arquivo não encontrado", 404);
            }
            return responses_1.ResponseHandler.success(res, null, "Arquivo deletado com sucesso");
        }
        catch (error) {
            console.error("Erro ao deletar arquivo:", error);
            return responses_1.ResponseHandler.error(res, "Erro ao deletar arquivo", 500);
        }
    }
    static async getFilesByEntity(req, res) {
        try {
            const { entityType, entityId } = req.params;
            if (!entityType || !entityId) {
                return responses_1.ResponseHandler.error(res, "Tipo e ID da entidade são obrigatórios", 400);
            }
            const files = await uploadService_1.UploadService.getFilesByEntity(entityType, parseInt(entityId));
            return responses_1.ResponseHandler.success(res, files, "Arquivos da entidade obtidos com sucesso");
        }
        catch (error) {
            console.error("Erro ao obter arquivos da entidade:", error);
            return responses_1.ResponseHandler.error(res, "Erro ao obter arquivos da entidade", 500);
        }
    }
    static async getFilesByCategory(req, res) {
        try {
            const { category } = req.params;
            if (!category) {
                return responses_1.ResponseHandler.error(res, "Categoria é obrigatória", 400);
            }
            const files = await uploadService_1.UploadService.getFilesByCategory(category);
            return responses_1.ResponseHandler.success(res, files, "Arquivos por categoria obtidos com sucesso");
        }
        catch (error) {
            console.error("Erro ao obter arquivos por categoria:", error);
            return responses_1.ResponseHandler.error(res, "Erro ao obter arquivos por categoria", 500);
        }
    }
    static async downloadFile(req, res) {
        try {
            const { id } = req.params;
            if (!id) {
                return responses_1.ResponseHandler.error(res, "ID do arquivo é obrigatório", 400);
            }
            const file = await uploadService_1.UploadService.getFileById(parseInt(id));
            if (!file) {
                return responses_1.ResponseHandler.error(res, "Arquivo não encontrado", 404);
            }
            if (!uploadService_1.UploadService.fileExistsPhysically(file)) {
                return responses_1.ResponseHandler.error(res, "Arquivo físico não encontrado", 404);
            }
            const filePath = uploadService_1.UploadService.getFilePath(file);
            res.setHeader('Content-Type', file.mime_type);
            res.setHeader('Content-Disposition', `attachment; filename="${file.original_name}"`);
            res.sendFile(filePath);
            return;
        }
        catch (error) {
            console.error("Erro ao fazer download:", error);
            return responses_1.ResponseHandler.error(res, "Erro ao fazer download", 500);
        }
    }
    static async viewFile(req, res) {
        try {
            const { id } = req.params;
            if (!id) {
                return responses_1.ResponseHandler.error(res, "ID do arquivo é obrigatório", 400);
            }
            const file = await uploadService_1.UploadService.getFileById(parseInt(id));
            if (!file) {
                return responses_1.ResponseHandler.error(res, "Arquivo não encontrado", 404);
            }
            if (!file.mime_type.startsWith('image/')) {
                return responses_1.ResponseHandler.error(res, "Arquivo não é uma imagem", 400);
            }
            if (!uploadService_1.UploadService.fileExistsPhysically(file)) {
                return responses_1.ResponseHandler.error(res, "Arquivo físico não encontrado", 404);
            }
            const filePath = uploadService_1.UploadService.getFilePath(file);
            res.setHeader('Content-Type', file.mime_type);
            res.setHeader('Cache-Control', 'public, max-age=31536000');
            res.sendFile(filePath);
            return;
        }
        catch (error) {
            console.error("Erro ao visualizar arquivo:", error);
            return responses_1.ResponseHandler.error(res, "Erro ao visualizar arquivo", 500);
        }
    }
    static async uploadRoomImage(req, res) {
        try {
            const { roomId } = req.params;
            if (!roomId) {
                return responses_1.ResponseHandler.error(res, "ID do quarto é obrigatório", 400);
            }
            if (!req.file) {
                return responses_1.ResponseHandler.error(res, "Nenhuma imagem foi enviada", 400);
            }
            const isValidRoom = await uploadService_1.UploadService.validateEntity('room', parseInt(roomId));
            if (!isValidRoom) {
                return responses_1.ResponseHandler.error(res, "Quarto não encontrado", 400);
            }
            const fileUpload = await uploadService_1.UploadService.processFileUpload(req.file, 'room_image', 'room', parseInt(roomId), req.user.userId);
            return responses_1.ResponseHandler.success(res, fileUpload, "Imagem do quarto enviada com sucesso", 201);
        }
        catch (error) {
            console.error("Erro ao fazer upload de imagem do quarto:", error);
            return responses_1.ResponseHandler.error(res, error instanceof Error ? error.message : "Erro ao fazer upload", 500);
        }
    }
    static async uploadGuestDocument(req, res) {
        try {
            const { guestId } = req.params;
            if (!guestId) {
                return responses_1.ResponseHandler.error(res, "ID do hóspede é obrigatório", 400);
            }
            if (!req.file) {
                return responses_1.ResponseHandler.error(res, "Nenhum documento foi enviado", 400);
            }
            const isValidGuest = await uploadService_1.UploadService.validateEntity('guest', parseInt(guestId));
            if (!isValidGuest) {
                return responses_1.ResponseHandler.error(res, "Hóspede não encontrado", 400);
            }
            const fileUpload = await uploadService_1.UploadService.processFileUpload(req.file, 'guest_document', 'guest', parseInt(guestId), req.user.userId);
            return responses_1.ResponseHandler.success(res, fileUpload, "Documento do hóspede enviado com sucesso", 201);
        }
        catch (error) {
            console.error("Erro ao fazer upload de documento do hóspede:", error);
            return responses_1.ResponseHandler.error(res, error instanceof Error ? error.message : "Erro ao fazer upload", 500);
        }
    }
    static async uploadPaymentReceipt(req, res) {
        try {
            const { paymentId } = req.params;
            if (!paymentId) {
                return responses_1.ResponseHandler.error(res, "ID do pagamento é obrigatório", 400);
            }
            if (!req.file) {
                return responses_1.ResponseHandler.error(res, "Nenhum comprovante foi enviado", 400);
            }
            const isValidPayment = await uploadService_1.UploadService.validateEntity('payment', parseInt(paymentId));
            if (!isValidPayment) {
                return responses_1.ResponseHandler.error(res, "Pagamento não encontrado", 400);
            }
            const fileUpload = await uploadService_1.UploadService.processFileUpload(req.file, 'payment_receipt', 'payment', parseInt(paymentId), req.user.userId);
            return responses_1.ResponseHandler.success(res, fileUpload, "Comprovante de pagamento enviado com sucesso", 201);
        }
        catch (error) {
            console.error("Erro ao fazer upload de comprovante:", error);
            return responses_1.ResponseHandler.error(res, error instanceof Error ? error.message : "Erro ao fazer upload", 500);
        }
    }
    static async cleanupOrphanedFiles(req, res) {
        try {
            const result = await uploadService_1.UploadService.cleanupOrphanedFiles();
            return responses_1.ResponseHandler.success(res, result, "Limpeza de arquivos órfãos concluída com sucesso");
        }
        catch (error) {
            console.error("Erro ao limpar arquivos órfãos:", error);
            return responses_1.ResponseHandler.error(res, "Erro ao limpar arquivos órfãos", 500);
        }
    }
    static async getUploadStats(req, res) {
        try {
            const stats = await uploadService_1.UploadService.getUploadStats();
            return responses_1.ResponseHandler.success(res, stats, "Estatísticas de upload obtidas com sucesso");
        }
        catch (error) {
            console.error("Erro ao obter estatísticas de upload:", error);
            return responses_1.ResponseHandler.error(res, "Erro ao obter estatísticas de upload", 500);
        }
    }
    static async getUploadConfig(req, res) {
        try {
            const { category } = req.params;
            if (!category) {
                return responses_1.ResponseHandler.error(res, "Categoria é obrigatória", 400);
            }
            const config = uploadService_1.UploadService.getUploadConfig(category);
            if (!config) {
                return responses_1.ResponseHandler.error(res, "Categoria não encontrada", 404);
            }
            return responses_1.ResponseHandler.success(res, config, "Configuração de upload obtida com sucesso");
        }
        catch (error) {
            console.error("Erro ao obter configuração de upload:", error);
            return responses_1.ResponseHandler.error(res, "Erro ao obter configuração de upload", 500);
        }
    }
    static async getAvailableCategories(req, res) {
        try {
            const categories = uploadService_1.UploadService.getAvailableCategories();
            return responses_1.ResponseHandler.success(res, categories, "Categorias disponíveis obtidas com sucesso");
        }
        catch (error) {
            console.error("Erro ao obter categorias disponíveis:", error);
            return responses_1.ResponseHandler.error(res, "Erro ao obter categorias disponíveis", 500);
        }
    }
}
exports.UploadController = UploadController;
//# sourceMappingURL=uploadController.js.map