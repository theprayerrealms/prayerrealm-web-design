import { Request, Response } from 'express';
import { Testimony } from './testimony.model';

export const submitTestimony = async (req: any, res: Response) => {
    try {
        const testimony = await Testimony.create({
            ...req.body,
            userId: req.user?._id
        });
        res.status(201).json(testimony);
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
};

export const getApprovedTestimonies = async (req: Request, res: Response) => {
    const { lang = 'en' } = req.query;
    try {
        const testimonies = await Testimony.find({
            status: 'APPROVED',
            language: lang as string
        }).sort({ createdAt: -1 });
        res.json(testimonies);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};
