import { Request, Response } from 'express';
import { User } from 'models/User';
import bcrypt from 'bcryptjs';
import randomString from 'randomstring';
import { client } from 'database/Redis';
import { EXTAcessToken } from 'Config';

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

export const signinHandler = async (req: Request, res: Response) => {
    const { id, password } = req.body;
    const user = await User.findOne({ where: { id } });
    if (!user) {
        return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isMath = await bcrypt.compare(password, user.password);
    if (!isMath) {
        return res.status(401).json({ message: 'Invalid credentials' });
    }
    const randomStr: string = randomString.generate(10);
    await client.set(id, randomStr, { EX: EXTAcessToken });

    res.status(200).json({
        message: 'Sign-in successful',
    });
};
