import { Request, Response } from 'express';
import { Event } from './event.model';

export const createEvent = async (req: Request, res: Response) => {
    try {
        const event = await Event.create(req.body);
        res.status(201).json(event);
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
};

export const getAllEvents = async (req: Request, res: Response) => {
    try {
        const events = await Event.find().sort({ date: 1 });
        res.json(events);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};
