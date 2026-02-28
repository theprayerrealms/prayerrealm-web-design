import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';

import authRoutes from './modules/auth/auth.routes';
import prayerRoutes from './modules/prayers/prayer.routes';
import donationRoutes from './modules/donations';
import chatbotRoutes from './modules/chatbot/chatbot.routes';
import testimonyRoutes from './modules/testimonies/testimony.routes';
import eventRoutes from './modules/events/event.routes';
import sermonRoutes from './modules/sermons';
import volunteerRoutes from './modules/volunteers/volunteer.routes';
import adminRoutes from './modules/admin/admin.routes';
import contactRoutes from './modules/contact/contact.routes';
import { errorHandler } from './middlewares/error.middleware';

const app: Application = express();

// Security Middlewares
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Rate Limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100
});
app.use('/api/', limiter);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/prayers', prayerRoutes);
app.use('/api/donations', donationRoutes);
app.use('/api/chat', chatbotRoutes);
app.use('/api/testimonies', testimonyRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/sermons', sermonRoutes);
app.use('/api/volunteers', volunteerRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/contact', contactRoutes);

// Health Check
app.get('/health', (req, res) => res.status(200).json({ status: 'OK' }));

// Error Handler
app.use(errorHandler);

export default app;
