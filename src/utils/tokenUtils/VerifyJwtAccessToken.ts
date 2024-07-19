import { DecodedToken } from 'types/JwtTypes';
import { jwtConfig } from 'Config';
import jwt from 'jsonwebtoken';

export const verifyJwtAccessToken = (accessToken: string) => {
    return jwt.verify(accessToken, jwtConfig.ACCESS_TOKEN_SECRET) as DecodedToken;
};
