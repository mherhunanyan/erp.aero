import { NextFunction, Request, Response } from 'express';
import { getRemainingTime } from 'utils/GetRemainingTime';
import { redisUtils } from 'utils/redisUtils/RedisUtils';
import { jwtUtils } from 'utils/tokenUtils/JwtUtils';
import LoggerFactory from 'logger/Logger.factory';
import { AuthRequest } from 'types/AuthTypes';
import { User } from 'models/User';
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

        const newRefreshToken = jwtUtils.generateJwtRefreshToken(id);
        const newAccessToken = jwtUtils.generateJwtAccessToken(id, newRefreshToken);

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

        const isTokenRevoked = await redisUtils.checkIfTokenIsRevoked(refreshToken);
        if (isTokenRevoked) {
            return res.status(401).json({ message: 'Refresh token has been invalidated.' });
        }

        const decodedRefreshToken = jwtUtils.verifyJwtRefreshToken(refreshToken);
        const { userId } = decodedRefreshToken;
        if (!userId) {
            return res.status(401).json({ message: 'Wrong Refresh token.' });
        }

        const newAccessToken = jwtUtils.generateJwtAccessToken(userId, refreshToken);
        return res.status(200).json({ message: 'token is updated', newAccessToken });
    } catch (error) {
        jwtUtils.handleJwtError(error, res, logger);
    }
};

export const logoutHandler = async (req: AuthRequest, res: Response, next: NextFunction) => {
    const logger = LoggerFactory.getLogger('logoutHandler');
    try {
        const accessToken = req.headers.accesstoken;
        const { storedRefreshToken, accessTokenExpiration, refreshTokenExpiration } = req;
        if (!storedRefreshToken) {
            return res
                .status(200)
                .json({ message: 'No active session found or already logged out.' });
        }

        const remainingTimeAccessToken = getRemainingTime(accessTokenExpiration as number);
        const remainingTimeRefreshToken = getRemainingTime(refreshTokenExpiration as number);

        await redisUtils.markTokenAsRevoked(accessToken as string, remainingTimeAccessToken);
        await redisUtils.markTokenAsRevoked(storedRefreshToken, remainingTimeRefreshToken);

        return res.status(200).json({ message: 'Successfully logged out.' });
    } catch (error) {
        jwtUtils.handleJwtError(error, res, logger);
    }
};

export const getInfoHandler = async (req: AuthRequest, res: Response, next: NextFunction) => {
    const logger = LoggerFactory.getLogger('getInfoHandler');
    try {
        const userId = req.userId;
        if (!userId) {
            res.status(401).json({ message: 'User does not exist.' });
        }
        return res.send({ userId });
    } catch (error) {
        logger.error(error as string);
        return res.status(500).json({ message: 'Internal server error' });
    }
};
