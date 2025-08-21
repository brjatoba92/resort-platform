import { Router } from "express";
import { NotificationController } from "@/controllers/notificationController";
import { authenticate } from "@/middleware/auth";

const router = Router();

// ========================================
// ROTAS DE GESTÃO DE NOTIFICAÇÕES
// ========================================

// Listar todas as notificações
router.get("/", authenticate, NotificationController.getAllNotifications);

// Obter notificação por ID
router.get("/:id", authenticate, NotificationController.getNotificationById);

// Criar nova notificação
router.post("/", authenticate, NotificationController.createNotification);

// Atualizar notificação
router.put("/:id", authenticate, NotificationController.updateNotification);

// Deletar notificação
router.delete("/:id", authenticate, NotificationController.deleteNotification);

// ========================================
// ROTAS DE NOTIFICAÇÕES POR RESERVA
// ========================================

// Obter notificações por reserva
router.get("/reservation/:reservationId", authenticate, NotificationController.getNotificationsByReservation);

// Obter notificações por tipo
router.get("/type/:type", authenticate, NotificationController.getNotificationsByType);

// ========================================
// ROTAS DE ENVIO
// ========================================

// Enviar notificação
router.post("/send", authenticate, NotificationController.sendNotification);

// ========================================
// ROTAS DE NOTIFICAÇÕES AUTOMÁTICAS
// ========================================

// Criar notificação de check-out (1 hora antes)
router.post("/checkout/1h/:reservationId", authenticate, NotificationController.createCheckoutReminder1h);

// Criar notificação de check-out (30 minutos antes)
router.post("/checkout/30min/:reservationId", authenticate, NotificationController.createCheckoutReminder30min);

// Criar notificação de check-in
router.post("/checkin/:reservationId", authenticate, NotificationController.createCheckinReminder);

// Criar notificação de pagamento pendente
router.post("/payment/:reservationId", authenticate, NotificationController.createPaymentReminder);

// Criar notificação de consumo do minibar
router.post("/minibar/:reservationId", authenticate, NotificationController.createMinibarConsumptionNotification);

// Criar notificação de sistema
router.post("/system/alert", authenticate, NotificationController.createSystemAlert);

// ========================================
// ROTAS DE PROCESSAMENTO AUTOMÁTICO
// ========================================

// Processar notificações pendentes
router.post("/process/pending", authenticate, NotificationController.processPendingNotifications);

// Verificar e criar notificações automáticas
router.post("/process/automatic", authenticate, NotificationController.checkAndCreateAutomaticNotifications);

// ========================================
// ROTAS DE ESTATÍSTICAS E RELATÓRIOS
// ========================================

// Obter estatísticas de notificações
router.get("/stats/overview", authenticate, NotificationController.getNotificationStats);

// Obter notificações por período
router.get("/stats/period", authenticate, NotificationController.getNotificationsByPeriod);

// ========================================
// ROTAS DE UTILITÁRIOS
// ========================================

// Obter tipos de notificação disponíveis
router.get("/types/available", authenticate, NotificationController.getAvailableNotificationTypes);

export default router;
