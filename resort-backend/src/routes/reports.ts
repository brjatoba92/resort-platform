import { Router } from "express";
import { ReportController } from "@/controllers/reportController";
import { authenticate } from "@/middleware/auth";

const router = Router();

// ========================================
// ROTAS DE GERAÇÃO DE RELATÓRIOS
// ========================================

// Gerar relatório genérico
router.post("/generate", authenticate, ReportController.generateReport);

// Relatórios específicos
router.get("/financial", authenticate, ReportController.generateFinancialReport);
router.get("/occupancy", authenticate, ReportController.generateOccupancyReport);
router.get("/minibar", authenticate, ReportController.generateMinibarReport);
router.get("/notifications", authenticate, ReportController.generateNotificationReport);

// ========================================
// ROTAS DE RELATÓRIOS PERSONALIZADOS
// ========================================

// Relatório personalizado
router.post("/custom", authenticate, ReportController.generateCustomReport);

// ========================================
// ROTAS DE UTILITÁRIOS
// ========================================

// Obter tipos de relatório disponíveis
router.get("/types/available", authenticate, ReportController.getAvailableReportTypes);

// Obter formatos de exportação disponíveis
router.get("/formats/available", authenticate, ReportController.getAvailableExportFormats);

// Obter estatísticas de relatórios
router.get("/stats/overview", authenticate, ReportController.getReportStats);

// ========================================
// ROTAS DE RELATÓRIOS RÁPIDOS
// ========================================

// Relatório rápido de dashboard
router.get("/quick/dashboard", authenticate, ReportController.getQuickDashboardReport);

// Endpoint de teste
router.get("/test/database", authenticate, ReportController.testDatabase);

// Endpoint para criar dados de teste
router.post("/test/create-data", authenticate, ReportController.createTestData);

export default router;
