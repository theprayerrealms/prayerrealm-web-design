import { Schema, model } from 'mongoose';

const volunteerApplicationSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User' },
    fullName: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    interests: [String],
    availability: String,
    message: String,
    status: {
        type: String,
        enum: ['PENDING', 'REVIEWED', 'ACCEPTED', 'REJECTED'],
        default: 'PENDING'
    }
}, { timestamps: true });

export const VolunteerApplication = model('VolunteerApplication', volunteerApplicationSchema);
