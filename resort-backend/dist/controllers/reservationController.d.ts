import { Response } from 'express';
import { AuthRequest } from '@/middleware/auth';
export declare class ReservationController {
    static getAllReservations(req: AuthRequest, res: Response): Promise<Response<any, Record<string, any>>>;
    static getReservationById(req: AuthRequest, res: Response): Promise<Response<any, Record<string, any>>>;
    static createReservation(req: AuthRequest, res: Response): Promise<Response<any, Record<string, any>>>;
    static checkIn(req: AuthRequest, res: Response): Promise<Response<any, Record<string, any>>>;
    static checkOut(req: AuthRequest, res: Response): Promise<Response<any, Record<string, any>>>;
    static cancelReservation(req: AuthRequest, res: Response): Promise<Response<any, Record<string, any>>>;
    static confirmReservation(req: AuthRequest, res: Response): Promise<Response<any, Record<string, any>>>;
    static getUpcomingCheckouts(req: AuthRequest, res: Response): Promise<Response<any, Record<string, any>>>;
    static getTodayCheckIns(req: AuthRequest, res: Response): Promise<Response<any, Record<string, any>>>;
}
//# sourceMappingURL=reservationController.d.ts.map