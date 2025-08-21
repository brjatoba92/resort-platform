import { Router } from "express";
import { PaymentController } from "@/controllers/paymentController";
import { authenticate } from "@/middleware/auth";

const router = Router();

// ========================================
// ROTAS DE GESTÃO DE PAGAMENTOS
// ========================================

// Listar todos os pagamentos
router.get("/", authenticate, PaymentController.getAllPayments);

// Obter pagamento por ID
router.get("/:id", authenticate, PaymentController.getPaymentById);

// Criar novo pagamento
router.post("/", authenticate, PaymentController.createPayment);

// Atualizar pagamento
router.put("/:id", authenticate, PaymentController.updatePayment);

// Deletar pagamento
router.delete("/:id", authenticate, PaymentController.deletePayment);

// ========================================
// ROTAS DE PAGAMENTOS POR RESERVA
// ========================================

// Obter pagamentos por reserva
router.get("/reservation/:reservationId", authenticate, PaymentController.getPaymentsByReservation);

// Obter total pago por reserva
router.get("/reservation/:reservationId/total", authenticate, PaymentController.getTotalPaidByReservation);

// Obter saldo pendente por reserva
router.get("/reservation/:reservationId/balance", authenticate, PaymentController.getPendingBalanceByReservation);

// ========================================
// ROTAS DE PROCESSAMENTO
// ========================================

// Processar pagamento
router.post("/process", authenticate, PaymentController.processPayment);

// Reembolsar pagamento
router.post("/:id/refund", authenticate, PaymentController.refundPayment);

// ========================================
// ROTAS DE ESTATÍSTICAS E RELATÓRIOS
// ========================================

// Obter estatísticas de pagamentos
router.get("/stats/overview", authenticate, PaymentController.getPaymentStats);

// Obter pagamentos por período
router.get("/stats/period", authenticate, PaymentController.getPaymentsByPeriod);

// Obter pagamentos por método
router.get("/stats/method/:method", authenticate, PaymentController.getPaymentsByMethod);

// ========================================
// ROTAS DE UTILITÁRIOS
// ========================================

// Obter métodos de pagamento disponíveis
router.get("/methods/available", authenticate, PaymentController.getAvailablePaymentMethods);

export default router;
