"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationController = void 0;
const notificationService_1 = require("@/services/notificationService");
const responses_1 = require("@/utils/responses");
const validators_1 = require("@/utils/validators");
class NotificationController {
    static async getAllNotifications(req, res) {
        try {
            const notifications = await notificationService_1.NotificationService.getAllNotifications();
            return responses_1.ResponseHandler.success(res, notifications, "Notificações listadas com sucesso");
        }
        catch (error) {
            console.error("Erro ao listar notificações:", error);
            return responses_1.ResponseHandler.error(res, "Erro ao listar notificações", 500);
        }
    }
    static async getNotificationById(req, res) {
        try {
            const { id } = req.params;
            if (!id) {
                return responses_1.ResponseHandler.error(res, "ID da notificação é obrigatório", 400);
            }
            const notification = await notificationService_1.NotificationService.getNotificationById(parseInt(id));
            if (!notification) {
                return responses_1.ResponseHandler.error(res, "Notificação não encontrada", 404);
            }
            return responses_1.ResponseHandler.success(res, notification, "Notificação encontrada com sucesso");
        }
        catch (error) {
            console.error("Erro ao obter notificação:", error);
            return responses_1.ResponseHandler.error(res, "Erro ao obter notificação", 500);
        }
    }
    static async createNotification(req, res) {
        try {
            const { error } = validators_1.createNotificationSchema.validate(req.body);
            if (error) {
                return responses_1.ResponseHandler.error(res, error.details[0]?.message || "Dados inválidos", 400);
            }
            if (req.body.type !== 'system_alert') {
                const isValidReservation = await notificationService_1.NotificationService.validateReservation(req.body.reservation_id);
                if (!isValidReservation) {
                    return responses_1.ResponseHandler.error(res, "Reserva não encontrada ou não está ativa", 400);
                }
            }
            const notification = await notificationService_1.NotificationService.createNotification(req.body);
            return responses_1.ResponseHandler.success(res, notification, "Notificação criada com sucesso", 201);
        }
        catch (error) {
            console.error("Erro ao criar notificação:", error);
            return responses_1.ResponseHandler.error(res, "Erro ao criar notificação", 500);
        }
    }
    static async updateNotification(req, res) {
        try {
            const { id } = req.params;
            if (!id) {
                return responses_1.ResponseHandler.error(res, "ID da notificação é obrigatório", 400);
            }
            const { error } = validators_1.updateNotificationSchema.validate(req.body);
            if (error) {
                return responses_1.ResponseHandler.error(res, error.details[0]?.message || "Dados inválidos", 400);
            }
            const notification = await notificationService_1.NotificationService.updateNotification(parseInt(id), req.body);
            if (!notification) {
                return responses_1.ResponseHandler.error(res, "Notificação não encontrada", 404);
            }
            return responses_1.ResponseHandler.success(res, notification, "Notificação atualizada com sucesso");
        }
        catch (error) {
            console.error("Erro ao atualizar notificação:", error);
            return responses_1.ResponseHandler.error(res, "Erro ao atualizar notificação", 500);
        }
    }
    static async deleteNotification(req, res) {
        try {
            const { id } = req.params;
            if (!id) {
                return responses_1.ResponseHandler.error(res, "ID da notificação é obrigatório", 400);
            }
            const deleted = await notificationService_1.NotificationService.deleteNotification(parseInt(id));
            if (!deleted) {
                return responses_1.ResponseHandler.error(res, "Notificação não encontrada", 404);
            }
            return responses_1.ResponseHandler.success(res, null, "Notificação deletada com sucesso");
        }
        catch (error) {
            console.error("Erro ao deletar notificação:", error);
            return responses_1.ResponseHandler.error(res, "Erro ao deletar notificação", 500);
        }
    }
    static async getNotificationsByReservation(req, res) {
        try {
            const { reservationId } = req.params;
            if (!reservationId) {
                return responses_1.ResponseHandler.error(res, "ID da reserva é obrigatório", 400);
            }
            const notifications = await notificationService_1.NotificationService.getNotificationsByReservation(parseInt(reservationId));
            return responses_1.ResponseHandler.success(res, notifications, "Notificações da reserva obtidas com sucesso");
        }
        catch (error) {
            console.error("Erro ao obter notificações da reserva:", error);
            return responses_1.ResponseHandler.error(res, "Erro ao obter notificações da reserva", 500);
        }
    }
    static async getNotificationsByType(req, res) {
        try {
            const { type } = req.params;
            if (!type) {
                return responses_1.ResponseHandler.error(res, "Tipo de notificação é obrigatório", 400);
            }
            const notifications = await notificationService_1.NotificationService.getNotificationsByType(type);
            return responses_1.ResponseHandler.success(res, notifications, "Notificações por tipo obtidas com sucesso");
        }
        catch (error) {
            console.error("Erro ao obter notificações por tipo:", error);
            return responses_1.ResponseHandler.error(res, "Erro ao obter notificações por tipo", 500);
        }
    }
    static async sendNotification(req, res) {
        try {
            const { error } = validators_1.sendNotificationSchema.validate(req.body);
            if (error) {
                return responses_1.ResponseHandler.error(res, error.details[0]?.message || "Dados inválidos", 400);
            }
            const { notification_id } = req.body;
            const canSend = await notificationService_1.NotificationService.canSendNotification(notification_id);
            if (!canSend) {
                return responses_1.ResponseHandler.error(res, "Notificação não pode ser enviada", 400);
            }
            const notification = await notificationService_1.NotificationService.sendNotification(notification_id);
            if (!notification) {
                return responses_1.ResponseHandler.error(res, "Notificação não encontrada ou já enviada", 404);
            }
            return responses_1.ResponseHandler.success(res, notification, "Notificação enviada com sucesso");
        }
        catch (error) {
            console.error("Erro ao enviar notificação:", error);
            return responses_1.ResponseHandler.error(res, "Erro ao enviar notificação", 500);
        }
    }
    static async createCheckoutReminder1h(req, res) {
        try {
            const { reservationId } = req.params;
            if (!reservationId) {
                return responses_1.ResponseHandler.error(res, "ID da reserva é obrigatório", 400);
            }
            const notification = await notificationService_1.NotificationService.createCheckoutReminder1h(parseInt(reservationId));
            return responses_1.ResponseHandler.success(res, notification, "Notificação de check-out 1h criada com sucesso", 201);
        }
        catch (error) {
            console.error("Erro ao criar notificação de check-out 1h:", error);
            return responses_1.ResponseHandler.error(res, "Erro ao criar notificação de check-out 1h", 500);
        }
    }
    static async createCheckoutReminder30min(req, res) {
        try {
            const { reservationId } = req.params;
            if (!reservationId) {
                return responses_1.ResponseHandler.error(res, "ID da reserva é obrigatório", 400);
            }
            const notification = await notificationService_1.NotificationService.createCheckoutReminder30min(parseInt(reservationId));
            return responses_1.ResponseHandler.success(res, notification, "Notificação de check-out 30min criada com sucesso", 201);
        }
        catch (error) {
            console.error("Erro ao criar notificação de check-out 30min:", error);
            return responses_1.ResponseHandler.error(res, "Erro ao criar notificação de check-out 30min", 500);
        }
    }
    static async createCheckinReminder(req, res) {
        try {
            const { reservationId } = req.params;
            if (!reservationId) {
                return responses_1.ResponseHandler.error(res, "ID da reserva é obrigatório", 400);
            }
            const notification = await notificationService_1.NotificationService.createCheckinReminder(parseInt(reservationId));
            return responses_1.ResponseHandler.success(res, notification, "Notificação de check-in criada com sucesso", 201);
        }
        catch (error) {
            console.error("Erro ao criar notificação de check-in:", error);
            return responses_1.ResponseHandler.error(res, "Erro ao criar notificação de check-in", 500);
        }
    }
    static async createPaymentReminder(req, res) {
        try {
            const { reservationId } = req.params;
            if (!reservationId) {
                return responses_1.ResponseHandler.error(res, "ID da reserva é obrigatório", 400);
            }
            const notification = await notificationService_1.NotificationService.createPaymentReminder(parseInt(reservationId));
            return responses_1.ResponseHandler.success(res, notification, "Notificação de pagamento criada com sucesso", 201);
        }
        catch (error) {
            console.error("Erro ao criar notificação de pagamento:", error);
            return responses_1.ResponseHandler.error(res, "Erro ao criar notificação de pagamento", 500);
        }
    }
    static async createMinibarConsumptionNotification(req, res) {
        try {
            const { reservationId } = req.params;
            const { totalAmount } = req.body;
            if (!reservationId) {
                return responses_1.ResponseHandler.error(res, "ID da reserva é obrigatório", 400);
            }
            if (!totalAmount || totalAmount <= 0) {
                return responses_1.ResponseHandler.error(res, "Valor total é obrigatório e deve ser positivo", 400);
            }
            const notification = await notificationService_1.NotificationService.createMinibarConsumptionNotification(parseInt(reservationId), totalAmount);
            return responses_1.ResponseHandler.success(res, notification, "Notificação de consumo do minibar criada com sucesso", 201);
        }
        catch (error) {
            console.error("Erro ao criar notificação de consumo do minibar:", error);
            return responses_1.ResponseHandler.error(res, "Erro ao criar notificação de consumo do minibar", 500);
        }
    }
    static async createSystemAlert(req, res) {
        try {
            const { message } = req.body;
            if (!message || message.trim().length === 0) {
                return responses_1.ResponseHandler.error(res, "Mensagem é obrigatória", 400);
            }
            const notification = await notificationService_1.NotificationService.createSystemAlert(message);
            return responses_1.ResponseHandler.success(res, notification, "Alerta do sistema criado com sucesso", 201);
        }
        catch (error) {
            console.error("Erro ao criar alerta do sistema:", error);
            return responses_1.ResponseHandler.error(res, "Erro ao criar alerta do sistema", 500);
        }
    }
    static async processPendingNotifications(req, res) {
        try {
            const result = await notificationService_1.NotificationService.processPendingNotifications();
            return responses_1.ResponseHandler.success(res, result, "Processamento de notificações concluído com sucesso");
        }
        catch (error) {
            console.error("Erro ao processar notificações pendentes:", error);
            return responses_1.ResponseHandler.error(res, "Erro ao processar notificações pendentes", 500);
        }
    }
    static async checkAndCreateAutomaticNotifications(req, res) {
        try {
            await notificationService_1.NotificationService.checkAndCreateAutomaticNotifications();
            return responses_1.ResponseHandler.success(res, null, "Verificação de notificações automáticas concluída com sucesso");
        }
        catch (error) {
            console.error("Erro ao verificar notificações automáticas:", error);
            return responses_1.ResponseHandler.error(res, "Erro ao verificar notificações automáticas", 500);
        }
    }
    static async getNotificationStats(req, res) {
        try {
            const { startDate, endDate } = req.query;
            let start;
            let end;
            if (startDate && endDate) {
                start = new Date(startDate);
                end = new Date(endDate);
            }
            const stats = await notificationService_1.NotificationService.getNotificationStats(start, end);
            return responses_1.ResponseHandler.success(res, stats, "Estatísticas de notificações obtidas com sucesso");
        }
        catch (error) {
            console.error("Erro ao obter estatísticas de notificações:", error);
            return responses_1.ResponseHandler.error(res, "Erro ao obter estatísticas de notificações", 500);
        }
    }
    static async getNotificationsByPeriod(req, res) {
        try {
            const { startDate, endDate } = req.query;
            if (!startDate || !endDate) {
                return responses_1.ResponseHandler.error(res, "Data inicial e final são obrigatórias", 400);
            }
            const notifications = await notificationService_1.NotificationService.getNotificationsByPeriod(new Date(startDate), new Date(endDate));
            return responses_1.ResponseHandler.success(res, notifications, "Notificações do período obtidas com sucesso");
        }
        catch (error) {
            console.error("Erro ao obter notificações por período:", error);
            return responses_1.ResponseHandler.error(res, "Erro ao obter notificações por período", 500);
        }
    }
    static async getAvailableNotificationTypes(req, res) {
        try {
            const types = notificationService_1.NotificationService.getAvailableNotificationTypes();
            return responses_1.ResponseHandler.success(res, types, "Tipos de notificação obtidos com sucesso");
        }
        catch (error) {
            console.error("Erro ao obter tipos de notificação:", error);
            return responses_1.ResponseHandler.error(res, "Erro ao obter tipos de notificação", 500);
        }
    }
}
exports.NotificationController = NotificationController;
//# sourceMappingURL=notificationController.js.map