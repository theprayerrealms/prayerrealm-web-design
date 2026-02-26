import { Router } from 'express';
import { getDashboardStats, updatePrayerStatus } from './admin.controller';
import { protect, authorize } from '../../middlewares/auth.middleware';

const router = Router();

router.use(protect, authorize('ADMIN', 'MODERATOR'));

router.get('/stats', getDashboardStats);
router.patch('/prayers/:id/status', updatePrayerStatus);

export default router;
