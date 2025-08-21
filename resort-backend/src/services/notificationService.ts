import pool from "@/database/connection";
import { Notification, NotificationCreate, NotificationUpdate } from "@/types";

export class NotificationService {
    // ========================================
    // GESTÃO DE NOTIFICAÇÕES
    // ========================================

    // Listar todas as notificações
    static async getAllNotifications(): Promise<Notification[]> {
        const query = `
            SELECT 
                n.id,
                n.reservation_id,
                n.type,
                n.message,
                n.sent_at,
                n.status,
                n.created_at,
                r.check_in_date,
                r.check_out_date,
                g.name as guest_name,
                g.email as guest_email,
                rm.number as room_number
            FROM notifications n
            LEFT JOIN reservations r ON n.reservation_id = r.id
            LEFT JOIN guests g ON r.guest_id = g.id
            LEFT JOIN rooms rm ON r.room_id = rm.id
            ORDER BY n.created_at DESC
        `;
        
        const result = await pool.query(query);
        return result.rows;
    }

    // Obter notificação por ID
    static async getNotificationById(id: number): Promise<Notification | null> {
        const query = `
            SELECT 
                n.id,
                n.reservation_id,
                n.type,
                n.message,
                n.sent_at,
                n.status,
                n.created_at,
                r.check_in_date,
                r.check_out_date,
                g.name as guest_name,
                g.email as guest_email,
                rm.number as room_number
            FROM notifications n
            LEFT JOIN reservations r ON n.reservation_id = r.id
            LEFT JOIN guests g ON r.guest_id = g.id
            LEFT JOIN rooms rm ON r.room_id = rm.id
            WHERE n.id = $1
        `;
        
        const result = await pool.query(query, [id]);
        return result.rows[0] || null;
    }

    // Criar nova notificação
    static async createNotification(notificationData: NotificationCreate): Promise<Notification> {
        const query = `
            INSERT INTO notifications (reservation_id, type, message)
            VALUES ($1, $2, $3)
            RETURNING id, reservation_id, type, message, sent_at, status, created_at
        `;
        
        const result = await pool.query(query, [
            notificationData.reservation_id,
            notificationData.type,
            notificationData.message
        ]);
        
        return result.rows[0];
    }

    // Atualizar notificação
    static async updateNotification(id: number, notificationData: NotificationUpdate): Promise<Notification | null> {
        const fields = [];
        const values = [];
        let paramCount = 1;

        if (notificationData.sent_at !== undefined) {
            fields.push(`sent_at = $${paramCount}`);
            values.push(notificationData.sent_at);
            paramCount++;
        }

        if (notificationData.status !== undefined) {
            fields.push(`status = $${paramCount}`);
            values.push(notificationData.status);
            paramCount++;
        }

        if (fields.length === 0) {
            return this.getNotificationById(id);
        }

        values.push(id);
        const query = `
            UPDATE notifications
            SET ${fields.join(', ')}
            WHERE id = $${paramCount}
            RETURNING id, reservation_id, type, message, sent_at, status, created_at
        `;
        
        const result = await pool.query(query, values);
        return result.rows[0] || null;
    }

    // Deletar notificação
    static async deleteNotification(id: number): Promise<boolean> {
        const query = `
            DELETE FROM notifications WHERE id = $1
        `;
        
        const result = await pool.query(query, [id]);
        return (result.rowCount || 0) > 0;
    }

    // ========================================
    // GESTÃO DE NOTIFICAÇÕES POR RESERVA
    // ========================================

    // Obter notificações por reserva
    static async getNotificationsByReservation(reservationId: number): Promise<Notification[]> {
        const query = `
            SELECT 
                n.id,
                n.reservation_id,
                n.type,
                n.message,
                n.sent_at,
                n.status,
                n.created_at,
                g.name as guest_name,
                g.email as guest_email,
                rm.number as room_number
            FROM notifications n
            LEFT JOIN reservations r ON n.reservation_id = r.id
            LEFT JOIN guests g ON r.guest_id = g.id
            LEFT JOIN rooms rm ON r.room_id = rm.id
            WHERE n.reservation_id = $1
            ORDER BY n.created_at DESC
        `;
        
        const result = await pool.query(query, [reservationId]);
        return result.rows;
    }

    // Obter notificações por tipo
    static async getNotificationsByType(type: string): Promise<Notification[]> {
        const query = `
            SELECT 
                n.id,
                n.reservation_id,
                n.type,
                n.message,
                n.sent_at,
                n.status,
                n.created_at,
                g.name as guest_name,
                g.email as guest_email,
                rm.number as room_number
            FROM notifications n
            LEFT JOIN reservations r ON n.reservation_id = r.id
            LEFT JOIN guests g ON r.guest_id = g.id
            LEFT JOIN rooms rm ON r.room_id = rm.id
            WHERE n.type = $1
            ORDER BY n.created_at DESC
        `;
        
        const result = await pool.query(query, [type]);
        return result.rows;
    }

    // ========================================
    // ENVIO DE NOTIFICAÇÕES
    // ========================================

    // Enviar notificação
    static async sendNotification(notificationId: number): Promise<Notification | null> {
        const client = await pool.connect();
        
        try {
            await client.query('BEGIN');

            // Obter dados da notificação
            const notificationQuery = `
                SELECT 
                    n.id,
                    n.reservation_id,
                    n.type,
                    n.message,
                    n.status,
                    g.name as guest_name,
                    g.email as guest_email,
                    g.phone as guest_phone,
                    rm.number as room_number
                FROM notifications n
                LEFT JOIN reservations r ON n.reservation_id = r.id
                LEFT JOIN guests g ON r.guest_id = g.id
                LEFT JOIN rooms rm ON r.room_id = rm.id
                WHERE n.id = $1 AND n.status = 'pending'
            `;
            
            const notificationResult = await client.query(notificationQuery, [notificationId]);
            
            if (notificationResult.rows.length === 0) {
                await client.query('ROLLBACK');
                return null;
            }

            const notification = notificationResult.rows[0];

            // Simular envio de notificação (em produção, integrar com serviço de email/SMS)
            const success = await this.simulateSendNotification(notification);

            // Atualizar status da notificação
            const updateQuery = `
                UPDATE notifications
                SET status = $1, sent_at = NOW()
                WHERE id = $2
                RETURNING id, reservation_id, type, message, sent_at, status, created_at
            `;
            
            const status = success ? 'sent' : 'failed';
            const result = await client.query(updateQuery, [status, notificationId]);

            await client.query('COMMIT');
            return result.rows[0] || null;

        } catch (error) {
            await client.query('ROLLBACK');
            throw error;
        } finally {
            client.release();
        }
    }

    // Simular envio de notificação (mock)
    private static async simulateSendNotification(notification: any): Promise<boolean> {
        // Simular delay de envio
        await new Promise(resolve => setTimeout(resolve, 100));
        
        // Simular sucesso (90% das vezes)
        return Math.random() > 0.1;
    }

    // ========================================
    // NOTIFICAÇÕES AUTOMÁTICAS
    // ========================================

    // Criar notificação de check-out (1 hora antes)
    static async createCheckoutReminder1h(reservationId: number): Promise<Notification> {
        const message = "Lembrete: Seu check-out está programado para daqui a 1 hora. Por favor, prepare-se para deixar o quarto.";
        return this.createNotification({
            reservation_id: reservationId,
            type: 'checkout_1h',
            message
        });
    }

    // Criar notificação de check-out (30 minutos antes)
    static async createCheckoutReminder30min(reservationId: number): Promise<Notification> {
        const message = "Lembrete: Seu check-out está programado para daqui a 30 minutos. Por favor, finalize sua estadia.";
        return this.createNotification({
            reservation_id: reservationId,
            type: 'checkout_30min',
            message
        });
    }

    // Criar notificação de check-in
    static async createCheckinReminder(reservationId: number): Promise<Notification> {
        const message = "Bem-vindo! Seu check-in está confirmado. Apresente-se na recepção para finalizar o processo.";
        return this.createNotification({
            reservation_id: reservationId,
            type: 'checkin_reminder',
            message
        });
    }

    // Criar notificação de pagamento pendente
    static async createPaymentReminder(reservationId: number): Promise<Notification> {
        const message = "Lembrete: Você possui pagamentos pendentes. Entre em contato com a recepção para regularizar sua situação.";
        return this.createNotification({
            reservation_id: reservationId,
            type: 'payment_reminder',
            message
        });
    }

    // Criar notificação de consumo do minibar
    static async createMinibarConsumptionNotification(reservationId: number, totalAmount: number): Promise<Notification> {
        const message = `Consumo do minibar registrado: R$ ${totalAmount.toFixed(2)}. Este valor será adicionado à sua conta.`;
        return this.createNotification({
            reservation_id: reservationId,
            type: 'minibar_consumption',
            message
        });
    }

    // Criar notificação de sistema
    static async createSystemAlert(message: string): Promise<Notification> {
        // Para alertas de sistema, usar reservation_id = 0 (não associado a reserva específica)
        return this.createNotification({
            reservation_id: 0,
            type: 'system_alert',
            message
        });
    }

    // ========================================
    // PROCESSAMENTO AUTOMÁTICO
    // ========================================

    // Processar notificações pendentes
    static async processPendingNotifications(): Promise<{ success: number; failed: number }> {
        const query = `
            SELECT id FROM notifications 
            WHERE status = 'pending' 
            ORDER BY created_at ASC
        `;
        
        const result = await pool.query(query);
        const notifications = result.rows;
        
        let success = 0;
        let failed = 0;

        for (const notification of notifications) {
            try {
                const sent = await this.sendNotification(notification.id);
                if (sent && sent.status === 'sent') {
                    success++;
                } else {
                    failed++;
                }
            } catch (error) {
                console.error(`Erro ao processar notificação ${notification.id}:`, error);
                failed++;
            }
        }

        return { success, failed };
    }

    // Verificar e criar notificações automáticas
    static async checkAndCreateAutomaticNotifications(): Promise<void> {
        const client = await pool.connect();
        
        try {
            // Verificar check-outs próximos (1 hora)
            const checkout1hQuery = `
                SELECT id FROM reservations 
                WHERE check_out_date = CURRENT_DATE 
                AND EXTRACT(HOUR FROM check_out_date) = EXTRACT(HOUR FROM NOW()) + 1
                AND status IN ('confirmed', 'checked_in')
                AND id NOT IN (
                    SELECT reservation_id FROM notifications 
                    WHERE type = 'checkout_1h' AND DATE(created_at) = CURRENT_DATE
                )
            `;
            
            const checkout1hResult = await client.query(checkout1hQuery);
            for (const reservation of checkout1hResult.rows) {
                await this.createCheckoutReminder1h(reservation.id);
            }

            // Verificar check-outs próximos (30 minutos)
            const checkout30minQuery = `
                SELECT id FROM reservations 
                WHERE check_out_date = CURRENT_DATE 
                AND EXTRACT(HOUR FROM check_out_date) = EXTRACT(HOUR FROM NOW()) + 0.5
                AND status IN ('confirmed', 'checked_in')
                AND id NOT IN (
                    SELECT reservation_id FROM notifications 
                    WHERE type = 'checkout_30min' AND DATE(created_at) = CURRENT_DATE
                )
            `;
            
            const checkout30minResult = await client.query(checkout30minQuery);
            for (const reservation of checkout30minResult.rows) {
                await this.createCheckoutReminder30min(reservation.id);
            }

            // Verificar pagamentos pendentes
            const paymentReminderQuery = `
                SELECT DISTINCT r.id FROM reservations r
                WHERE r.payment_status = 'pending'
                AND r.check_out_date <= CURRENT_DATE + INTERVAL '1 day'
                AND r.id NOT IN (
                    SELECT reservation_id FROM notifications 
                    WHERE type = 'payment_reminder' AND DATE(created_at) = CURRENT_DATE
                )
            `;
            
            const paymentReminderResult = await client.query(paymentReminderQuery);
            for (const reservation of paymentReminderResult.rows) {
                await this.createPaymentReminder(reservation.id);
            }

        } catch (error) {
            console.error('Erro ao verificar notificações automáticas:', error);
        } finally {
            client.release();
        }
    }

    // ========================================
    // ESTATÍSTICAS E RELATÓRIOS
    // ========================================

    // Obter estatísticas de notificações
    static async getNotificationStats(startDate?: Date, endDate?: Date): Promise<any> {
        let dateFilter = '';
        let params: any[] = [];
        
        if (startDate && endDate) {
            dateFilter = 'WHERE created_at BETWEEN $1 AND $2';
            params = [startDate, endDate];
        }

        const query = `
            SELECT 
                type,
                status,
                COUNT(*) as count,
                COUNT(CASE WHEN status = 'sent' THEN 1 END) as sent_count,
                COUNT(CASE WHEN status = 'failed' THEN 1 END) as failed_count
            FROM notifications
            ${dateFilter}
            GROUP BY type, status
            ORDER BY count DESC
        `;
        
        const result = await pool.query(query, params);
        return result.rows;
    }

    // Obter notificações por período
    static async getNotificationsByPeriod(startDate: Date, endDate: Date): Promise<Notification[]> {
        const query = `
            SELECT 
                n.id,
                n.reservation_id,
                n.type,
                n.message,
                n.sent_at,
                n.status,
                n.created_at,
                g.name as guest_name,
                g.email as guest_email,
                rm.number as room_number
            FROM notifications n
            LEFT JOIN reservations r ON n.reservation_id = r.id
            LEFT JOIN guests g ON r.guest_id = g.id
            LEFT JOIN rooms rm ON r.room_id = rm.id
            WHERE n.created_at BETWEEN $1 AND $2
            ORDER BY n.created_at DESC
        `;
        
        const result = await pool.query(query, [startDate, endDate]);
        return result.rows;
    }

    // ========================================
    // VALIDAÇÕES
    // ========================================

    // Verificar se reserva existe e está ativa
    static async validateReservation(reservationId: number): Promise<boolean> {
        const query = `
            SELECT id FROM reservations 
            WHERE id = $1 AND status IN ('confirmed', 'checked_in')
        `;
        
        const result = await pool.query(query, [reservationId]);
        return result.rows.length > 0;
    }

    // Verificar se notificação pode ser enviada
    static async canSendNotification(notificationId: number): Promise<boolean> {
        const query = `
            SELECT status FROM notifications WHERE id = $1
        `;
        
        const result = await pool.query(query, [notificationId]);
        return result.rows.length > 0 && result.rows[0].status === 'pending';
    }

    // Obter tipos de notificação disponíveis
    static getAvailableNotificationTypes(): any[] {
        return [
            { id: 'checkout_1h', name: 'Check-out 1h antes', description: 'Lembrete 1 hora antes do check-out' },
            { id: 'checkout_30min', name: 'Check-out 30min antes', description: 'Lembrete 30 minutos antes do check-out' },
            { id: 'checkin_reminder', name: 'Lembrete de Check-in', description: 'Confirmação de check-in' },
            { id: 'payment_reminder', name: 'Lembrete de Pagamento', description: 'Pagamentos pendentes' },
            { id: 'minibar_consumption', name: 'Consumo Minibar', description: 'Registro de consumo do minibar' },
            { id: 'system_alert', name: 'Alerta do Sistema', description: 'Notificações do sistema' }
        ];
    }
}
