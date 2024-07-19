import { jwtConfig } from 'Config';
import jwt from 'jsonwebtoken';

export const generateRefreshToken = (userId: string) => {
    return jwt.sign({ userId }, jwtConfig.REFRESH_TOKEN_SECRET, {
        expiresIn: jwtConfig.REFRESH_TOKEN_EXPIRY,
    });
};
