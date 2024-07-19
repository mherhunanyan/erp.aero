import KibanaLogger from 'logger/Kibana.logger';
import { Response } from 'express';
import jwt from 'jsonwebtoken';

export const handleJwtError = (error: any, res: Response, logger: KibanaLogger) => {
    if (error instanceof jwt.TokenExpiredError) {
        return res.status(403).json({ message: 'Refresh token expired.' });
    } else if (error instanceof jwt.JsonWebTokenError) {
        return res.status(403).json({ message: 'Invalid token.' });
    } else {
        logger.error(error as string);
        return res.status(500).json({ message: 'Internal server error' });
    }
};
