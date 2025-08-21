import { User, JWTPayload } from "../types";
export declare class AuthService {
    static generateHash(password: string): Promise<string>;
    static comparePassword(password: string, hash: string): Promise<boolean>;
    static generateTokens(payload: JWTPayload): {
        accessToken: string;
        refreshToken: string;
    };
    static verifyRefreshToken(token: string): JWTPayload;
    static findUserByEmail(email: string): Promise<User | null>;
    static findUserById(id: number): Promise<User | null>;
    static createUser(userData: {
        email: string;
        password: string;
        role: 'admin' | 'employee';
        name: string;
        phone?: string;
    }): Promise<User>;
    static updateLastLogin(userId: number): Promise<void>;
}
//# sourceMappingURL=authService.d.ts.map