import { Router } from 'express';
import { checkInUser, getAttendances, scheduleBroadcast } from './attendance.controller';

const router = Router();

router.post('/checkin', checkInUser);
router.get('/', getAttendances);
router.post('/broadcast', scheduleBroadcast);

export default router;
