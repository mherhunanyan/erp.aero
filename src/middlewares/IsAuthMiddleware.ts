import { NextFunction, Request, Response } from 'express';
import LoggerFactory from 'logger/Logger.factory';
import { redis } from 'database/Redis';

export const IsAuthMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    const logger = LoggerFactory.getLogger('IsAuthMiddleware');
    try {
        const { userAccessToken } = req.body;
        if (!userAccessToken) {
            res.status(401).json({ message: 'Access denied. No access token provided.' });
        }
        const user = await redis.get(userAccessToken);
        if (user) {
            return next();
        } else {
            return res.status(401).json({ message: 'Wrong access Token.' });
        }
    } catch (error) {
        logger.error(error as string);
    }
};
