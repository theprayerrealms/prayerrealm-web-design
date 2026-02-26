import { Router } from 'express';
import { createSermon, getSermons } from './sermon.controller';
import { protect, authorize } from '../../middlewares/auth.middleware';

const router = Router();

router.post('/', protect, authorize('ADMIN'), createSermon);
router.get('/', getSermons);

export default router;
