import { Router } from 'express';
import { applyAsVolunteer, getApplications } from './volunteer.controller';
import { protect, authorize } from '../../middlewares/auth.middleware';

const router = Router();

router.post('/', protect, applyAsVolunteer);
router.get('/', protect, authorize('ADMIN', 'MODERATOR'), getApplications);

export default router;
