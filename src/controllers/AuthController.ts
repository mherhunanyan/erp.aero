import { NextFunction, Request, Response } from 'express';
import { EXAcessToken, EXRefreshToken } from 'Config';
import randomString from 'randomstring';
import { redis } from 'database/Redis';
import { User } from 'models/User';
import bcrypt from 'bcryptjs';
import LoggerFactory from 'logger/Logger.factory';

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
        next();
    } catch (error) {
        logger.error(error as string);
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
            await redis.set(newAccessToken, id, { EX: EXAcessToken });
            const newRefreshToken = randomString.generate(10);
            await redis.set(newRefreshToken, id), { EX: EXRefreshToken };

            res.status(200).json({
                message: 'Sign-in successful',
                newAccessToken,
                newRefreshToken,
            });
            next();
        } else {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
    } catch (error) {
        logger.error(error as string);
    }
};

export const siginNewTokenHandler = async (req: Request, res: Response, next: NextFunction) => {
    const logger = LoggerFactory.getLogger('siginNewTokenHandler');
    try {
        const { refreshToken } = req.body;
        if (!refreshToken) {
            res.status(401).json({ message: 'Access denied. No refresh token provided.' });
        }
        const user = await redis.get(refreshToken);
        if (user) {
            const newAccessToken = randomString.generate(10);
            await redis.set(newAccessToken, user, { EX: EXAcessToken });
            res.status(200).json({
                message: 'token is updated',
                newAccessToken,
            });
            next();
        } else {
            return res.status(401).json({ message: 'Wrong Refresh token.' });
        }
    } catch (error) {
        logger.error(error as string);
    }
};
