import { Schema, model } from 'mongoose';

const chatSessionSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User' },
    guestId: String,
    messages: [{
        role: { type: String, enum: ['user', 'assistant'] },
        content: String,
        timestamp: { type: Date, default: Date.now }
    }],
    language: { type: String, enum: ['en', 'es', 'fr'], default: 'en' }
}, { timestamps: true });

export const ChatSession = model('ChatSession', chatSessionSchema);
