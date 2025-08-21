import { Request, Response } from "express";
import { AuthRequest } from "@/middleware/auth";
export declare class ReportController {
    static generateReport(req: AuthRequest, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    static generateFinancialReport(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    static generateOccupancyReport(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    static generateMinibarReport(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    static generateNotificationReport(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    static generateCustomReport(req: AuthRequest, res: Response): Promise<Response<any, Record<string, any>>>;
    static getAvailableReportTypes(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    static getAvailableExportFormats(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    static getReportStats(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    private static isValidSQLQuery;
    static testDatabase(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    static createTestData(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    static getQuickDashboardReport(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
}
//# sourceMappingURL=reportController.d.ts.map