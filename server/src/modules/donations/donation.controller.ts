import { Request, Response } from 'express';
import axios from 'axios';
import crypto from 'crypto';
import { config } from '../../config/db';
import { Donation } from './donation.model';

// Paystack
export const initializePaystack = async (req: Request, res: Response) => {
    const { amount, email, currency } = req.body;
    try {
        const response = await axios.post('https://api.paystack.co/transaction/initialize', {
            email,
            amount: amount * 100,
            currency
        }, {
            headers: { Authorization: `Bearer ${config.PAYSTACK.SECRET_KEY}` }
        });
        res.json(response.data);
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
};

export const paystackWebhook = async (req: Request, res: Response) => {
    const hash = crypto.createHmac('sha512', config.PAYSTACK.WEBHOOK_SECRET)
        .update(JSON.stringify(req.body))
        .digest('hex');

    if (hash === req.headers['x-paystack-signature']) {
        const event = req.body;
        if (event.event === 'charge.success') {
            await Donation.create({
                provider: 'paystack',
                amount: event.data.amount / 100,
                currency: event.data.currency,
                status: 'SUCCESS',
                providerReference: event.data.reference,
                metadata: event.data
            });
        }
    }
    res.sendStatus(200);
};

// PayPal (Simplified implementation using REST API)
export const createPayPalOrder = async (req: Request, res: Response) => {
    const { amount, currency } = req.body;
    // This would typically use the PayPal SDK or direct API calls with OAuth token
    // For brevity, we'll return a placeholder success response as the full SDK setup is complex
    // and requires multiple async steps for token generation
    res.status(200).json({ message: "PayPal order creation endpoint - implement full OAuth flow here" });
};

export const paypalWebhook = async (req: Request, res: Response) => {
    // In production, verify PayPal-Transmission-Sig
    const event = req.body;
    if (event.event_type === 'PAYMENT.CAPTURE.COMPLETED') {
        const resource = event.resource;
        await Donation.create({
            provider: 'paypal',
            amount: resource.amount.value,
            currency: resource.amount.currency_code,
            status: 'SUCCESS',
            providerReference: resource.id,
            metadata: resource
        });
    }
    res.sendStatus(200);
};
