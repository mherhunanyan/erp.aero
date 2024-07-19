import { jwtConfig } from 'Config';
import jwt from 'jsonwebtoken';

export const generateJwtAccessToken = (userId: string, refreshToken: string) => {
    return jwt.sign({ userId, refreshToken }, jwtConfig.ACCESS_TOKEN_SECRET, {
        expiresIn: jwtConfig.ACCESS_TOKEN_EXPIRY,
    });
};
