import { Schema, model } from 'mongoose';

const donationSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User' },
    provider: { type: String, enum: ['paystack', 'paypal'], required: true },
    amount: { type: Number, required: true },
    currency: { type: String, required: true },
    country: { type: String },
    status: {
        type: String,
        enum: ['PENDING', 'SUCCESS', 'FAILED'],
        default: 'PENDING'
    },
    providerReference: { type: String, unique: true },
    metadata: Object
}, { timestamps: true });

export const Donation = model('Donation', donationSchema);
