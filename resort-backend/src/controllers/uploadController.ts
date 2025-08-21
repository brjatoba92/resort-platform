import { Request, Response } from "express";
import { UploadService } from "@/services/uploadService";
import { ResponseHandler } from "@/utils/responses";
import { AuthRequest } from "@/middleware/auth";
import { 
    uploadFileSchema, 
    updateFileUploadSchema, 
    getFilesByEntitySchema 
} from "@/utils/validators";

export class UploadController {
    // ========================================
    // GESTÃO DE ARQUIVOS
    // ========================================

    // Listar todos os arquivos
    static async getAllFiles(req: Request, res: Response) {
        try {
            const files = await UploadService.getAllFiles();
            return ResponseHandler.success(res, files, "Arquivos listados com sucesso");
        } catch (error) {
            console.error("Erro ao listar arquivos:", error);
            return ResponseHandler.error(res, "Erro ao listar arquivos", 500);
        }
    }

    // Obter arquivo por ID
    static async getFileById(req: Request, res: Response) {
        try {
            const { id } = req.params;
            if (!id) {
                return ResponseHandler.error(res, "ID do arquivo é obrigatório", 400);
            }
            
            const file = await UploadService.getFileById(parseInt(id));
            
            if (!file) {
                return ResponseHandler.error(res, "Arquivo não encontrado", 404);
            }
            
            return ResponseHandler.success(res, file, "Arquivo encontrado com sucesso");
        } catch (error) {
            console.error("Erro ao obter arquivo:", error);
            return ResponseHandler.error(res, "Erro ao obter arquivo", 500);
        }
    }

    // Upload de arquivo
    static async uploadFile(req: AuthRequest, res: Response) {
        try {
            // Validar dados da requisição
            const { error } = uploadFileSchema.validate(req.body);
            if (error) {
                return ResponseHandler.error(res, error.details[0]?.message || "Dados inválidos", 400);
            }

            // Verificar se arquivo foi enviado
            if (!req.file) {
                return ResponseHandler.error(res, "Nenhum arquivo foi enviado", 400);
            }

            const { category, entity_type, entity_id } = req.body;

            // Validar se entidade existe (se entity_id foi fornecido)
            if (entity_id) {
                const isValidEntity = await UploadService.validateEntity(entity_type, parseInt(entity_id));
                if (!isValidEntity) {
                    return ResponseHandler.error(res, "Entidade não encontrada", 400);
                }
            }

            // Processar upload
            const fileUpload = await UploadService.processFileUpload(
                req.file,
                category,
                entity_type,
                entity_id ? parseInt(entity_id) : undefined,
                req.user!.userId
            );

            return ResponseHandler.success(res, fileUpload, "Arquivo enviado com sucesso", 201);
        } catch (error) {
            console.error("Erro ao fazer upload:", error);
            return ResponseHandler.error(res, error instanceof Error ? error.message : "Erro ao fazer upload", 500);
        }
    }

    // Atualizar arquivo
    static async updateFileUpload(req: Request, res: Response) {
        try {
            const { id } = req.params;
            if (!id) {
                return ResponseHandler.error(res, "ID do arquivo é obrigatório", 400);
            }
            
            const { error } = updateFileUploadSchema.validate(req.body);
            
            if (error) {
                return ResponseHandler.error(res, error.details[0]?.message || "Dados inválidos", 400);
            }

            const file = await UploadService.updateFileUpload(parseInt(id), req.body);
            
            if (!file) {
                return ResponseHandler.error(res, "Arquivo não encontrado", 404);
            }
            
            return ResponseHandler.success(res, file, "Arquivo atualizado com sucesso");
        } catch (error) {
            console.error("Erro ao atualizar arquivo:", error);
            return ResponseHandler.error(res, "Erro ao atualizar arquivo", 500);
        }
    }

    // Deletar arquivo
    static async deleteFileUpload(req: Request, res: Response) {
        try {
            const { id } = req.params;
            if (!id) {
                return ResponseHandler.error(res, "ID do arquivo é obrigatório", 400);
            }
            
            const deleted = await UploadService.deleteFileUpload(parseInt(id));
            
            if (!deleted) {
                return ResponseHandler.error(res, "Arquivo não encontrado", 404);
            }
            
            return ResponseHandler.success(res, null, "Arquivo deletado com sucesso");
        } catch (error) {
            console.error("Erro ao deletar arquivo:", error);
            return ResponseHandler.error(res, "Erro ao deletar arquivo", 500);
        }
    }

    // ========================================
    // GESTÃO DE ARQUIVOS POR ENTIDADE
    // ========================================

    // Obter arquivos por entidade
    static async getFilesByEntity(req: Request, res: Response) {
        try {
            const { entityType, entityId } = req.params;
            if (!entityType || !entityId) {
                return ResponseHandler.error(res, "Tipo e ID da entidade são obrigatórios", 400);
            }
            
            const files = await UploadService.getFilesByEntity(entityType, parseInt(entityId));
            return ResponseHandler.success(res, files, "Arquivos da entidade obtidos com sucesso");
        } catch (error) {
            console.error("Erro ao obter arquivos da entidade:", error);
            return ResponseHandler.error(res, "Erro ao obter arquivos da entidade", 500);
        }
    }

    // Obter arquivos por categoria
    static async getFilesByCategory(req: Request, res: Response) {
        try {
            const { category } = req.params;
            if (!category) {
                return ResponseHandler.error(res, "Categoria é obrigatória", 400);
            }
            
            const files = await UploadService.getFilesByCategory(category);
            return ResponseHandler.success(res, files, "Arquivos por categoria obtidos com sucesso");
        } catch (error) {
            console.error("Erro ao obter arquivos por categoria:", error);
            return ResponseHandler.error(res, "Erro ao obter arquivos por categoria", 500);
        }
    }

    // ========================================
    // DOWNLOAD E VISUALIZAÇÃO
    // ========================================

    // Download de arquivo
    static async downloadFile(req: Request, res: Response) {
        try {
            const { id } = req.params;
            if (!id) {
                return ResponseHandler.error(res, "ID do arquivo é obrigatório", 400);
            }
            
            const file = await UploadService.getFileById(parseInt(id));
            
            if (!file) {
                return ResponseHandler.error(res, "Arquivo não encontrado", 404);
            }

            // Verificar se arquivo físico existe
            if (!UploadService.fileExistsPhysically(file)) {
                return ResponseHandler.error(res, "Arquivo físico não encontrado", 404);
            }

            const filePath = UploadService.getFilePath(file);
            
            // Configurar headers para download
            res.setHeader('Content-Type', file.mime_type);
            res.setHeader('Content-Disposition', `attachment; filename="${file.original_name}"`);
            
            // Enviar arquivo
            res.sendFile(filePath);
            return;
        } catch (error) {
            console.error("Erro ao fazer download:", error);
            return ResponseHandler.error(res, "Erro ao fazer download", 500);
        }
    }

    // Visualizar arquivo (para imagens)
    static async viewFile(req: Request, res: Response) {
        try {
            const { id } = req.params;
            if (!id) {
                return ResponseHandler.error(res, "ID do arquivo é obrigatório", 400);
            }
            
            const file = await UploadService.getFileById(parseInt(id));
            
            if (!file) {
                return ResponseHandler.error(res, "Arquivo não encontrado", 404);
            }

            // Verificar se é uma imagem
            if (!file.mime_type.startsWith('image/')) {
                return ResponseHandler.error(res, "Arquivo não é uma imagem", 400);
            }

            // Verificar se arquivo físico existe
            if (!UploadService.fileExistsPhysically(file)) {
                return ResponseHandler.error(res, "Arquivo físico não encontrado", 404);
            }

            const filePath = UploadService.getFilePath(file);
            
            // Configurar headers para visualização
            res.setHeader('Content-Type', file.mime_type);
            res.setHeader('Cache-Control', 'public, max-age=31536000'); // Cache por 1 ano
            
            // Enviar arquivo
            res.sendFile(filePath);
            return;
        } catch (error) {
            console.error("Erro ao visualizar arquivo:", error);
            return ResponseHandler.error(res, "Erro ao visualizar arquivo", 500);
        }
    }

    // ========================================
    // UPLOADS ESPECÍFICOS
    // ========================================

    // Upload de imagem de quarto
    static async uploadRoomImage(req: AuthRequest, res: Response) {
        try {
            const { roomId } = req.params;
            if (!roomId) {
                return ResponseHandler.error(res, "ID do quarto é obrigatório", 400);
            }

            if (!req.file) {
                return ResponseHandler.error(res, "Nenhuma imagem foi enviada", 400);
            }

            // Validar se quarto existe
            const isValidRoom = await UploadService.validateEntity('room', parseInt(roomId));
            if (!isValidRoom) {
                return ResponseHandler.error(res, "Quarto não encontrado", 400);
            }

            const fileUpload = await UploadService.processFileUpload(
                req.file,
                'room_image',
                'room',
                parseInt(roomId),
                req.user!.userId
            );

            return ResponseHandler.success(res, fileUpload, "Imagem do quarto enviada com sucesso", 201);
        } catch (error) {
            console.error("Erro ao fazer upload de imagem do quarto:", error);
            return ResponseHandler.error(res, error instanceof Error ? error.message : "Erro ao fazer upload", 500);
        }
    }

    // Upload de documento de hóspede
    static async uploadGuestDocument(req: AuthRequest, res: Response) {
        try {
            const { guestId } = req.params;
            if (!guestId) {
                return ResponseHandler.error(res, "ID do hóspede é obrigatório", 400);
            }

            if (!req.file) {
                return ResponseHandler.error(res, "Nenhum documento foi enviado", 400);
            }

            // Validar se hóspede existe
            const isValidGuest = await UploadService.validateEntity('guest', parseInt(guestId));
            if (!isValidGuest) {
                return ResponseHandler.error(res, "Hóspede não encontrado", 400);
            }

            const fileUpload = await UploadService.processFileUpload(
                req.file,
                'guest_document',
                'guest',
                parseInt(guestId),
                req.user!.userId
            );

            return ResponseHandler.success(res, fileUpload, "Documento do hóspede enviado com sucesso", 201);
        } catch (error) {
            console.error("Erro ao fazer upload de documento do hóspede:", error);
            return ResponseHandler.error(res, error instanceof Error ? error.message : "Erro ao fazer upload", 500);
        }
    }

    // Upload de comprovante de pagamento
    static async uploadPaymentReceipt(req: AuthRequest, res: Response) {
        try {
            const { paymentId } = req.params;
            if (!paymentId) {
                return ResponseHandler.error(res, "ID do pagamento é obrigatório", 400);
            }

            if (!req.file) {
                return ResponseHandler.error(res, "Nenhum comprovante foi enviado", 400);
            }

            // Validar se pagamento existe
            const isValidPayment = await UploadService.validateEntity('payment', parseInt(paymentId));
            if (!isValidPayment) {
                return ResponseHandler.error(res, "Pagamento não encontrado", 400);
            }

            const fileUpload = await UploadService.processFileUpload(
                req.file,
                'payment_receipt',
                'payment',
                parseInt(paymentId),
                req.user!.userId
            );

            return ResponseHandler.success(res, fileUpload, "Comprovante de pagamento enviado com sucesso", 201);
        } catch (error) {
            console.error("Erro ao fazer upload de comprovante:", error);
            return ResponseHandler.error(res, error instanceof Error ? error.message : "Erro ao fazer upload", 500);
        }
    }

    // ========================================
    // MANUTENÇÃO E UTILITÁRIOS
    // ========================================

    // Limpar arquivos órfãos
    static async cleanupOrphanedFiles(req: Request, res: Response) {
        try {
            const result = await UploadService.cleanupOrphanedFiles();
            return ResponseHandler.success(res, result, "Limpeza de arquivos órfãos concluída com sucesso");
        } catch (error) {
            console.error("Erro ao limpar arquivos órfãos:", error);
            return ResponseHandler.error(res, "Erro ao limpar arquivos órfãos", 500);
        }
    }

    // Obter estatísticas de upload
    static async getUploadStats(req: Request, res: Response) {
        try {
            const stats = await UploadService.getUploadStats();
            return ResponseHandler.success(res, stats, "Estatísticas de upload obtidas com sucesso");
        } catch (error) {
            console.error("Erro ao obter estatísticas de upload:", error);
            return ResponseHandler.error(res, "Erro ao obter estatísticas de upload", 500);
        }
    }

    // ========================================
    // UTILITÁRIOS
    // ========================================

    // Obter configurações de upload
    static async getUploadConfig(req: Request, res: Response) {
        try {
            const { category } = req.params;
            if (!category) {
                return ResponseHandler.error(res, "Categoria é obrigatória", 400);
            }
            
            const config = UploadService.getUploadConfig(category);
            
            if (!config) {
                return ResponseHandler.error(res, "Categoria não encontrada", 404);
            }
            
            return ResponseHandler.success(res, config, "Configuração de upload obtida com sucesso");
        } catch (error) {
            console.error("Erro ao obter configuração de upload:", error);
            return ResponseHandler.error(res, "Erro ao obter configuração de upload", 500);
        }
    }

    // Obter categorias disponíveis
    static async getAvailableCategories(req: Request, res: Response) {
        try {
            const categories = UploadService.getAvailableCategories();
            return ResponseHandler.success(res, categories, "Categorias disponíveis obtidas com sucesso");
        } catch (error) {
            console.error("Erro ao obter categorias disponíveis:", error);
            return ResponseHandler.error(res, "Erro ao obter categorias disponíveis", 500);
        }
    }
}
