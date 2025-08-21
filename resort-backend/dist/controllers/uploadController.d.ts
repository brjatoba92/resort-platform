import { Request, Response } from "express";
import { AuthRequest } from "@/middleware/auth";
export declare class UploadController {
    static getAllFiles(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    static getFileById(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    static uploadFile(req: AuthRequest, res: Response): Promise<Response<any, Record<string, any>>>;
    static updateFileUpload(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    static deleteFileUpload(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    static getFilesByEntity(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    static getFilesByCategory(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    static downloadFile(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    static viewFile(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    static uploadRoomImage(req: AuthRequest, res: Response): Promise<Response<any, Record<string, any>>>;
    static uploadGuestDocument(req: AuthRequest, res: Response): Promise<Response<any, Record<string, any>>>;
    static uploadPaymentReceipt(req: AuthRequest, res: Response): Promise<Response<any, Record<string, any>>>;
    static cleanupOrphanedFiles(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    static getUploadStats(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    static getUploadConfig(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    static getAvailableCategories(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
}
//# sourceMappingURL=uploadController.d.ts.map