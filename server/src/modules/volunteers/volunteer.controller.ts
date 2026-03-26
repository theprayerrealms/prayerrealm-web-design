import { Request, Response } from 'express';
import { db } from '../../config/firebase';
import { sendVolunteerConfirmation } from '../../utils/email';

export const applyAsVolunteer = async (req: any, res: Response) => {
    try {
        const applicationData = {
            ...req.body,
            userId: req.user?.id || null,
            status: 'PENDING',
            createdAt: new Date().toISOString()
        };
        
        const docRef = await db.collection('volunteers').add(applicationData);

        // Send confirmation email
        const { fullName, email, interests } = req.body;
        if (email) {
            await sendVolunteerConfirmation({
                to: email,
                name: fullName || 'Beloved',
                role: interests?.[0] || 'General Volunteer',
            });
        }

        res.status(201).json({ id: docRef.id, ...applicationData });
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
};

export const getApplications = async (req: Request, res: Response) => {
    try {
        const snapshot = await db.collection('volunteers').get();
        const applicationsPromises = snapshot.docs.map(async doc => {
            const data = doc.data();
            let user = null;
            if (data.userId) {
                const userDoc = await db.collection('users').doc(data.userId).get();
                if (userDoc.exists) {
                    const userData = userDoc.data();
                    user = { id: userDoc.id, name: userData?.name, email: userData?.email };
                }
            }
            return { id: doc.id, ...data, userId: user };
        });
        
        const applications = await Promise.all(applicationsPromises);
        res.json(applications);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};
