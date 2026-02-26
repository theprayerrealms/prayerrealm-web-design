import { Request, Response } from 'express';
import { PrayerRequest } from './prayer.model';

export const createPrayerRequest = async (req: any, res: Response) => {
    try {
        const prayer = await PrayerRequest.create({
            ...req.body,
            userId: req.user?._id
        });
        res.status(201).json(prayer);
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
};

export const getPublicPrayers = async (req: Request, res: Response) => {
    const { page = 1, limit = 10, lang = 'en' } = req.query;
    try {
        const prayers = await PrayerRequest.find({
            status: 'APPROVED',
            isPublic: true,
            language: lang as string
        })
            .limit(Number(limit))
            .skip((Number(page) - 1) * Number(limit))
            .sort({ createdAt: -1 });

        res.json(prayers);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};
