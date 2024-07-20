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
            return res.status(401).send('Access token has been invalidated.');
        }

        const decodedAccessToken = jwtUtils.verifyJwtAccessToken(accessToken);
        req.userId = decodedAccessToken.userId;
        return next();
    } catch (error) {
        jwtUtils.handleJwtError(error, res, logger);
    }
};
