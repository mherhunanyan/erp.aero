import { Request } from 'express';

export interface AuthRequest extends Request {
    accessTokenExpiration?: number;
    refreshTokenExpiration?: number;
    storedRefreshToken?: string;
    userId?: string;
}
