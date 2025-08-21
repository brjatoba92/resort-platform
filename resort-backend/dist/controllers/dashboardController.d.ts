import { Response } from "express";
import { AuthRequest } from "@/middleware/auth";
export declare class DashboardController {
    static getDashboardOverview(req: AuthRequest, res: Response): Promise<Response<any, Record<string, any>>>;
    static getWeatherData(req: AuthRequest, res: Response): Promise<Response<any, Record<string, any>>>;
    static getOccupancyGraphs(req: AuthRequest, res: Response): Promise<Response<any, Record<string, any>>>;
}
//# sourceMappingURL=dashboardController.d.ts.map