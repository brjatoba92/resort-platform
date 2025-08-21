import { Router } from "express";
import multer from "multer";
import { UploadController } from "@/controllers/uploadController";
import { authenticate } from "@/middleware/auth";

const router = Router();

// Configuração do multer para processar arquivos em memória
const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 20 * 1024 * 1024, // 20MB máximo
    },
    fileFilter: (req, file, cb) => {
        // Permitir todos os tipos de arquivo - validação será feita no controller
        cb(null, true);
    }
});

// ========================================
// ROTAS DE GESTÃO DE ARQUIVOS
// ========================================

// Listar todos os arquivos
router.get("/", authenticate, UploadController.getAllFiles);

// Obter arquivo por ID
router.get("/:id", authenticate, UploadController.getFileById);

// Upload de arquivo genérico
router.post("/", authenticate, upload.single('file'), UploadController.uploadFile);

// Atualizar arquivo
router.put("/:id", authenticate, UploadController.updateFileUpload);

// Deletar arquivo
router.delete("/:id", authenticate, UploadController.deleteFileUpload);

// ========================================
// ROTAS DE GESTÃO DE ARQUIVOS POR ENTIDADE
// ========================================

// Obter arquivos por entidade
router.get("/entity/:entityType/:entityId", authenticate, UploadController.getFilesByEntity);

// Obter arquivos por categoria
router.get("/category/:category", authenticate, UploadController.getFilesByCategory);

// ========================================
// ROTAS DE DOWNLOAD E VISUALIZAÇÃO
// ========================================

// Download de arquivo
router.get("/download/:id", authenticate, UploadController.downloadFile);

// Visualizar arquivo (para imagens)
router.get("/view/:id", authenticate, UploadController.viewFile);

// ========================================
// ROTAS DE UPLOADS ESPECÍFICOS
// ========================================

// Upload de imagem de quarto
router.post("/room/:roomId/image", authenticate, upload.single('image'), UploadController.uploadRoomImage);

// Upload de documento de hóspede
router.post("/guest/:guestId/document", authenticate, upload.single('document'), UploadController.uploadGuestDocument);

// Upload de comprovante de pagamento
router.post("/payment/:paymentId/receipt", authenticate, upload.single('receipt'), UploadController.uploadPaymentReceipt);

// ========================================
// ROTAS DE MANUTENÇÃO E UTILITÁRIOS
// ========================================

// Limpar arquivos órfãos
router.post("/maintenance/cleanup", authenticate, UploadController.cleanupOrphanedFiles);

// Obter estatísticas de upload
router.get("/stats/overview", authenticate, UploadController.getUploadStats);

// Obter configurações de upload
router.get("/config/:category", authenticate, UploadController.getUploadConfig);

// Obter categorias disponíveis
router.get("/categories/available", authenticate, UploadController.getAvailableCategories);

export default router;
