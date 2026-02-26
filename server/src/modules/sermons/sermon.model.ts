import { Schema, model } from 'mongoose';

const sermonSchema = new Schema({
    title: { type: String, required: true },
    preacher: { type: String, required: true },
    videoUrl: { type: String, required: true },
    description: { type: String },
    date: { type: Date, default: Date.now },
    language: { type: String, enum: ['en', 'es', 'fr'], default: 'en' }
}, { timestamps: true });

export const Sermon = model('Sermon', sermonSchema);
