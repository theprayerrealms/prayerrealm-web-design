import { Router } from 'express';
import { submitContactForm, getContactMessages } from './contact.controller';
import { protect, authorize } from '../../middlewares/auth.middleware';

const router = Router();

// Public — anyone can submit a contact form
router.post('/', submitContactForm);

// Admin only — view all contact messages
router.get('/', protect, authorize('ADMIN', 'MODERATOR'), getContactMessages);

export default router;
