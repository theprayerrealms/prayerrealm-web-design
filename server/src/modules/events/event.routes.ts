import { Router } from 'express';
import { createEvent, updateEvent, getAllEvents, registerForEvent } from './event.controller';
import { protect, authorize } from '../../middlewares/auth.middleware';

const router = Router();

router.post('/', createEvent);
router.put('/:id', updateEvent);
router.get('/', getAllEvents);
router.post('/register', registerForEvent);

export default router;
