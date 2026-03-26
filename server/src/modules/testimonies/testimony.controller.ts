import { Request, Response } from 'express';
import { db } from '../../config/firebase';

export const submitTestimony = async (req: any, res: Response) => {
    try {
        const testimonyData = {
            ...req.body,
            userId: req.user?.id || null,
            status: 'PENDING',
            createdAt: new Date().toISOString()
        };
        const docRef = await db.collection('testimonies').add(testimonyData);
        res.status(201).json({ id: docRef.id, ...testimonyData });
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
};

export const getApprovedTestimonies = async (req: Request, res: Response) => {
    const { lang = 'en' } = req.query;
    try {
        const snapshot = await db.collection('testimonies')
            .where('status', '==', 'APPROVED')
            .where('language', '==', lang)
            .orderBy('createdAt', 'desc')
            .get();
        
        const testimonies = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        res.json(testimonies);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};
