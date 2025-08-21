"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentController = void 0;
const paymentService_1 = require("@/services/paymentService");
const responses_1 = require("@/utils/responses");
const validators_1 = require("@/utils/validators");
class PaymentController {
    static async getAllPayments(req, res) {
        try {
            const payments = await paymentService_1.PaymentService.getAllPayments();
            return responses_1.ResponseHandler.success(res, payments, "Pagamentos listados com sucesso");
        }
        catch (error) {
            console.error("Erro ao listar pagamentos:", error);
            return responses_1.ResponseHandler.error(res, "Erro ao listar pagamentos", 500);
        }
    }
    static async getPaymentById(req, res) {
        try {
            const { id } = req.params;
            if (!id) {
                return responses_1.ResponseHandler.error(res, "ID do pagamento é obrigatório", 400);
            }
            const payment = await paymentService_1.PaymentService.getPaymentById(parseInt(id));
            if (!payment) {
                return responses_1.ResponseHandler.error(res, "Pagamento não encontrado", 404);
            }
            return responses_1.ResponseHandler.success(res, payment, "Pagamento encontrado com sucesso");
        }
        catch (error) {
            console.error("Erro ao obter pagamento:", error);
            return responses_1.ResponseHandler.error(res, "Erro ao obter pagamento", 500);
        }
    }
    static async createPayment(req, res) {
        try {
            const { error } = validators_1.createPaymentSchema.validate(req.body);
            if (error) {
                return responses_1.ResponseHandler.error(res, error.details[0]?.message || "Dados inválidos", 400);
            }
            const isValidReservation = await paymentService_1.PaymentService.validateReservation(req.body.reservation_id);
            if (!isValidReservation) {
                return responses_1.ResponseHandler.error(res, "Reserva não encontrada ou não está ativa", 400);
            }
            const paymentData = {
                ...req.body,
                processed_by: req.user.userId
            };
            const payment = await paymentService_1.PaymentService.createPayment(paymentData);
            return responses_1.ResponseHandler.success(res, payment, "Pagamento criado com sucesso", 201);
        }
        catch (error) {
            console.error("Erro ao criar pagamento:", error);
            return responses_1.ResponseHandler.error(res, "Erro ao criar pagamento", 500);
        }
    }
    static async updatePayment(req, res) {
        try {
            const { id } = req.params;
            if (!id) {
                return responses_1.ResponseHandler.error(res, "ID do pagamento é obrigatório", 400);
            }
            const { error } = validators_1.updatePaymentSchema.validate(req.body);
            if (error) {
                return responses_1.ResponseHandler.error(res, error.details[0]?.message || "Dados inválidos", 400);
            }
            const payment = await paymentService_1.PaymentService.updatePayment(parseInt(id), req.body);
            if (!payment) {
                return responses_1.ResponseHandler.error(res, "Pagamento não encontrado", 404);
            }
            return responses_1.ResponseHandler.success(res, payment, "Pagamento atualizado com sucesso");
        }
        catch (error) {
            console.error("Erro ao atualizar pagamento:", error);
            return responses_1.ResponseHandler.error(res, "Erro ao atualizar pagamento", 500);
        }
    }
    static async deletePayment(req, res) {
        try {
            const { id } = req.params;
            if (!id) {
                return responses_1.ResponseHandler.error(res, "ID do pagamento é obrigatório", 400);
            }
            const deleted = await paymentService_1.PaymentService.deletePayment(parseInt(id));
            if (!deleted) {
                return responses_1.ResponseHandler.error(res, "Pagamento não encontrado", 404);
            }
            return responses_1.ResponseHandler.success(res, null, "Pagamento deletado com sucesso");
        }
        catch (error) {
            console.error("Erro ao deletar pagamento:", error);
            return responses_1.ResponseHandler.error(res, "Erro ao deletar pagamento", 500);
        }
    }
    static async getPaymentsByReservation(req, res) {
        try {
            const { reservationId } = req.params;
            if (!reservationId) {
                return responses_1.ResponseHandler.error(res, "ID da reserva é obrigatório", 400);
            }
            const payments = await paymentService_1.PaymentService.getPaymentsByReservation(parseInt(reservationId));
            return responses_1.ResponseHandler.success(res, payments, "Pagamentos da reserva obtidos com sucesso");
        }
        catch (error) {
            console.error("Erro ao obter pagamentos da reserva:", error);
            return responses_1.ResponseHandler.error(res, "Erro ao obter pagamentos da reserva", 500);
        }
    }
    static async getTotalPaidByReservation(req, res) {
        try {
            const { reservationId } = req.params;
            if (!reservationId) {
                return responses_1.ResponseHandler.error(res, "ID da reserva é obrigatório", 400);
            }
            const totalPaid = await paymentService_1.PaymentService.getTotalPaidByReservation(parseInt(reservationId));
            return responses_1.ResponseHandler.success(res, { total_paid: totalPaid }, "Total pago obtido com sucesso");
        }
        catch (error) {
            console.error("Erro ao obter total pago:", error);
            return responses_1.ResponseHandler.error(res, "Erro ao obter total pago", 500);
        }
    }
    static async getPendingBalanceByReservation(req, res) {
        try {
            const { reservationId } = req.params;
            if (!reservationId) {
                return responses_1.ResponseHandler.error(res, "ID da reserva é obrigatório", 400);
            }
            const pendingBalance = await paymentService_1.PaymentService.getPendingBalanceByReservation(parseInt(reservationId));
            return responses_1.ResponseHandler.success(res, { pending_balance: pendingBalance }, "Saldo pendente obtido com sucesso");
        }
        catch (error) {
            console.error("Erro ao obter saldo pendente:", error);
            return responses_1.ResponseHandler.error(res, "Erro ao obter saldo pendente", 500);
        }
    }
    static async processPayment(req, res) {
        try {
            const { error } = validators_1.processPaymentSchema.validate(req.body);
            if (error) {
                return responses_1.ResponseHandler.error(res, error.details[0]?.message || "Dados inválidos", 400);
            }
            const { payment_id, transaction_id } = req.body;
            const canProcess = await paymentService_1.PaymentService.canProcessPayment(payment_id);
            if (!canProcess) {
                return responses_1.ResponseHandler.error(res, "Pagamento não pode ser processado", 400);
            }
            const payment = await paymentService_1.PaymentService.processPayment(payment_id, transaction_id);
            if (!payment) {
                return responses_1.ResponseHandler.error(res, "Pagamento não encontrado ou já processado", 404);
            }
            return responses_1.ResponseHandler.success(res, payment, "Pagamento processado com sucesso");
        }
        catch (error) {
            console.error("Erro ao processar pagamento:", error);
            return responses_1.ResponseHandler.error(res, "Erro ao processar pagamento", 500);
        }
    }
    static async refundPayment(req, res) {
        try {
            const { id } = req.params;
            if (!id) {
                return responses_1.ResponseHandler.error(res, "ID do pagamento é obrigatório", 400);
            }
            const { reason } = req.body;
            const canRefund = await paymentService_1.PaymentService.canRefundPayment(parseInt(id));
            if (!canRefund) {
                return responses_1.ResponseHandler.error(res, "Pagamento não pode ser reembolsado", 400);
            }
            const payment = await paymentService_1.PaymentService.refundPayment(parseInt(id), reason);
            if (!payment) {
                return responses_1.ResponseHandler.error(res, "Pagamento não encontrado ou não pode ser reembolsado", 404);
            }
            return responses_1.ResponseHandler.success(res, payment, "Pagamento reembolsado com sucesso");
        }
        catch (error) {
            console.error("Erro ao reembolsar pagamento:", error);
            return responses_1.ResponseHandler.error(res, "Erro ao reembolsar pagamento", 500);
        }
    }
    static async getPaymentStats(req, res) {
        try {
            const { startDate, endDate } = req.query;
            let start;
            let end;
            if (startDate && endDate) {
                start = new Date(startDate);
                end = new Date(endDate);
            }
            const stats = await paymentService_1.PaymentService.getPaymentStats(start, end);
            return responses_1.ResponseHandler.success(res, stats, "Estatísticas de pagamentos obtidas com sucesso");
        }
        catch (error) {
            console.error("Erro ao obter estatísticas de pagamentos:", error);
            return responses_1.ResponseHandler.error(res, "Erro ao obter estatísticas de pagamentos", 500);
        }
    }
    static async getPaymentsByPeriod(req, res) {
        try {
            const { startDate, endDate } = req.query;
            if (!startDate || !endDate) {
                return responses_1.ResponseHandler.error(res, "Data inicial e final são obrigatórias", 400);
            }
            const payments = await paymentService_1.PaymentService.getPaymentsByPeriod(new Date(startDate), new Date(endDate));
            return responses_1.ResponseHandler.success(res, payments, "Pagamentos do período obtidos com sucesso");
        }
        catch (error) {
            console.error("Erro ao obter pagamentos por período:", error);
            return responses_1.ResponseHandler.error(res, "Erro ao obter pagamentos por período", 500);
        }
    }
    static async getPaymentsByMethod(req, res) {
        try {
            const { method } = req.params;
            if (!method) {
                return responses_1.ResponseHandler.error(res, "Método de pagamento é obrigatório", 400);
            }
            const { startDate, endDate } = req.query;
            let start;
            let end;
            if (startDate && endDate) {
                start = new Date(startDate);
                end = new Date(endDate);
            }
            const payments = await paymentService_1.PaymentService.getPaymentsByMethod(method, start, end);
            return responses_1.ResponseHandler.success(res, payments, "Pagamentos por método obtidos com sucesso");
        }
        catch (error) {
            console.error("Erro ao obter pagamentos por método:", error);
            return responses_1.ResponseHandler.error(res, "Erro ao obter pagamentos por método", 500);
        }
    }
    static async getAvailablePaymentMethods(req, res) {
        try {
            const methods = paymentService_1.PaymentService.getAvailablePaymentMethods();
            return responses_1.ResponseHandler.success(res, methods, "Métodos de pagamento obtidos com sucesso");
        }
        catch (error) {
            console.error("Erro ao obter métodos de pagamento:", error);
            return responses_1.ResponseHandler.error(res, "Erro ao obter métodos de pagamento", 500);
        }
    }
}
exports.PaymentController = PaymentController;
//# sourceMappingURL=paymentController.js.map