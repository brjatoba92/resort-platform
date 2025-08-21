import { Request, Response } from "express";
import { AuthRequest } from "../middleware/auth";
export declare class AuthController {
    static login(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    static refresh(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    static createUser(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    static getProfile(req: AuthRequest, res: Response): Promise<Response<any, Record<string, any>>>;
    static logout(req: AuthRequest, res: Response): Promise<Response<any, Record<string, any>>>;
    static listUsers(req: AuthRequest, res: Response): Promise<Response<any, Record<string, any>>>;
}
//# sourceMappingURL=authController.d.ts.map