import { Response } from 'express';
export declare class ResponseHandler {
    static success<T>(res: Response, data: T, message?: string, statusCode?: number): Response<any, Record<string, any>>;
    static error(res: Response, error: string, statusCode?: number): Response<any, Record<string, any>>;
    static created<T>(res: Response, data: T, message?: string): Response<any, Record<string, any>>;
    static noContent(res: Response): Response<any, Record<string, any>>;
}
//# sourceMappingURL=responses.d.ts.map