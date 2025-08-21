import { Request, Response } from "express";
import { AuthRequest } from "@/middleware/auth";
export declare class MinibarController {
    static getAllItems(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    static getItemById(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    static createItem(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    static updateItem(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    static deleteItem(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    static getItemsByCategory(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    static getCategories(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    static recordConsumption(req: AuthRequest, res: Response): Promise<Response<any, Record<string, any>>>;
    static getConsumptionByReservation(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    static getConsumptionByPeriod(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    static getTotalConsumptionByReservation(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    static getConsumptionStats(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    static getConsumptionByItem(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
}
//# sourceMappingURL=minibarController.d.ts.map