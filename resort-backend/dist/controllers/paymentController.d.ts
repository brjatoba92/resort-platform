import { Request, Response } from "express";
import { AuthRequest } from "@/middleware/auth";
export declare class PaymentController {
    static getAllPayments(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    static getPaymentById(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    static createPayment(req: AuthRequest, res: Response): Promise<Response<any, Record<string, any>>>;
    static updatePayment(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    static deletePayment(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    static getPaymentsByReservation(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    static getTotalPaidByReservation(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    static getPendingBalanceByReservation(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    static processPayment(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    static refundPayment(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    static getPaymentStats(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    static getPaymentsByPeriod(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    static getPaymentsByMethod(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    static getAvailablePaymentMethods(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
}
//# sourceMappingURL=paymentController.d.ts.map