import { Payment, PaymentCreate, PaymentUpdate } from "@/types";
export declare class PaymentService {
    static getAllPayments(): Promise<Payment[]>;
    static getPaymentById(id: number): Promise<Payment | null>;
    static createPayment(paymentData: PaymentCreate): Promise<Payment>;
    static updatePayment(id: number, paymentData: PaymentUpdate): Promise<Payment | null>;
    static deletePayment(id: number): Promise<boolean>;
    static getPaymentsByReservation(reservationId: number): Promise<Payment[]>;
    static getTotalPaidByReservation(reservationId: number): Promise<number>;
    static getPendingBalanceByReservation(reservationId: number): Promise<number>;
    static processPayment(paymentId: number, transactionId?: string): Promise<Payment | null>;
    static refundPayment(paymentId: number, reason?: string): Promise<Payment | null>;
    static getPaymentStats(startDate?: Date, endDate?: Date): Promise<any>;
    static getPaymentsByPeriod(startDate: Date, endDate: Date): Promise<Payment[]>;
    static getPaymentsByMethod(method: string, startDate?: Date, endDate?: Date): Promise<Payment[]>;
    static validateReservation(reservationId: number): Promise<boolean>;
    static canProcessPayment(paymentId: number): Promise<boolean>;
    static canRefundPayment(paymentId: number): Promise<boolean>;
    static getAvailablePaymentMethods(): any[];
}
//# sourceMappingURL=paymentService.d.ts.map