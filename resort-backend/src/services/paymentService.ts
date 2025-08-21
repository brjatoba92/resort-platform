import pool from "@/database/connection";
import { Payment, PaymentCreate, PaymentUpdate } from "@/types";

export class PaymentService {
    // ========================================
    // GESTÃO DE PAGAMENTOS
    // ========================================

    // Listar todos os pagamentos
    static async getAllPayments(): Promise<Payment[]> {
        const query = `
            SELECT 
                p.id,
                p.reservation_id,
                p.amount,
                p.payment_method,
                p.transaction_id,
                p.status,
                p.processed_by,
                p.processed_at,
                r.total_amount as reservation_total,
                g.name as guest_name,
                rm.number as room_number
            FROM payments p
            LEFT JOIN reservations r ON p.reservation_id = r.id
            LEFT JOIN guests g ON r.guest_id = g.id
            LEFT JOIN rooms rm ON r.room_id = rm.id
            ORDER BY p.processed_at DESC
        `;
        
        const result = await pool.query(query);
        return result.rows;
    }

    // Obter pagamento por ID
    static async getPaymentById(id: number): Promise<Payment | null> {
        const query = `
            SELECT 
                p.id,
                p.reservation_id,
                p.amount,
                p.payment_method,
                p.transaction_id,
                p.status,
                p.processed_by,
                p.processed_at,
                r.total_amount as reservation_total,
                g.name as guest_name,
                rm.number as room_number,
                u.name as processed_by_name
            FROM payments p
            LEFT JOIN reservations r ON p.reservation_id = r.id
            LEFT JOIN guests g ON r.guest_id = g.id
            LEFT JOIN rooms rm ON r.room_id = rm.id
            LEFT JOIN users u ON p.processed_by = u.id
            WHERE p.id = $1
        `;
        
        const result = await pool.query(query, [id]);
        return result.rows[0] || null;
    }

    // Criar novo pagamento
    static async createPayment(paymentData: PaymentCreate): Promise<Payment> {
        const query = `
            INSERT INTO payments (reservation_id, amount, payment_method, transaction_id, processed_by)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING id, reservation_id, amount, payment_method, transaction_id, status, processed_by, processed_at
        `;
        
        const result = await pool.query(query, [
            paymentData.reservation_id,
            paymentData.amount,
            paymentData.payment_method,
            paymentData.transaction_id,
            paymentData.processed_by
        ]);
        
        return result.rows[0];
    }

    // Atualizar pagamento
    static async updatePayment(id: number, paymentData: PaymentUpdate): Promise<Payment | null> {
        const fields = [];
        const values = [];
        let paramCount = 1;

        if (paymentData.amount !== undefined) {
            fields.push(`amount = $${paramCount}`);
            values.push(paymentData.amount);
            paramCount++;
        }

        if (paymentData.payment_method !== undefined) {
            fields.push(`payment_method = $${paramCount}`);
            values.push(paymentData.payment_method);
            paramCount++;
        }

        if (paymentData.transaction_id !== undefined) {
            fields.push(`transaction_id = $${paramCount}`);
            values.push(paymentData.transaction_id);
            paramCount++;
        }

        if (paymentData.status !== undefined) {
            fields.push(`status = $${paramCount}`);
            values.push(paymentData.status);
            paramCount++;
        }

        if (fields.length === 0) {
            return this.getPaymentById(id);
        }

        values.push(id);
        const query = `
            UPDATE payments
            SET ${fields.join(', ')}
            WHERE id = $${paramCount}
            RETURNING id, reservation_id, amount, payment_method, transaction_id, status, processed_by, processed_at
        `;
        
        const result = await pool.query(query, values);
        return result.rows[0] || null;
    }

    // Deletar pagamento
    static async deletePayment(id: number): Promise<boolean> {
        const query = `
            DELETE FROM payments WHERE id = $1
        `;
        
        const result = await pool.query(query, [id]);
        return (result.rowCount || 0) > 0;
    }

    // ========================================
    // GESTÃO DE PAGAMENTOS POR RESERVA
    // ========================================

    // Obter pagamentos por reserva
    static async getPaymentsByReservation(reservationId: number): Promise<Payment[]> {
        const query = `
            SELECT 
                p.id,
                p.reservation_id,
                p.amount,
                p.payment_method,
                p.transaction_id,
                p.status,
                p.processed_by,
                p.processed_at,
                u.name as processed_by_name
            FROM payments p
            LEFT JOIN users u ON p.processed_by = u.id
            WHERE p.reservation_id = $1
            ORDER BY p.processed_at DESC
        `;
        
        const result = await pool.query(query, [reservationId]);
        return result.rows;
    }

    // Obter total pago por reserva
    static async getTotalPaidByReservation(reservationId: number): Promise<number> {
        const query = `
            SELECT COALESCE(SUM(amount), 0) as total_paid
            FROM payments
            WHERE reservation_id = $1 AND status IN ('paid', 'partially_paid')
        `;
        
        const result = await pool.query(query, [reservationId]);
        return parseFloat(result.rows[0].total_paid);
    }

    // Obter saldo pendente por reserva
    static async getPendingBalanceByReservation(reservationId: number): Promise<number> {
        const query = `
            SELECT 
                r.total_amount - COALESCE(SUM(p.amount), 0) as pending_balance
            FROM reservations r
            LEFT JOIN payments p ON r.id = p.reservation_id AND p.status IN ('paid', 'partially_paid')
            WHERE r.id = $1
            GROUP BY r.total_amount
        `;
        
        const result = await pool.query(query, [reservationId]);
        return parseFloat(result.rows[0]?.pending_balance || '0');
    }

    // ========================================
    // PROCESSAMENTO DE PAGAMENTOS
    // ========================================

    // Processar pagamento (marcar como pago)
    static async processPayment(paymentId: number, transactionId?: string): Promise<Payment | null> {
        const client = await pool.connect();
        
        try {
            await client.query('BEGIN');

            // Atualizar status do pagamento
            const updateQuery = `
                UPDATE payments
                SET status = 'paid', transaction_id = COALESCE($2, transaction_id)
                WHERE id = $1 AND status = 'pending'
                RETURNING id, reservation_id, amount, payment_method, transaction_id, status, processed_by, processed_at
            `;
            
            const result = await client.query(updateQuery, [paymentId, transactionId]);
            
            if (result.rows.length === 0) {
                await client.query('ROLLBACK');
                return null;
            }

            const payment = result.rows[0];

            // Verificar se a reserva está totalmente paga
            const totalPaid = await this.getTotalPaidByReservation(payment.reservation_id);
            const reservationQuery = `
                SELECT total_amount FROM reservations WHERE id = $1
            `;
            const reservationResult = await client.query(reservationQuery, [payment.reservation_id]);
            const reservationTotal = parseFloat(reservationResult.rows[0].total_amount);

            // Atualizar status de pagamento da reserva
            let reservationStatus = 'partially_paid';
            if (totalPaid >= reservationTotal) {
                reservationStatus = 'paid';
            }

            await client.query(`
                UPDATE reservations
                SET payment_status = $1
                WHERE id = $2
            `, [reservationStatus, payment.reservation_id]);

            await client.query('COMMIT');
            return payment;

        } catch (error) {
            await client.query('ROLLBACK');
            throw error;
        } finally {
            client.release();
        }
    }

    // Reembolsar pagamento
    static async refundPayment(paymentId: number, reason?: string): Promise<Payment | null> {
        const client = await pool.connect();
        
        try {
            await client.query('BEGIN');

            // Atualizar status do pagamento para reembolsado
            const updateQuery = `
                UPDATE payments
                SET status = 'refunded'
                WHERE id = $1 AND status = 'paid'
                RETURNING id, reservation_id, amount, payment_method, transaction_id, status, processed_by, processed_at
            `;
            
            const result = await client.query(updateQuery, [paymentId]);
            
            if (result.rows.length === 0) {
                await client.query('ROLLBACK');
                return null;
            }

            const payment = result.rows[0];

            // Recalcular status de pagamento da reserva
            const totalPaid = await this.getTotalPaidByReservation(payment.reservation_id);
            const reservationQuery = `
                SELECT total_amount FROM reservations WHERE id = $1
            `;
            const reservationResult = await client.query(reservationQuery, [payment.reservation_id]);
            const reservationTotal = parseFloat(reservationResult.rows[0].total_amount);

            let reservationStatus = 'partially_paid';
            if (totalPaid >= reservationTotal) {
                reservationStatus = 'paid';
            } else if (totalPaid === 0) {
                reservationStatus = 'pending';
            }

            await client.query(`
                UPDATE reservations
                SET payment_status = $1
                WHERE id = $2
            `, [reservationStatus, payment.reservation_id]);

            await client.query('COMMIT');
            return payment;

        } catch (error) {
            await client.query('ROLLBACK');
            throw error;
        } finally {
            client.release();
        }
    }

    // ========================================
    // ESTATÍSTICAS E RELATÓRIOS
    // ========================================

    // Obter estatísticas de pagamentos
    static async getPaymentStats(startDate?: Date, endDate?: Date): Promise<any> {
        let dateFilter = '';
        let params: any[] = [];
        
        if (startDate && endDate) {
            dateFilter = 'WHERE processed_at BETWEEN $1 AND $2';
            params = [startDate, endDate];
        }

        const query = `
            SELECT 
                payment_method,
                status,
                COUNT(*) as count,
                SUM(amount) as total_amount,
                AVG(amount) as average_amount
            FROM payments
            ${dateFilter}
            GROUP BY payment_method, status
            ORDER BY total_amount DESC
        `;
        
        const result = await pool.query(query, params);
        return result.rows;
    }

    // Obter pagamentos por período
    static async getPaymentsByPeriod(startDate: Date, endDate: Date): Promise<Payment[]> {
        const query = `
            SELECT 
                p.id,
                p.reservation_id,
                p.amount,
                p.payment_method,
                p.transaction_id,
                p.status,
                p.processed_by,
                p.processed_at,
                r.total_amount as reservation_total,
                g.name as guest_name,
                rm.number as room_number,
                u.name as processed_by_name
            FROM payments p
            LEFT JOIN reservations r ON p.reservation_id = r.id
            LEFT JOIN guests g ON r.guest_id = g.id
            LEFT JOIN rooms rm ON r.room_id = rm.id
            LEFT JOIN users u ON p.processed_by = u.id
            WHERE p.processed_at BETWEEN $1 AND $2
            ORDER BY p.processed_at DESC
        `;
        
        const result = await pool.query(query, [startDate, endDate]);
        return result.rows;
    }

    // Obter pagamentos por método
    static async getPaymentsByMethod(method: string, startDate?: Date, endDate?: Date): Promise<Payment[]> {
        let dateFilter = '';
        let params: any[] = [method];
        
        if (startDate && endDate) {
            dateFilter = 'AND processed_at BETWEEN $2 AND $3';
            params = [method, startDate, endDate];
        }

        const query = `
            SELECT 
                p.id,
                p.reservation_id,
                p.amount,
                p.payment_method,
                p.transaction_id,
                p.status,
                p.processed_by,
                p.processed_at,
                r.total_amount as reservation_total,
                g.name as guest_name,
                rm.number as room_number,
                u.name as processed_by_name
            FROM payments p
            LEFT JOIN reservations r ON p.reservation_id = r.id
            LEFT JOIN guests g ON r.guest_id = g.id
            LEFT JOIN rooms rm ON r.room_id = rm.id
            LEFT JOIN users u ON p.processed_by = u.id
            WHERE p.payment_method = $1 ${dateFilter}
            ORDER BY p.processed_at DESC
        `;
        
        const result = await pool.query(query, params);
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

    // Verificar se pagamento pode ser processado
    static async canProcessPayment(paymentId: number): Promise<boolean> {
        const query = `
            SELECT status FROM payments WHERE id = $1
        `;
        
        const result = await pool.query(query, [paymentId]);
        return result.rows.length > 0 && result.rows[0].status === 'pending';
    }

    // Verificar se pagamento pode ser reembolsado
    static async canRefundPayment(paymentId: number): Promise<boolean> {
        const query = `
            SELECT status FROM payments WHERE id = $1
        `;
        
        const result = await pool.query(query, [paymentId]);
        return result.rows.length > 0 && result.rows[0].status === 'paid';
    }

    // Obter métodos de pagamento disponíveis
    static getAvailablePaymentMethods(): any[] {
        return [
            { id: 'credit_card', name: 'Cartão de Crédito', description: 'Pagamento com cartão de crédito' },
            { id: 'debit_card', name: 'Cartão de Débito', description: 'Pagamento com cartão de débito' },
            { id: 'pix', name: 'PIX', description: 'Pagamento instantâneo via PIX' },
            { id: 'cash', name: 'Dinheiro', description: 'Pagamento em dinheiro' },
            { id: 'bank_transfer', name: 'Transferência Bancária', description: 'Transferência entre contas' },
            { id: 'check', name: 'Cheque', description: 'Pagamento via cheque' }
        ];
    }
}
