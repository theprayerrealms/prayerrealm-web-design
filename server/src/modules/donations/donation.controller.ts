import { Request, Response } from 'express';
import axios from 'axios';
import crypto from 'crypto';
import { config } from '../../config/db';
import { db } from '../../config/firebase'; // Added Firestore db
import { sendDonationThankYou, sendMonthlyRenewalConfirmation } from '../../utils/email';

// ─── Paystack ─────────────────────────────────────────────

export const initializePaystack = async (req: Request, res: Response) => {
    const { amount, email, currency, name, phone, isRecurring } = req.body;
    try {
        const paystackPayload: any = {
            email,
            amount: amount * 100,
            currency,
            metadata: {
                donor_name: name,
                donor_phone: phone,
                is_recurring: isRecurring,
            }
        };

        const response = await axios.post('https://api.paystack.co/transaction/initialize', paystackPayload, {
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
            const data = event.data;
            const meta = data.metadata || {};
            const isRecurring = meta.is_recurring === true || meta.is_recurring === 'true';
            const donorEmail = data.customer?.email || meta.donor_email || '';
            const donorName = meta.donor_name || data.customer?.first_name || 'Beloved';

            const donationData = {
                provider: 'paystack',
                amount: data.amount / 100,
                currency: data.currency,
                status: 'SUCCESS',
                isRecurring,
                donorName,
                donorEmail,
                donorPhone: meta.donor_phone || '',
                providerReference: data.reference,
                metadata: data,
                createdAt: new Date().toISOString()
            };

            await db.collection('donations').add(donationData);

            if (donorEmail) {
                await sendDonationThankYou({
                    to: donorEmail,
                    donorName,
                    amount: data.amount / 100,
                    currency: data.currency,
                    isRecurring,
                    provider: 'paystack',
                    reference: data.reference,
                });
            }
        }

        if (event.event === 'subscription.charge.success' || event.event === 'invoice.payment_success') {
            const data = event.data;
            const meta = data.metadata || {};
            const donorEmail = data.customer?.email || '';
            const donorName = meta.donor_name || data.customer?.first_name || 'Partner';

            const donationData = {
                provider: 'paystack',
                amount: data.amount / 100,
                currency: data.currency || 'NGN',
                status: 'SUCCESS',
                isRecurring: true,
                donorName,
                donorEmail,
                providerReference: data.reference || `sub_${Date.now()}`,
                metadata: data,
                createdAt: new Date().toISOString()
            };

            await db.collection('donations').add(donationData);

            if (donorEmail) {
                await sendMonthlyRenewalConfirmation({
                    to: donorEmail,
                    donorName,
                    amount: data.amount / 100,
                    currency: data.currency || 'NGN',
                    isRecurring: true,
                    provider: 'paystack',
                    reference: data.reference || `sub_${Date.now()}`,
                });
            }
        }
    }
    res.sendStatus(200);
};

// ─── PayPal ───────────────────────────────────────────────

export const createPayPalOrder = async (req: Request, res: Response) => {
    const { amount, currency, name, email, phone, isRecurring } = req.body;
    res.status(200).json({
        message: "PayPal order creation endpoint - implement full OAuth flow here",
        data: { amount, currency, name, email, phone, isRecurring }
    });
};

export const paypalWebhook = async (req: Request, res: Response) => {
    const event = req.body;

    if (event.event_type === 'PAYMENT.CAPTURE.COMPLETED') {
        const resource = event.resource;
        const donorEmail = resource.payer?.email_address || '';
        const donorName = resource.payer?.name?.given_name
            ? `${resource.payer.name.given_name} ${resource.payer.name.surname || ''}`
            : 'Beloved';

        const donationData = {
            provider: 'paypal',
            amount: resource.amount.value,
            currency: resource.amount.currency_code,
            status: 'SUCCESS',
            isRecurring: false,
            donorName,
            donorEmail,
            providerReference: resource.id,
            metadata: resource,
            createdAt: new Date().toISOString()
        };

        await db.collection('donations').add(donationData);

        if (donorEmail) {
            await sendDonationThankYou({
                to: donorEmail,
                donorName,
                amount: parseFloat(resource.amount.value),
                currency: resource.amount.currency_code,
                isRecurring: false,
                provider: 'paypal',
                reference: resource.id,
            });
        }
    }

    if (event.event_type === 'PAYMENT.SALE.COMPLETED') {
        const resource = event.resource;
        const donorEmail = resource.payer?.email_address || '';
        const donorName = resource.payer?.name?.given_name
            ? `${resource.payer.name.given_name} ${resource.payer.name.surname || ''}`
            : 'Partner';

        const donationData = {
            provider: 'paypal',
            amount: resource.amount?.total || resource.amount?.value || 0,
            currency: resource.amount?.currency || resource.amount?.currency_code || 'USD',
            status: 'SUCCESS',
            isRecurring: true,
            donorName,
            donorEmail,
            providerReference: resource.id,
            metadata: resource,
            createdAt: new Date().toISOString()
        };

        await db.collection('donations').add(donationData);

        if (donorEmail) {
            await sendMonthlyRenewalConfirmation({
                to: donorEmail,
                donorName,
                amount: parseFloat(resource.amount?.total || resource.amount?.value || '0'),
                currency: resource.amount?.currency || resource.amount?.currency_code || 'USD',
                isRecurring: true,
                provider: 'paypal',
                reference: resource.id,
            });
        }
    }

    res.sendStatus(200);
};
