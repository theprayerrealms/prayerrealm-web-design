import { Request, Response } from 'express';
import { ContactMessage } from './contact.model';
import { sendContactAcknowledgement } from '../../utils/email';

export const submitContactForm = async (req: Request, res: Response) => {
    try {
        const { name, email, subject, message } = req.body;

        if (!name || !email || !message) {
            res.status(400).json({ message: 'Name, email, and message are required.' });
            return;
        }

        const contact = await ContactMessage.create({
            name,
            email,
            subject: subject || '',
            message
        });

        // Send acknowledgement email to the person
        await sendContactAcknowledgement({
            to: email,
            name,
            subject: subject || '',
        });

        res.status(201).json({
            message: 'Your message has been received. We will get back to you soon!',
            data: contact
        });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const getContactMessages = async (req: Request, res: Response) => {
    try {
        const messages = await ContactMessage.find().sort({ createdAt: -1 });
        res.json(messages);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};
