import { Request, Response } from 'express';
import { db } from '../../config/firebase';

export const createSermon = async (req: Request, res: Response) => {
    try {
        const sermonData = {
            ...req.body,
            createdAt: new Date().toISOString()
        };
        const docRef = await db.collection('sermons').add(sermonData);
        res.status(201).json({ id: docRef.id, ...sermonData });
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
};

export const getSermons = async (req: Request, res: Response) => {
    const { lang = 'en' } = req.query;
    try {
        const snapshot = await db.collection('sermons')
            .where('language', '==', lang)
            .orderBy('date', 'desc')
            .get();
        
        const sermons = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        res.json(sermons);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};
