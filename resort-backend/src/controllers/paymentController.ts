import { Request, Response } from "express";
import { PaymentService } from "@/services/paymentService";
import { ResponseHandler } from "@/utils/responses";
import { AuthRequest } from "@/middleware/auth";
import { 
    createPaymentSchema, 
    updatePaymentSchema, 
    processPaymentSchema 
} from "@/utils/validators";

export class PaymentController {
    // ========================================
    // GESTÃO DE PAGAMENTOS
    // ========================================

    // Listar todos os pagamentos
    static async getAllPayments(req: Request, res: Response) {
        try {
            const payments = await PaymentService.getAllPayments();
            return ResponseHandler.success(res, payments, "Pagamentos listados com sucesso");
        } catch (error) {
            console.error("Erro ao listar pagamentos:", error);
            return ResponseHandler.error(res, "Erro ao listar pagamentos", 500);
        }
    }

    // Obter pagamento por ID
    static async getPaymentById(req: Request, res: Response) {
        try {
            const { id } = req.params;
            if (!id) {
                return ResponseHandler.error(res, "ID do pagamento é obrigatório", 400);
            }
            
            const payment = await PaymentService.getPaymentById(parseInt(id));
            
            if (!payment) {
                return ResponseHandler.error(res, "Pagamento não encontrado", 404);
            }
            
            return ResponseHandler.success(res, payment, "Pagamento encontrado com sucesso");
        } catch (error) {
            console.error("Erro ao obter pagamento:", error);
            return ResponseHandler.error(res, "Erro ao obter pagamento", 500);
        }
    }

    // Criar novo pagamento
    static async createPayment(req: AuthRequest, res: Response) {
        try {
            const { error } = createPaymentSchema.validate(req.body);
            if (error) {
                return ResponseHandler.error(res, error.details[0]?.message || "Dados inválidos", 400);
            }

            // Verificar se a reserva existe e está ativa
            const isValidReservation = await PaymentService.validateReservation(req.body.reservation_id);
            if (!isValidReservation) {
                return ResponseHandler.error(res, "Reserva não encontrada ou não está ativa", 400);
            }

            const paymentData = {
                ...req.body,
                processed_by: req.user!.userId
            };

            const payment = await PaymentService.createPayment(paymentData);
            return ResponseHandler.success(res, payment, "Pagamento criado com sucesso", 201);
        } catch (error) {
            console.error("Erro ao criar pagamento:", error);
            return ResponseHandler.error(res, "Erro ao criar pagamento", 500);
        }
    }

    // Atualizar pagamento
    static async updatePayment(req: Request, res: Response) {
        try {
            const { id } = req.params;
            if (!id) {
                return ResponseHandler.error(res, "ID do pagamento é obrigatório", 400);
            }
            
            const { error } = updatePaymentSchema.validate(req.body);
            
            if (error) {
                return ResponseHandler.error(res, error.details[0]?.message || "Dados inválidos", 400);
            }

            const payment = await PaymentService.updatePayment(parseInt(id), req.body);
            
            if (!payment) {
                return ResponseHandler.error(res, "Pagamento não encontrado", 404);
            }
            
            return ResponseHandler.success(res, payment, "Pagamento atualizado com sucesso");
        } catch (error) {
            console.error("Erro ao atualizar pagamento:", error);
            return ResponseHandler.error(res, "Erro ao atualizar pagamento", 500);
        }
    }

    // Deletar pagamento
    static async deletePayment(req: Request, res: Response) {
        try {
            const { id } = req.params;
            if (!id) {
                return ResponseHandler.error(res, "ID do pagamento é obrigatório", 400);
            }
            
            const deleted = await PaymentService.deletePayment(parseInt(id));
            
            if (!deleted) {
                return ResponseHandler.error(res, "Pagamento não encontrado", 404);
            }
            
            return ResponseHandler.success(res, null, "Pagamento deletado com sucesso");
        } catch (error) {
            console.error("Erro ao deletar pagamento:", error);
            return ResponseHandler.error(res, "Erro ao deletar pagamento", 500);
        }
    }

    // ========================================
    // GESTÃO DE PAGAMENTOS POR RESERVA
    // ========================================

    // Obter pagamentos por reserva
    static async getPaymentsByReservation(req: Request, res: Response) {
        try {
            const { reservationId } = req.params;
            if (!reservationId) {
                return ResponseHandler.error(res, "ID da reserva é obrigatório", 400);
            }
            
            const payments = await PaymentService.getPaymentsByReservation(parseInt(reservationId));
            return ResponseHandler.success(res, payments, "Pagamentos da reserva obtidos com sucesso");
        } catch (error) {
            console.error("Erro ao obter pagamentos da reserva:", error);
            return ResponseHandler.error(res, "Erro ao obter pagamentos da reserva", 500);
        }
    }

    // Obter total pago por reserva
    static async getTotalPaidByReservation(req: Request, res: Response) {
        try {
            const { reservationId } = req.params;
            if (!reservationId) {
                return ResponseHandler.error(res, "ID da reserva é obrigatório", 400);
            }
            
            const totalPaid = await PaymentService.getTotalPaidByReservation(parseInt(reservationId));
            return ResponseHandler.success(res, { total_paid: totalPaid }, "Total pago obtido com sucesso");
        } catch (error) {
            console.error("Erro ao obter total pago:", error);
            return ResponseHandler.error(res, "Erro ao obter total pago", 500);
        }
    }

    // Obter saldo pendente por reserva
    static async getPendingBalanceByReservation(req: Request, res: Response) {
        try {
            const { reservationId } = req.params;
            if (!reservationId) {
                return ResponseHandler.error(res, "ID da reserva é obrigatório", 400);
            }
            
            const pendingBalance = await PaymentService.getPendingBalanceByReservation(parseInt(reservationId));
            return ResponseHandler.success(res, { pending_balance: pendingBalance }, "Saldo pendente obtido com sucesso");
        } catch (error) {
            console.error("Erro ao obter saldo pendente:", error);
            return ResponseHandler.error(res, "Erro ao obter saldo pendente", 500);
        }
    }

    // ========================================
    // PROCESSAMENTO DE PAGAMENTOS
    // ========================================

    // Processar pagamento
    static async processPayment(req: Request, res: Response) {
        try {
            const { error } = processPaymentSchema.validate(req.body);
            if (error) {
                return ResponseHandler.error(res, error.details[0]?.message || "Dados inválidos", 400);
            }

            const { payment_id, transaction_id } = req.body;

            // Verificar se o pagamento pode ser processado
            const canProcess = await PaymentService.canProcessPayment(payment_id);
            if (!canProcess) {
                return ResponseHandler.error(res, "Pagamento não pode ser processado", 400);
            }

            const payment = await PaymentService.processPayment(payment_id, transaction_id);
            
            if (!payment) {
                return ResponseHandler.error(res, "Pagamento não encontrado ou já processado", 404);
            }
            
            return ResponseHandler.success(res, payment, "Pagamento processado com sucesso");
        } catch (error) {
            console.error("Erro ao processar pagamento:", error);
            return ResponseHandler.error(res, "Erro ao processar pagamento", 500);
        }
    }

    // Reembolsar pagamento
    static async refundPayment(req: Request, res: Response) {
        try {
            const { id } = req.params;
            if (!id) {
                return ResponseHandler.error(res, "ID do pagamento é obrigatório", 400);
            }
            
            const { reason } = req.body;

            // Verificar se o pagamento pode ser reembolsado
            const canRefund = await PaymentService.canRefundPayment(parseInt(id));
            if (!canRefund) {
                return ResponseHandler.error(res, "Pagamento não pode ser reembolsado", 400);
            }

            const payment = await PaymentService.refundPayment(parseInt(id), reason);
            
            if (!payment) {
                return ResponseHandler.error(res, "Pagamento não encontrado ou não pode ser reembolsado", 404);
            }
            
            return ResponseHandler.success(res, payment, "Pagamento reembolsado com sucesso");
        } catch (error) {
            console.error("Erro ao reembolsar pagamento:", error);
            return ResponseHandler.error(res, "Erro ao reembolsar pagamento", 500);
        }
    }

    // ========================================
    // ESTATÍSTICAS E RELATÓRIOS
    // ========================================

    // Obter estatísticas de pagamentos
    static async getPaymentStats(req: Request, res: Response) {
        try {
            const { startDate, endDate } = req.query;
            
            let start: Date | undefined;
            let end: Date | undefined;
            
            if (startDate && endDate) {
                start = new Date(startDate as string);
                end = new Date(endDate as string);
            }

            const stats = await PaymentService.getPaymentStats(start, end);
            return ResponseHandler.success(res, stats, "Estatísticas de pagamentos obtidas com sucesso");
        } catch (error) {
            console.error("Erro ao obter estatísticas de pagamentos:", error);
            return ResponseHandler.error(res, "Erro ao obter estatísticas de pagamentos", 500);
        }
    }

    // Obter pagamentos por período
    static async getPaymentsByPeriod(req: Request, res: Response) {
        try {
            const { startDate, endDate } = req.query;
            
            if (!startDate || !endDate) {
                return ResponseHandler.error(res, "Data inicial e final são obrigatórias", 400);
            }

            const payments = await PaymentService.getPaymentsByPeriod(
                new Date(startDate as string),
                new Date(endDate as string)
            );
            
            return ResponseHandler.success(res, payments, "Pagamentos do período obtidos com sucesso");
        } catch (error) {
            console.error("Erro ao obter pagamentos por período:", error);
            return ResponseHandler.error(res, "Erro ao obter pagamentos por período", 500);
        }
    }

    // Obter pagamentos por método
    static async getPaymentsByMethod(req: Request, res: Response) {
        try {
            const { method } = req.params;
            if (!method) {
                return ResponseHandler.error(res, "Método de pagamento é obrigatório", 400);
            }
            
            const { startDate, endDate } = req.query;
            
            let start: Date | undefined;
            let end: Date | undefined;
            
            if (startDate && endDate) {
                start = new Date(startDate as string);
                end = new Date(endDate as string);
            }

            const payments = await PaymentService.getPaymentsByMethod(method, start, end);
            return ResponseHandler.success(res, payments, "Pagamentos por método obtidos com sucesso");
        } catch (error) {
            console.error("Erro ao obter pagamentos por método:", error);
            return ResponseHandler.error(res, "Erro ao obter pagamentos por método", 500);
        }
    }

    // ========================================
    // UTILITÁRIOS
    // ========================================

    // Obter métodos de pagamento disponíveis
    static async getAvailablePaymentMethods(req: Request, res: Response) {
        try {
            const methods = PaymentService.getAvailablePaymentMethods();
            return ResponseHandler.success(res, methods, "Métodos de pagamento obtidos com sucesso");
        } catch (error) {
            console.error("Erro ao obter métodos de pagamento:", error);
            return ResponseHandler.error(res, "Erro ao obter métodos de pagamento", 500);
        }
    }
}
