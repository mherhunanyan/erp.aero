import { DecodedToken } from 'types/JwtTypes';
import { jwtConfig } from 'Config';
import jwt from 'jsonwebtoken';

export const verifyRefreshToken = (refreshToken: string) => {
    return jwt.verify(refreshToken, jwtConfig.REFRESH_TOKEN_SECRET) as DecodedToken;
};
