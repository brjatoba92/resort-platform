import { Response } from "express";
import { AuthRequest } from "@/middleware/auth";
export declare class RoomController {
    static getAllRooms(req: AuthRequest, res: Response): Promise<Response<any, Record<string, any>>>;
    static getRoomById(req: AuthRequest, res: Response): Promise<Response<any, Record<string, any>>>;
    static createRoom(req: AuthRequest, res: Response): Promise<Response<any, Record<string, any>>>;
    static updateRoom(req: AuthRequest, res: Response): Promise<Response<any, Record<string, any>>>;
    static deleteRoom(req: AuthRequest, res: Response): Promise<Response<any, Record<string, any>>>;
    static checkAvailability(req: AuthRequest, res: Response): Promise<Response<any, Record<string, any>>>;
}
//# sourceMappingURL=roomController.d.ts.map