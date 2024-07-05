import { NextFunction, Request, Response } from 'express';

export const IsAuthMiddleware = (req: Request, res: Response, next: NextFunction) => {
    console.log(req.body);
    next();
};
