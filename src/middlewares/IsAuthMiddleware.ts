import { NextFunction, Request, Response } from 'express';
import { redis } from 'database/Redis';

export const IsAuthMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    const userToken = req.body;

    if (userToken) {
        const user = await redis.get(userToken);
        if (user) {
            next();
        } else {
            return res.status(401).json({ message: 'Access denied. No token provided.' });
        }
    } else {
        return res.status(401).json({ message: 'Access denied. No token provided.' });
    }
};
