import { Request, Response } from 'express';
import { db } from '../../config/firebase';
import admin from 'firebase-admin';

export const checkInUser = async (req: Request, res: Response): Promise<void> => {
    const { eventId, uid, email, name, phone } = req.body;

    if (!eventId || !uid || !email || !name) {
        res.status(400).json({ error: 'Missing required fields' });
        return;
    }

    try {
        // Find existing user in 'attendee_users' collection
        const userRef = db.collection('attendee_users').doc(uid);
        const userDoc = await userRef.get();

        let userData: any;

        if (userDoc.exists) {
            userData = userDoc.data();
            // If the user doesn't have a phone and didn't provide one this time, require it
            if (!userData.phone && !phone) {
                res.status(200).json({ requirePhone: true });
                return;
            }
            
            // If a new phone is provided, update the user
            if (phone && !userData.phone) {
                await userRef.update({ phone, updatedAt: new Date().toISOString() });
                userData.phone = phone;
            }
        } else {
            // First time ever checking into any event, user doc does not exist
            if (!phone) {
                res.status(200).json({ requirePhone: true });
                return;
            }
            
            userData = {
                uid,
                email,
                name,
                phone,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            };
            await userRef.set(userData);
        }

        // Now record attendance for this specific event
        const attendanceRef = db.collection('attendances').doc(`${eventId}_${uid}`);
        const attendanceDoc = await attendanceRef.get();

        if (attendanceDoc.exists) {
            // Already checked in
            res.status(200).json({ message: 'Already checked in', status: 'ALREADY_CHECKED_IN', user: userData });
            return;
        }

        // Add to attendances table
        await attendanceRef.set({
            eventId,
            uid,
            email,
            name,
            phone: userData.phone || phone,
            timeCheckedIn: new Date().toISOString()
        });

        // Optionally update the event checkInCount
        const eventRef = db.collection('events').doc(eventId);
        try {
            await eventRef.update({
                checkInCount: admin.firestore.FieldValue.increment(1)
            });
        } catch (err) {
            console.log('Event checkInCount could not be updated (might not exist yet):', err);
        }

        res.status(200).json({ message: 'Successfully checked in', status: 'SUCCESS', user: userData });
    } catch (error: any) {
        console.error('Checkin Error:', error);
        res.status(500).json({ error: error.message });
    }
};

export const getAttendances = async (req: Request, res: Response): Promise<void> => {
    try {
        const snapshot = await db.collection('attendances')
            .orderBy('timeCheckedIn', 'desc')
            .get();
        
        const docs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        res.json(docs);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const scheduleBroadcast = async (req: Request, res: Response): Promise<void> => {
    const { event_id, event_name, send_at, target, message_template, channel } = req.body;

    if (!event_id || !send_at || !message_template) {
        res.status(400).json({ error: 'Missing required configuration for broadcast' });
        return;
    }

    try {
        const docRef = await db.collection('scheduled_messages').add({
            event_id,
            event_name: event_name || 'Event',
            send_at, // Expected ISO String
            target: target || 'checked_in',
            channel: channel || 'email',
            message_template,
            status: 'pending',
            created_at: new Date().toISOString()
        });

        res.status(201).json({ 
            id: docRef.id, 
            message: 'Broadcast scheduled successfully' 
        });
    } catch (error: any) {
        console.error('Schedule Broadcast Error:', error);
        res.status(500).json({ error: error.message });
    }
};
