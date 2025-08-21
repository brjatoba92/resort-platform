import { Notification, NotificationCreate, NotificationUpdate } from "@/types";
export declare class NotificationService {
    static getAllNotifications(): Promise<Notification[]>;
    static getNotificationById(id: number): Promise<Notification | null>;
    static createNotification(notificationData: NotificationCreate): Promise<Notification>;
    static updateNotification(id: number, notificationData: NotificationUpdate): Promise<Notification | null>;
    static deleteNotification(id: number): Promise<boolean>;
    static getNotificationsByReservation(reservationId: number): Promise<Notification[]>;
    static getNotificationsByType(type: string): Promise<Notification[]>;
    static sendNotification(notificationId: number): Promise<Notification | null>;
    private static simulateSendNotification;
    static createCheckoutReminder1h(reservationId: number): Promise<Notification>;
    static createCheckoutReminder30min(reservationId: number): Promise<Notification>;
    static createCheckinReminder(reservationId: number): Promise<Notification>;
    static createPaymentReminder(reservationId: number): Promise<Notification>;
    static createMinibarConsumptionNotification(reservationId: number, totalAmount: number): Promise<Notification>;
    static createSystemAlert(message: string): Promise<Notification>;
    static processPendingNotifications(): Promise<{
        success: number;
        failed: number;
    }>;
    static checkAndCreateAutomaticNotifications(): Promise<void>;
    static getNotificationStats(startDate?: Date, endDate?: Date): Promise<any>;
    static getNotificationsByPeriod(startDate: Date, endDate: Date): Promise<Notification[]>;
    static validateReservation(reservationId: number): Promise<boolean>;
    static canSendNotification(notificationId: number): Promise<boolean>;
    static getAvailableNotificationTypes(): any[];
}
//# sourceMappingURL=notificationService.d.ts.map