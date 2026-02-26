import { Schema, model } from 'mongoose';

const eventSchema = new Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    date: { type: Date, required: true },
    location: { type: String, required: true },
    image: String,
    registrationCount: { type: Number, default: 0 },
    timezone: { type: String, default: 'UTC' },
    language: { type: String, enum: ['en', 'es', 'fr'], default: 'en' }
}, { timestamps: true });

export const Event = model('Event', eventSchema);
