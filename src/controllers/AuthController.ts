import { generateJwtRefreshToken } from 'utils/tokenUtils/GenerateJwtRefreshToken';
import { generateJwtAccessToken } from 'utils/tokenUtils/GenerateJwtAccessToken';
import { verifyJwtRefreshToken } from 'utils/tokenUtils/VerifyJwtRefreshToken';
import { checkIfTokenIsRevoked } from 'utils/redisUtils/CheckIfTokenIsRevoked';
import { verifyJwtAccessToken } from 'utils/tokenUtils/VerifyJwtAccessToken';
import { markTokenAsRevoked } from 'utils/redisUtils/MarkTokenAsRevoked';
import { NextFunction, Request, Response } from 'express';
import { getRemainingTime } from 'utils/GetRemainingTime';
import LoggerFactory from 'logger/Logger.factory';
import { User } from 'models/User';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

export const signupHandler = async (req: Request, res: Response, next: NextFunction) => {
    const logger = LoggerFactory.getLogger('signupHandler');
    try {
        const { id, password } = req.body;
        if (!password || !id) {
            return res.status(409).json({ message: 'Invalid credentials' });
        }

        const user = await User.findByPk(id);
        if (user) {
            return res.status(409).json({ message: 'User already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        await User.create({ id, password: hashedPassword });

        return res.status(201).json({
            message: 'User created successfully',
        });
    } catch (error) {
        logger.error(error as string);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

export const signinHandler = async (req: Request, res: Response, next: NextFunction) => {
    const logger = LoggerFactory.getLogger('signinHandler');
    try {
        const { id, password } = req.body;
        if (!password || !id) {
            return res.status(409).json({ message: 'Invalid credentials' });
        }

        const user = await User.findByPk(id);
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const newRefreshToken = generateJwtRefreshToken(id);
        const newAccessToken = generateJwtAccessToken(id, newRefreshToken);

        return res.status(200).json({
            message: 'Sign-in successful',
            newAccessToken,
            newRefreshToken,
        });
    } catch (error) {
        logger.error(error as string);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

export const siginNewTokenHandler = async (req: Request, res: Response, next: NextFunction) => {
    const logger = LoggerFactory.getLogger('siginNewTokenHandler');
    try {
        const refreshToken = req.headers.refreshtoken as string;
        if (!refreshToken) {
            return res.status(401).json({ message: 'Access denied. No refresh token provided.' });
        }

        const isTokenRevoked = await checkIfTokenIsRevoked(refreshToken);
        if (isTokenRevoked) {
            return res.status(401).send('Refresh token has been invalidated.');
        }

        const decodedRefreshToken = verifyJwtRefreshToken(refreshToken);
        const { userId } = decodedRefreshToken;
        if (!userId) {
            return res.status(401).json({ message: 'Wrong Refresh token.' });
        }

        const newAccessToken = generateJwtAccessToken(userId, refreshToken);
        return res.status(200).json({ message: 'token is updated', newAccessToken });
    } catch (error) {
        if (error instanceof jwt.TokenExpiredError) {
            return res.status(403).json({ message: 'Refresh token expired.' });
        } else if (error instanceof jwt.JsonWebTokenError) {
            return res.status(403).json({ message: 'Invalid refresh token.' });
        } else {
            logger.error(error as string);
            return res.status(500).json({ message: 'Internal server error' });
        }
    }
};

export const logoutHandler = async (req: Request, res: Response, next: NextFunction) => {
    const logger = LoggerFactory.getLogger('logoutHandler');
    try {
        const accessToken = req.headers.accesstoken as string;

        const decodedAccessToken = verifyJwtAccessToken(accessToken);
        const storedRefreshToken = decodedAccessToken.refreshToken;
        if (!storedRefreshToken) {
            return res
                .status(200)
                .json({ message: 'No active session found or already logged out.' });
        }

        const decodedRefreshToken = verifyJwtRefreshToken(storedRefreshToken);

        const remainingTimeAccessToken = getRemainingTime(decodedAccessToken);
        const remainingTimeRefreshToken = getRemainingTime(decodedRefreshToken);

        await markTokenAsRevoked(accessToken, remainingTimeAccessToken);
        await markTokenAsRevoked(storedRefreshToken, remainingTimeRefreshToken);

        return res.status(200).json({ message: 'Successfully logged out.' });
    } catch (error) {
        logger.error(error as string);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

export const getInfoHandler = async (req: Request, res: Response, next: NextFunction) => {
    const logger = LoggerFactory.getLogger('getInfoHandler');
    try {
        // const accessToken = req.headers.accesstoken as string;
        // const userId = await redis.hGet(accessToken, USERID);
        // if (!userId) {
        //     res.status(401).json({ message: 'User does not exist.' });
        // }
        // return res.send({ userId });
    } catch (error) {
        logger.error(error as string);
        return res.status(500).json({ message: 'Internal server error' });
    }
};
