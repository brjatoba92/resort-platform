import { Response } from "express";
import { AuthRequest } from "@/middleware/auth";
export declare class GuestController {
    static getAllGuests(req: AuthRequest, res: Response): Promise<Response<any, Record<string, any>>>;
    static getGuestById(req: AuthRequest, res: Response): Promise<Response<any, Record<string, any>>>;
}
//# sourceMappingURL=guestController.d.ts.map