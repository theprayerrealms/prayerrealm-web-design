import { Router } from 'express';
import { createPrayerRequest, getPublicPrayers } from './prayer.controller';
import { protect } from '../../middlewares/auth.middleware';

const router = Router();

router.post('/', protect, createPrayerRequest);
router.get('/public', getPublicPrayers);

export default router;
