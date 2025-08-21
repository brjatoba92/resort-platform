import { FinancialReport, OccupancyReport, MinibarReport, NotificationReport, ReportRequest, ReportExport } from "@/types";
export declare class ReportService {
    static generateFinancialReport(request: ReportRequest): Promise<FinancialReport>;
    static generateOccupancyReport(request: ReportRequest): Promise<OccupancyReport>;
    static generateMinibarReport(request: ReportRequest): Promise<MinibarReport>;
    static generateNotificationReport(request: ReportRequest): Promise<NotificationReport>;
    static exportToExcel(data: any, reportName: string): Promise<ReportExport>;
    static exportToPDF(data: any, reportName: string): Promise<ReportExport>;
    static exportToCSV(data: any, reportName: string): Promise<ReportExport>;
    static getAvailableReportTypes(): string[];
    static getAvailableExportFormats(): string[];
    static validateReportRequest(request: ReportRequest): boolean;
}
//# sourceMappingURL=reportService.d.ts.map