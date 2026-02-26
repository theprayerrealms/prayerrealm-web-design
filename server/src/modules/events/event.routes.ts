import { Router } from 'express';
import { createEvent, getAllEvents } from './event.controller';
import { protect, authorize } from '../../middlewares/auth.middleware';

const router = Router();

router.post('/', protect, authorize('ADMIN'), createEvent);
router.get('/', getAllEvents);

export default router;
