import { NextFunction, Request, Response } from 'express';
import randomString from 'randomstring';
import { redis } from 'database/Redis';
import { EXAcessToken } from 'Config';
import { User } from 'models/User';
import bcrypt from 'bcryptjs';

export const signupHandler = async (req: Request, res: Response) => {
    const { id, password } = req.body;
    const user = await User.findOne({ where: { id } });
    if (user) {
        return res.status(409).json({ message: 'User already exists' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    await User.create({ id, password: hashedPassword });

    res.status(201).json({
        message: 'User created successfully',
    });
};

export const signinHandler = async (req: Request, res: Response, next: NextFunction) => {
    const { id, password } = req.body;

    const user = await User.findOne({ where: { id } });
    if (!user) {
        return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isMath = await bcrypt.compare(password, user.password);
    if (!isMath) {
        return res.status(401).json({ message: 'Invalid credentials' });
    }

    const newAccessToken = randomString.generate(10);
    await redis.set(newAccessToken, id, { EX: EXAcessToken });

    res.status(200).json({
        message: 'Sign-in successful',
        newAccessToken,
    });
    next();
};
