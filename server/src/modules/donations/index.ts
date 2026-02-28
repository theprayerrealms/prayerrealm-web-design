import { Router } from 'express';
import { initializePaystack, paystackWebhook, createPayPalOrder, paypalWebhook } from './donation.controller';
import { protect } from '../../middlewares/auth.middleware';

const router = Router();

// Paystack
router.post('/paystack/initialize', protect, initializePaystack);
router.post('/paystack/webhook', paystackWebhook); // Public but verified via HMAC signature

// PayPal
router.post('/paypal/create-order', protect, createPayPalOrder);
router.post('/paypal/webhook', paypalWebhook); // Public but verified via PayPal headers

export default router;
