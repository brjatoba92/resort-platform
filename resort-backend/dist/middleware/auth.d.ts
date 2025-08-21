import { Request, Response, NextFunction } from "express";
import { JWTPayload } from "../types";
export interface AuthRequest extends Request {
    user?: JWTPayload;
}
export declare const authenticate: (req: AuthRequest, res: Response, next: NextFunction) => Response<any, Record<string, any>> | undefined;
export declare const authorize: (roles: string[]) => (req: AuthRequest, res: Response, next: NextFunction) => Response<any, Record<string, any>> | undefined;
//# sourceMappingURL=auth.d.ts.map