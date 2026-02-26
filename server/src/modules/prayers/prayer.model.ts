import { Schema, model } from 'mongoose';

const prayerRequestSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: false },
    name: { type: String, required: true },
    email: { type: String },
    title: { type: String, required: true },
    content: { type: String, required: true },
    isPublic: { type: Boolean, default: true },
    status: {
        type: String,
        enum: ['PENDING', 'APPROVED', 'REJECTED'],
        default: 'PENDING'
    },
    prayerCount: { type: Number, default: 0 },
    language: {
        type: String,
        enum: ['en', 'es', 'fr'],
        default: 'en'
    }
}, { timestamps: true });

export const PrayerRequest = model('PrayerRequest', prayerRequestSchema);
