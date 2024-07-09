import { NextFunction, Request, Response } from 'express';
import LoggerFactory from 'logger/Logger.factory';
import { redis } from 'database/Redis';

export const isAuthMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    const logger = LoggerFactory.getLogger('IsAuthMiddleware');
    try {
        const { accessToken } = req.body;
        if (!accessToken) {
            res.status(401).json({ message: 'Access denied. No access token provided.' });
        }

        const isExistAccessToken = await redis.exists(accessToken);
        if (isExistAccessToken) {
            return next();
        } else {
            return res.status(401).json({ message: 'Wrong access Token.' });
        }
    } catch (error) {
        logger.error(error as string);
    }
};
