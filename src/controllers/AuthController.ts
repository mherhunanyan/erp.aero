import { NextFunction, Request, Response } from 'express';
import { EXACCESSTOKEN, EXREFRESHTOKEN } from 'Config';
import LoggerFactory from 'logger/Logger.factory';
import randomString from 'randomstring';
import { redis } from 'database/Redis';
import { User } from 'models/User';
import bcrypt from 'bcryptjs';
import { ACCESSTOKEN, REFRESHTOKEN, USERID } from 'Constants';

export const signupHandler = async (req: Request, res: Response, next: NextFunction) => {
    const logger = LoggerFactory.getLogger('signupHandler');
    try {
        const { id, password } = req.body;
        if (!password || !id) {
            return res.status(409).json({ message: 'Invalid credentials' });
        }

        const user = await User.findOne({ where: { id } });
        if (user) {
            return res.status(409).json({ message: 'User already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        await User.create({ id, password: hashedPassword });

        res.status(201).json({
            message: 'User created successfully',
        });
        return next();
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

        const user = await User.findOne({ where: { id } });
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (isMatch) {
            const newAccessToken = randomString.generate(10);
            const newRefreshToken = randomString.generate(10);

            await redis.hSet(newAccessToken, { userId: id, refreshToken: newRefreshToken });
            await redis.expire(newAccessToken, EXACCESSTOKEN);
            await redis.hSet(newRefreshToken, { userId: id, accessToken: newAccessToken });
            await redis.expire(newRefreshToken, EXREFRESHTOKEN);

            res.status(200).json({
                message: 'Sign-in successful',
                newAccessToken,
                newRefreshToken,
            });
            return next();
        } else {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
    } catch (error) {
        logger.error(error as string);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

export const siginNewTokenHandler = async (req: Request, res: Response, next: NextFunction) => {
    const logger = LoggerFactory.getLogger('siginNewTokenHandler');
    try {
        const { refreshToken } = req.body;
        if (!refreshToken) {
            return res.status(401).json({ message: 'Access denied. No refresh token provided.' });
        }
        const userId = await redis.hGet(refreshToken, USERID);
        if (userId) {
            const existingAccessToken = await redis.hGet(refreshToken, ACCESSTOKEN);
            if (existingAccessToken) {
                await redis.del(existingAccessToken);
            }
            const newAccessToken = randomString.generate(10);

            await redis.hSet(newAccessToken, { userId, refreshToken });
            await redis.expire(newAccessToken, EXACCESSTOKEN);
            res.status(200).json({
                message: 'token is updated',
                newAccessToken,
            });
            return next();
        } else {
            return res.status(401).json({ message: 'Wrong Refresh token.' });
        }
    } catch (error) {
        logger.error(error as string);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

export const logoutHandler = async (req: Request, res: Response, next: NextFunction) => {
    const logger = LoggerFactory.getLogger('logutHandler');
    try {
        const { accessToken } = req.body;
        if (!accessToken) {
            return res.status(401).json({ message: 'Access denied. No access token provided.' });
        }
        const userId = await redis.hGet(accessToken, USERID);
        if (userId) {
            const existingRefreshToken = await redis.hGet(accessToken, REFRESHTOKEN);
            if (existingRefreshToken) {
                await redis.del(existingRefreshToken);
            }
            await redis.del(accessToken);
            res.status(200).json({ message: 'Access token successfully deleted.' });
            return next();
        } else {
            return res.status(200).json({
                message: 'No active session found or already logged out.',
            });
        }
    } catch (error) {
        logger.error(error as string);
        return res.status(500).json({ message: 'Internal server error' });
    }
};
