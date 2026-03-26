import { Request, Response } from 'express';
import { db } from '../../config/firebase';
import admin from 'firebase-admin';
import { sendEventConfirmation } from '../../utils/email';

export const registerForEvent = async (req: Request, res: Response) => {
    const { eventId, name, email, phone, city, volunteerStatus, department, transportation, accommodation, wrestleVersion, customAnswers } = req.body;

    try {
        const registrationData = {
            eventId,
            name,
            email,
            phone,
            city,
            volunteerStatus: volunteerStatus || 'NO',
            department: department || '',
            transportation: transportation || 'NO',
            accommodation: accommodation || 'NO',
            wrestleVersion: wrestleVersion || '2.0',
            customAnswers: customAnswers || {},
            status: 'CONFIRMED',
            createdAt: new Date().toISOString()
        };

        const docRef = await db.collection('registrations').add(registrationData);

        // Get event details for the email
        const eventDoc = await db.collection('events').doc(eventId).get();
        const eventTitle = eventDoc.exists ? eventDoc.data()?.title : "WrestleLagos 2.0";

        // Increment attendee count
        await db.collection('events').doc(eventId).update({
            attendeeCount: admin.firestore.FieldValue.increment(1)
        });

        // Trigger automatic confirmation email
        await sendEventConfirmation({
            to: email,
            name,
            eventTitle,
            ticketId: docRef.id
        });

        res.status(201).json({ 
            id: docRef.id, 
            message: "Successfully registered! Check your email."
        });
    } catch (error: any) {
        console.error('Registration Error:', error);
        res.status(400).json({ error: error.message });
    }
};

export const createEvent = async (req: Request, res: Response) => {
    try {
        const eventData = {
            ...req.body,
            attendeeCount: 0,
            maxAttendees: req.body.maxAttendees || 1000,
            createdAt: new Date().toISOString()
        };
        const docRef = await db.collection('events').add(eventData);
        res.status(201).json({ id: docRef.id, ...eventData });
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
};

export const updateEvent = async (req: Request, res: Response) => {
    try {
        const id = req.params.id as string;
        const updateData = {
            ...req.body,
            updatedAt: new Date().toISOString()
        };
        await db.collection('events').doc(id).update(updateData);
        res.status(200).json({ id, ...updateData });
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
};

export const getAllEvents = async (req: Request, res: Response) => {
    try {
        const snapshot = await db.collection('events')
            .orderBy('date', 'asc')
            .get();
        
        const events = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        res.json(events);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};
