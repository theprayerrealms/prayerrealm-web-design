import { Router } from 'express';
import { submitTestimony, getApprovedTestimonies } from './testimony.controller';
import { protect } from '../../middlewares/auth.middleware';

const router = Router();

router.post('/', protect, submitTestimony);
router.get('/', getApprovedTestimonies);

export default router;
