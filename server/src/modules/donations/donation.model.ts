import { Schema, model } from 'mongoose';

const donationSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User' },
    donorName: { type: String, default: '' },
    donorEmail: { type: String, default: '' },
    donorPhone: { type: String, default: '' },
    provider: { type: String, enum: ['paystack', 'paypal'], required: true },
    amount: { type: Number, required: true },
    currency: { type: String, required: true },
    country: { type: String },
    isRecurring: { type: Boolean, default: false },
    status: {
        type: String,
        enum: ['PENDING', 'SUCCESS', 'FAILED'],
        default: 'PENDING'
    },
    providerReference: { type: String, unique: true },
    metadata: Object
}, { timestamps: true });

export const Donation = model('Donation', donationSchema);
