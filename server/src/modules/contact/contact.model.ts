import { Schema, model } from 'mongoose';

const contactMessageSchema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    subject: { type: String, default: '' },
    message: { type: String, required: true },
    status: {
        type: String,
        enum: ['NEW', 'READ', 'REPLIED'],
        default: 'NEW'
    }
}, { timestamps: true });

export const ContactMessage = model('ContactMessage', contactMessageSchema);
