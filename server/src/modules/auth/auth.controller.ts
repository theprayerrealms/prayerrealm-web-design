import { Request, Response } from 'express';
import { User } from '../users/user.model';
import { generateTokens } from '../../utils/token';
import { z } from 'zod';

const registerSchema = z.object({
    name: z.string().min(2),
    email: z.string().email(),
    password: z.string().min(6),
});

export const register = async (req: Request, res: Response) => {
    try {
        const validatedData = registerSchema.parse(req.body);
        const existingUser = await User.findOne({ email: validatedData.email });

        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const user = await User.create(validatedData);
        const tokens = generateTokens(user._id.toString());

        res.status(201).json({ user, ...tokens });
    } catch (error: any) {
        res.status(400).json({ error: error.errors || error.message });
    }
};

export const login = async (req: Request, res: Response) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email }).select('+password');
        if (!user || !(await (user as any).comparePassword(password))) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const tokens = generateTokens(user._id.toString());
        res.json({ user, ...tokens });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};
