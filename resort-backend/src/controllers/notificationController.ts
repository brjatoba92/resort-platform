import { Request, Response } from "express";
import { NotificationService } from "@/services/notificationService";
import { ResponseHandler } from "@/utils/responses";
import { AuthRequest } from "@/middleware/auth";
import { 
    createNotificationSchema, 
    updateNotificationSchema, 
    sendNotificationSchema 
} from "@/utils/validators";

export class NotificationController {
    // ========================================
    // GESTÃO DE NOTIFICAÇÕES
    // ========================================

    // Listar todas as notificações
    static async getAllNotifications(req: Request, res: Response) {
        try {
            const notifications = await NotificationService.getAllNotifications();
            return ResponseHandler.success(res, notifications, "Notificações listadas com sucesso");
        } catch (error) {
            console.error("Erro ao listar notificações:", error);
            return ResponseHandler.error(res, "Erro ao listar notificações", 500);
        }
    }

    // Obter notificação por ID
    static async getNotificationById(req: Request, res: Response) {
        try {
            const { id } = req.params;
            if (!id) {
                return ResponseHandler.error(res, "ID da notificação é obrigatório", 400);
            }
            
            const notification = await NotificationService.getNotificationById(parseInt(id));
            
            if (!notification) {
                return ResponseHandler.error(res, "Notificação não encontrada", 404);
            }
            
            return ResponseHandler.success(res, notification, "Notificação encontrada com sucesso");
        } catch (error) {
            console.error("Erro ao obter notificação:", error);
            return ResponseHandler.error(res, "Erro ao obter notificação", 500);
        }
    }

    // Criar nova notificação
    static async createNotification(req: AuthRequest, res: Response) {
        try {
            const { error } = createNotificationSchema.validate(req.body);
            if (error) {
                return ResponseHandler.error(res, error.details[0]?.message || "Dados inválidos", 400);
            }

            // Verificar se a reserva existe e está ativa (exceto para system_alert)
            if (req.body.type !== 'system_alert') {
                const isValidReservation = await NotificationService.validateReservation(req.body.reservation_id);
                if (!isValidReservation) {
                    return ResponseHandler.error(res, "Reserva não encontrada ou não está ativa", 400);
                }
            }

            const notification = await NotificationService.createNotification(req.body);
            return ResponseHandler.success(res, notification, "Notificação criada com sucesso", 201);
        } catch (error) {
            console.error("Erro ao criar notificação:", error);
            return ResponseHandler.error(res, "Erro ao criar notificação", 500);
        }
    }

    // Atualizar notificação
    static async updateNotification(req: Request, res: Response) {
        try {
            const { id } = req.params;
            if (!id) {
                return ResponseHandler.error(res, "ID da notificação é obrigatório", 400);
            }
            
            const { error } = updateNotificationSchema.validate(req.body);
            
            if (error) {
                return ResponseHandler.error(res, error.details[0]?.message || "Dados inválidos", 400);
            }

            const notification = await NotificationService.updateNotification(parseInt(id), req.body);
            
            if (!notification) {
                return ResponseHandler.error(res, "Notificação não encontrada", 404);
            }
            
            return ResponseHandler.success(res, notification, "Notificação atualizada com sucesso");
        } catch (error) {
            console.error("Erro ao atualizar notificação:", error);
            return ResponseHandler.error(res, "Erro ao atualizar notificação", 500);
        }
    }

    // Deletar notificação
    static async deleteNotification(req: Request, res: Response) {
        try {
            const { id } = req.params;
            if (!id) {
                return ResponseHandler.error(res, "ID da notificação é obrigatório", 400);
            }
            
            const deleted = await NotificationService.deleteNotification(parseInt(id));
            
            if (!deleted) {
                return ResponseHandler.error(res, "Notificação não encontrada", 404);
            }
            
            return ResponseHandler.success(res, null, "Notificação deletada com sucesso");
        } catch (error) {
            console.error("Erro ao deletar notificação:", error);
            return ResponseHandler.error(res, "Erro ao deletar notificação", 500);
        }
    }

    // ========================================
    // GESTÃO DE NOTIFICAÇÕES POR RESERVA
    // ========================================

    // Obter notificações por reserva
    static async getNotificationsByReservation(req: Request, res: Response) {
        try {
            const { reservationId } = req.params;
            if (!reservationId) {
                return ResponseHandler.error(res, "ID da reserva é obrigatório", 400);
            }
            
            const notifications = await NotificationService.getNotificationsByReservation(parseInt(reservationId));
            return ResponseHandler.success(res, notifications, "Notificações da reserva obtidas com sucesso");
        } catch (error) {
            console.error("Erro ao obter notificações da reserva:", error);
            return ResponseHandler.error(res, "Erro ao obter notificações da reserva", 500);
        }
    }

    // Obter notificações por tipo
    static async getNotificationsByType(req: Request, res: Response) {
        try {
            const { type } = req.params;
            if (!type) {
                return ResponseHandler.error(res, "Tipo de notificação é obrigatório", 400);
            }
            
            const notifications = await NotificationService.getNotificationsByType(type);
            return ResponseHandler.success(res, notifications, "Notificações por tipo obtidas com sucesso");
        } catch (error) {
            console.error("Erro ao obter notificações por tipo:", error);
            return ResponseHandler.error(res, "Erro ao obter notificações por tipo", 500);
        }
    }

    // ========================================
    // ENVIO DE NOTIFICAÇÕES
    // ========================================

    // Enviar notificação
    static async sendNotification(req: Request, res: Response) {
        try {
            const { error } = sendNotificationSchema.validate(req.body);
            if (error) {
                return ResponseHandler.error(res, error.details[0]?.message || "Dados inválidos", 400);
            }

            const { notification_id } = req.body;

            // Verificar se a notificação pode ser enviada
            const canSend = await NotificationService.canSendNotification(notification_id);
            if (!canSend) {
                return ResponseHandler.error(res, "Notificação não pode ser enviada", 400);
            }

            const notification = await NotificationService.sendNotification(notification_id);
            
            if (!notification) {
                return ResponseHandler.error(res, "Notificação não encontrada ou já enviada", 404);
            }
            
            return ResponseHandler.success(res, notification, "Notificação enviada com sucesso");
        } catch (error) {
            console.error("Erro ao enviar notificação:", error);
            return ResponseHandler.error(res, "Erro ao enviar notificação", 500);
        }
    }

    // ========================================
    // NOTIFICAÇÕES AUTOMÁTICAS
    // ========================================

    // Criar notificação de check-out (1 hora antes)
    static async createCheckoutReminder1h(req: Request, res: Response) {
        try {
            const { reservationId } = req.params;
            if (!reservationId) {
                return ResponseHandler.error(res, "ID da reserva é obrigatório", 400);
            }
            
            const notification = await NotificationService.createCheckoutReminder1h(parseInt(reservationId));
            return ResponseHandler.success(res, notification, "Notificação de check-out 1h criada com sucesso", 201);
        } catch (error) {
            console.error("Erro ao criar notificação de check-out 1h:", error);
            return ResponseHandler.error(res, "Erro ao criar notificação de check-out 1h", 500);
        }
    }

    // Criar notificação de check-out (30 minutos antes)
    static async createCheckoutReminder30min(req: Request, res: Response) {
        try {
            const { reservationId } = req.params;
            if (!reservationId) {
                return ResponseHandler.error(res, "ID da reserva é obrigatório", 400);
            }
            
            const notification = await NotificationService.createCheckoutReminder30min(parseInt(reservationId));
            return ResponseHandler.success(res, notification, "Notificação de check-out 30min criada com sucesso", 201);
        } catch (error) {
            console.error("Erro ao criar notificação de check-out 30min:", error);
            return ResponseHandler.error(res, "Erro ao criar notificação de check-out 30min", 500);
        }
    }

    // Criar notificação de check-in
    static async createCheckinReminder(req: Request, res: Response) {
        try {
            const { reservationId } = req.params;
            if (!reservationId) {
                return ResponseHandler.error(res, "ID da reserva é obrigatório", 400);
            }
            
            const notification = await NotificationService.createCheckinReminder(parseInt(reservationId));
            return ResponseHandler.success(res, notification, "Notificação de check-in criada com sucesso", 201);
        } catch (error) {
            console.error("Erro ao criar notificação de check-in:", error);
            return ResponseHandler.error(res, "Erro ao criar notificação de check-in", 500);
        }
    }

    // Criar notificação de pagamento pendente
    static async createPaymentReminder(req: Request, res: Response) {
        try {
            const { reservationId } = req.params;
            if (!reservationId) {
                return ResponseHandler.error(res, "ID da reserva é obrigatório", 400);
            }
            
            const notification = await NotificationService.createPaymentReminder(parseInt(reservationId));
            return ResponseHandler.success(res, notification, "Notificação de pagamento criada com sucesso", 201);
        } catch (error) {
            console.error("Erro ao criar notificação de pagamento:", error);
            return ResponseHandler.error(res, "Erro ao criar notificação de pagamento", 500);
        }
    }

    // Criar notificação de consumo do minibar
    static async createMinibarConsumptionNotification(req: Request, res: Response) {
        try {
            const { reservationId } = req.params;
            const { totalAmount } = req.body;
            
            if (!reservationId) {
                return ResponseHandler.error(res, "ID da reserva é obrigatório", 400);
            }
            
            if (!totalAmount || totalAmount <= 0) {
                return ResponseHandler.error(res, "Valor total é obrigatório e deve ser positivo", 400);
            }
            
            const notification = await NotificationService.createMinibarConsumptionNotification(parseInt(reservationId), totalAmount);
            return ResponseHandler.success(res, notification, "Notificação de consumo do minibar criada com sucesso", 201);
        } catch (error) {
            console.error("Erro ao criar notificação de consumo do minibar:", error);
            return ResponseHandler.error(res, "Erro ao criar notificação de consumo do minibar", 500);
        }
    }

    // Criar notificação de sistema
    static async createSystemAlert(req: Request, res: Response) {
        try {
            const { message } = req.body;
            
            if (!message || message.trim().length === 0) {
                return ResponseHandler.error(res, "Mensagem é obrigatória", 400);
            }
            
            const notification = await NotificationService.createSystemAlert(message);
            return ResponseHandler.success(res, notification, "Alerta do sistema criado com sucesso", 201);
        } catch (error) {
            console.error("Erro ao criar alerta do sistema:", error);
            return ResponseHandler.error(res, "Erro ao criar alerta do sistema", 500);
        }
    }

    // ========================================
    // PROCESSAMENTO AUTOMÁTICO
    // ========================================

    // Processar notificações pendentes
    static async processPendingNotifications(req: Request, res: Response) {
        try {
            const result = await NotificationService.processPendingNotifications();
            return ResponseHandler.success(res, result, "Processamento de notificações concluído com sucesso");
        } catch (error) {
            console.error("Erro ao processar notificações pendentes:", error);
            return ResponseHandler.error(res, "Erro ao processar notificações pendentes", 500);
        }
    }

    // Verificar e criar notificações automáticas
    static async checkAndCreateAutomaticNotifications(req: Request, res: Response) {
        try {
            await NotificationService.checkAndCreateAutomaticNotifications();
            return ResponseHandler.success(res, null, "Verificação de notificações automáticas concluída com sucesso");
        } catch (error) {
            console.error("Erro ao verificar notificações automáticas:", error);
            return ResponseHandler.error(res, "Erro ao verificar notificações automáticas", 500);
        }
    }

    // ========================================
    // ESTATÍSTICAS E RELATÓRIOS
    // ========================================

    // Obter estatísticas de notificações
    static async getNotificationStats(req: Request, res: Response) {
        try {
            const { startDate, endDate } = req.query;
            
            let start: Date | undefined;
            let end: Date | undefined;
            
            if (startDate && endDate) {
                start = new Date(startDate as string);
                end = new Date(endDate as string);
            }

            const stats = await NotificationService.getNotificationStats(start, end);
            return ResponseHandler.success(res, stats, "Estatísticas de notificações obtidas com sucesso");
        } catch (error) {
            console.error("Erro ao obter estatísticas de notificações:", error);
            return ResponseHandler.error(res, "Erro ao obter estatísticas de notificações", 500);
        }
    }

    // Obter notificações por período
    static async getNotificationsByPeriod(req: Request, res: Response) {
        try {
            const { startDate, endDate } = req.query;
            
            if (!startDate || !endDate) {
                return ResponseHandler.error(res, "Data inicial e final são obrigatórias", 400);
            }

            const notifications = await NotificationService.getNotificationsByPeriod(
                new Date(startDate as string),
                new Date(endDate as string)
            );
            
            return ResponseHandler.success(res, notifications, "Notificações do período obtidas com sucesso");
        } catch (error) {
            console.error("Erro ao obter notificações por período:", error);
            return ResponseHandler.error(res, "Erro ao obter notificações por período", 500);
        }
    }

    // ========================================
    // UTILITÁRIOS
    // ========================================

    // Obter tipos de notificação disponíveis
    static async getAvailableNotificationTypes(req: Request, res: Response) {
        try {
            const types = NotificationService.getAvailableNotificationTypes();
            return ResponseHandler.success(res, types, "Tipos de notificação obtidos com sucesso");
        } catch (error) {
            console.error("Erro ao obter tipos de notificação:", error);
            return ResponseHandler.error(res, "Erro ao obter tipos de notificação", 500);
        }
    }
}
