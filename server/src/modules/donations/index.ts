import { Router } from 'express';
import { initializePaystack, paystackWebhook } from './donation.controller';
import { protect } from '../../middlewares/auth.middleware';

const router = Router();

router.post('/paystack/initialize', protect, initializePaystack);
router.post('/paystack/webhook', paystackWebhook); // Webhook usually public but verified via signature


export default router;

