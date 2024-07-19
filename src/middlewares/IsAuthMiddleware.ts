import { redisUtils } from 'utils/redisUtils/RedisUtils';
import { jwtUtils } from 'utils/tokenUtils/JwtUtils';
import LoggerFactory from 'logger/Logger.factory';
import { NextFunction, Response } from 'express';
import { AuthRequest } from 'types/AuthTypes';

export const isAuthMiddleware = async (req: AuthRequest, res: Response, next: NextFunction) => {
    const logger = LoggerFactory.getLogger('IsAuthMiddleware');
    try {
        const accessToken = req.headers.accesstoken as string;
        if (!accessToken) {
            return res.status(401).json({ message: 'Access denied. No access token provided.' });
        }

        const isTokenRevoked = await redisUtils.checkIfTokenIsRevoked(accessToken);
        if (isTokenRevoked) {
            return res.status(401).send('Refresh token has been invalidated.');
        }

        const decodedAccessToken = jwtUtils.verifyJwtAccessToken(accessToken);
        const storedRefreshToken = decodedAccessToken.refreshToken;
        if (!storedRefreshToken) {
            res.status(401).json({
                message: 'Refresh token missing or invalid. Please re-authenticate.',
            });
        }
        const decodedRefreshToken = jwtUtils.verifyJwtRefreshToken(storedRefreshToken as string);

        req.userId = decodedAccessToken.userId;
        req.storedRefreshToken = storedRefreshToken;
        req.accessTokenExpiration = decodedAccessToken.exp;
        req.refreshTokenExpiration = decodedRefreshToken.exp;
        return next();
    } catch (error) {
        jwtUtils.handleJwtError(error, res, logger);
    }
};
