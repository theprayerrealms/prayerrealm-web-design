import { Request, Response } from 'express';
import { Sermon } from './sermon.model';

export const createSermon = async (req: Request, res: Response) => {
    try {
        const sermon = await Sermon.create(req.body);
        res.status(201).json(sermon);
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
};

export const getSermons = async (req: Request, res: Response) => {
    const { lang = 'en' } = req.query;
    try {
        const sermons = await Sermon.find({ language: lang as string }).sort({ date: -1 });
        res.json(sermons);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};
