import { NextFunction, Request, Response } from 'express';
import { redis } from 'database/Redis';

export const IsAuthMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    const userAccessToken = req.body;
    const user = await redis.get(userAccessToken);
    if (user) {
        next();
    } else {
        return res.status(401).json({ message: 'Access denied. No token provided.' });
    }
};
