import { Router } from 'express';
import { 
    getDashboardStats, 
    updatePrayerStatus, 
    getAllRegistrations, 
    getAllTestimonies,
    getAllPrayers,
    updateTestimonyStatus,
    deleteRegistration,
    deletePrayer,
    deleteTestimony,
    deleteEvent
} from './admin.controller';

const router = Router();

// Stats
router.get('/stats', getDashboardStats);

// Registrations
router.get('/registrations', getAllRegistrations);
router.delete('/registrations/:id', deleteRegistration);

// Testimonies
router.get('/testimonies', getAllTestimonies);
router.patch('/testimonies/:id/status', updateTestimonyStatus);
router.delete('/testimonies/:id', deleteTestimony);

// Prayers
router.get('/prayers', getAllPrayers);
router.patch('/prayers/:id/status', updatePrayerStatus);
router.delete('/prayers/:id', deletePrayer);

// Events
router.delete('/events/:id', deleteEvent);

export default router;
