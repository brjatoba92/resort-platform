import { Request, Response } from "express";
import { AuthRequest } from "@/middleware/auth";
export declare class NotificationController {
    static getAllNotifications(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    static getNotificationById(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    static createNotification(req: AuthRequest, res: Response): Promise<Response<any, Record<string, any>>>;
    static updateNotification(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    static deleteNotification(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    static getNotificationsByReservation(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    static getNotificationsByType(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    static sendNotification(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    static createCheckoutReminder1h(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    static createCheckoutReminder30min(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    static createCheckinReminder(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    static createPaymentReminder(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    static createMinibarConsumptionNotification(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    static createSystemAlert(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    static processPendingNotifications(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    static checkAndCreateAutomaticNotifications(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    static getNotificationStats(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    static getNotificationsByPeriod(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    static getAvailableNotificationTypes(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
}
//# sourceMappingURL=notificationController.d.ts.map