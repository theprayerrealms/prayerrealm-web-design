import { Schema, model } from 'mongoose';

const volunteerApplicationSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User' },
    fullName: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    countryCode: { type: String, default: '+1' },
    country: { type: String, required: true },
    interests: [String],
    availability: String,
    coverLetter: { type: String, default: '' },
    cvUrl: { type: String, default: '' },  // URL to uploaded CV/portfolio
    message: String,
    status: {
        type: String,
        enum: ['PENDING', 'REVIEWED', 'ACCEPTED', 'REJECTED'],
        default: 'PENDING'
    }
}, { timestamps: true });

export const VolunteerApplication = model('VolunteerApplication', volunteerApplicationSchema);
