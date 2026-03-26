import { Request, Response } from 'express';
import { db } from '../../config/firebase';

export const createPrayerRequest = async (req: any, res: Response) => {
    try {
        const prayerData = {
            ...req.body,
            userId: req.user?.id || null, // Firebase uid
            createdAt: new Date().toISOString(),
            status: 'PENDING',
            prayerCount: 0
        };
        
        const docRef = await db.collection('prayers').add(prayerData);
        res.status(201).json({ id: docRef.id, ...prayerData });
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
};

export const getPublicPrayers = async (req: Request, res: Response) => {
    const { limit = 10, lang = 'en' } = req.query;
    try {
        const snapshot = await db.collection('prayers')
            .where('status', '==', 'APPROVED')
            .where('isPublic', '==', true)
            .where('language', '==', lang)
            .orderBy('createdAt', 'desc')
            .limit(Number(limit))
            .get();

        const prayers = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        res.json(prayers);
    } catch (error: any) {
        console.error('Firestore Error:', error);
        res.status(500).json({ message: error.message });
    }
};
