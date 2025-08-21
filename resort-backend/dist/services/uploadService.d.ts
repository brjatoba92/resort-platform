import { FileUpload, FileUploadCreate, FileUploadUpdate, UploadConfig } from "@/types";
export declare class UploadService {
    private static readonly UPLOAD_CONFIGS;
    static getAllFiles(): Promise<FileUpload[]>;
    static getFileById(id: number): Promise<FileUpload | null>;
    static createFileUpload(fileData: FileUploadCreate): Promise<FileUpload>;
    static updateFileUpload(id: number, fileData: FileUploadUpdate): Promise<FileUpload | null>;
    static deleteFileUpload(id: number): Promise<boolean>;
    static getFilesByEntity(entityType: string, entityId: number): Promise<FileUpload[]>;
    static getFilesByCategory(category: string): Promise<FileUpload[]>;
    static processFileUpload(file: Express.Multer.File, category: string, entityType: string, entityId: number | undefined, uploadedBy: number): Promise<FileUpload>;
    private static generateUniqueFilename;
    static validateEntity(entityType: string, entityId: number): Promise<boolean>;
    static fileExists(id: number): Promise<boolean>;
    static getUploadConfig(category: string): UploadConfig | null;
    static getAvailableCategories(): string[];
    static getUploadStats(): Promise<any>;
    static cleanupOrphanedFiles(): Promise<{
        deleted: number;
        errors: number;
    }>;
    static getFilePath(fileUpload: FileUpload): string;
    static fileExistsPhysically(fileUpload: FileUpload): boolean;
}
//# sourceMappingURL=uploadService.d.ts.map