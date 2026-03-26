import { Request, Response } from 'express';
import { db } from '../../config/firebase';

export const getDashboardStats = async (req: Request, res: Response) => {
    try {
        const [
            usersSnapshot,
            prayersSnapshot,
            testimoniesSnapshot,
            registrationsSnapshot,
            eventsSnapshot
        ] = await Promise.all([
            db.collection('users').get(),
            db.collection('prayers').get(),
            db.collection('testimonies').get(),
            db.collection('registrations').get(),
            db.collection('events').where('status', '==', 'ACTIVE').get()
        ]);

        res.json({
            totalUsers: usersSnapshot.size,
            totalPrayers: prayersSnapshot.size,
            totalTestimonies: testimoniesSnapshot.size,
            totalRegistrations: registrationsSnapshot.size,
            activeEvents: eventsSnapshot.size,
            pendingPrayers: prayersSnapshot.docs.filter(d => d.data().status === 'PENDING').length,
            pendingTestimonies: testimoniesSnapshot.docs.filter(d => d.data().status === 'PENDING').length
        });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const getAllRegistrations = async (req: Request, res: Response) => {
    try {
        const snapshot = await db.collection('registrations').orderBy('createdAt', 'desc').get();
        const registrations = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        res.json(registrations);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const getAllPrayers = async (req: Request, res: Response) => {
    try {
        const snapshot = await db.collection('prayers').orderBy('createdAt', 'desc').get();
        const prayers = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        res.json(prayers);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const getAllTestimonies = async (req: Request, res: Response) => {
    try {
        const snapshot = await db.collection('testimonies').orderBy('createdAt', 'desc').get();
        const testimonies = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        res.json(testimonies);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const updatePrayerStatus = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { status } = req.body;
    try {
        const prayerRef = db.collection('prayers').doc(id as string);
        await prayerRef.update({ 
            status,
            updatedAt: new Date().toISOString()
        });
        const updated = await prayerRef.get();
        res.json({ id: updated.id, ...updated.data() });
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
};

export const updateTestimonyStatus = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { status } = req.body;
    try {
        const testimonyRef = db.collection('testimonies').doc(id as string);
        await testimonyRef.update({ 
            status,
            updatedAt: new Date().toISOString()
        });
        const updated = await testimonyRef.get();
        res.json({ id: updated.id, ...updated.data() });
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
};

export const deleteRegistration = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        await db.collection('registrations').doc(id as string).delete();
        res.json({ message: 'Registration deleted successfully' });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const deletePrayer = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        await db.collection('prayers').doc(id as string).delete();
        res.json({ message: 'Prayer deleted successfully' });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const deleteTestimony = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        await db.collection('testimonies').doc(id as string).delete();
        res.json({ message: 'Testimony deleted successfully' });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const deleteEvent = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        await db.collection('events').doc(id as string).delete();
        res.json({ message: 'Event deleted successfully' });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};
