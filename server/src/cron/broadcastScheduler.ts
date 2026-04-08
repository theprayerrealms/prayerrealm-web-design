import cron from 'node-cron';
import { db } from '../config/firebase';
import { sendThankYouEmail } from '../utils/email';

export const initBroadcastScheduler = () => {
    // Run every minute
    cron.schedule('* * * * *', async () => {
        try {
            const now = new Date().toISOString();
            
            // Get all pending scheduled messages that should be sent now or in the past
            const snapshot = await db.collection('scheduled_messages')
                .where('status', '==', 'pending')
                .where('send_at', '<=', now)
                .get();
                
            if (snapshot.empty) return;

            snapshot.forEach(async (doc) => {
                const job = doc.data();
                
                // Mark as processing so another cron tick doesn't pick it up concurrently
                await doc.ref.update({ status: 'processing' });
                
                try {
                    let targetEmails: any[] = [];
                    
                    if (job.target === 'checked_in') {
                        // Fetch specific event attendees
                        const attSnapshot = await db.collection('attendances').where('eventId', '==', job.event_id).get();
                        targetEmails = attSnapshot.docs.map(a => a.data());
                    } else {
                        // All registrants
                        const regSnapshot = await db.collection('registrations').where('eventId', '==', job.event_id).get();
                        targetEmails = regSnapshot.docs.map(r => r.data());
                    }

                    // Send emails
                    for (const user of targetEmails) {
                        try {
                            if (user.email) {
                                await sendThankYouEmail({
                                    to: user.email,
                                    name: user.name || 'Beloved',
                                    eventName: job.event_name || 'Our Event',
                                    messageBody: job.message_template
                                });
                            }
                        } catch (err) {
                            console.error(`Failed sending automated broadcast to ${user.email}`, err);
                        }
                    }

                    // Mark as sent
                    await doc.ref.update({ status: 'sent', processed_at: new Date().toISOString() });
                    console.log(`[Scheduled Broadcast] Job ${doc.id} completed. Sent to ${targetEmails.length} recipients.`);
                } catch (innerError: any) {
                    console.error(`Error processing scheduled broadcast ${doc.id}:`, innerError);
                    await doc.ref.update({ status: 'failed', error: innerError.message });
                }
            });
            
        } catch (error) {
            console.error('[Scheduled Broadcast] Cron check failed:', error);
        }
    });
    console.log('⏳ Broadcast Scheduler initialized. Checking every minute.');
};
