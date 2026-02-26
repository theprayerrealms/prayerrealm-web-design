import { Schema, model } from 'mongoose';

const testimonySchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User' },
    name: { type: String, required: true },
    content: { type: String, required: true },
    status: {
        type: String,
        enum: ['PENDING', 'APPROVED', 'REJECTED'],
        default: 'PENDING'
    },
    language: { type: String, enum: ['en', 'es', 'fr'], default: 'en' }
}, { timestamps: true });

export const Testimony = model('Testimony', testimonySchema);
