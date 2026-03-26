import { Request, Response } from 'express';
import { db } from '../../config/firebase';
import { sendContactAcknowledgement } from '../../utils/email';

export const submitContactForm = async (req: Request, res: Response) => {
    try {
        const { name, email, subject, message } = req.body;

        if (!name || !email || !message) {
            res.status(400).json({ message: 'Name, email, and message are required.' });
            return;
        }

        const contactData = {
            name,
            email,
            subject: subject || '',
            message,
            createdAt: new Date().toISOString()
        };

        const docRef = await db.collection('contact_messages').add(contactData);

        // Send acknowledgement email
        await sendContactAcknowledgement({
            to: email,
            name,
            subject: subject || '',
        });

        res.status(201).json({
            message: 'Your message has been received. We will get back to you soon!',
            data: { id: docRef.id, ...contactData }
        });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const getContactMessages = async (req: Request, res: Response) => {
    try {
        const snapshot = await db.collection('contact_messages').orderBy('createdAt', 'desc').get();
        const messages = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        res.json(messages);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};
