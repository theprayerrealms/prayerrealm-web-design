import { Router } from 'express';
import { handleChat } from './chatbot.controller';
import { protect } from '../../middlewares/auth.middleware';
import rateLimit from 'express-rate-limit';

const chatLimiter = rateLimit({
    windowMs: 60 * 60 * 1000,
    max: 20,
    message: "Too many requests from this IP, please try again after an hour"
});

const router = Router();

router.post('/', chatLimiter, handleChat);

export default router;
