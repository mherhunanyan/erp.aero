import { INTERNAL_SERVER_ERROR } from 'constants/ErrorConstants';
import KibanaLogger from 'logger/Kibana.logger';
import { Response } from 'express';
import jwt from 'jsonwebtoken';

export const handleJwtError = (error: any, res: Response, logger: KibanaLogger) => {
    if (error instanceof jwt.TokenExpiredError) {
        return res.status(403).json({ message: 'token expired.' });
    } else if (error instanceof jwt.JsonWebTokenError) {
        return res.status(403).json({ message: 'Invalid token.' });
    } else {
        logger.error(error as string);
        return res
            .status(INTERNAL_SERVER_ERROR.statusCode)
            .json({ message: INTERNAL_SERVER_ERROR.message });
    }
};
