import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

export const config = {
    NODE_ENV: process.env.NODE_ENV || 'development',
    PORT: process.env.PORT || 5000,
    MONGODB_URI: process.env.MONGODB_URI || 'mongodb://localhost:27017/prayerrealm',
    JWT: {
        ACCESS_SECRET: process.env.JWT_ACCESS_SECRET || 'access_secret',
        REFRESH_SECRET: process.env.JWT_REFRESH_SECRET || 'refresh_secret',
        ACCESS_EXPIRATION: process.env.JWT_ACCESS_EXPIRATION || '15m',
        REFRESH_EXPIRATION: process.env.JWT_REFRESH_EXPIRATION || '7d',
    },
    PAYSTACK: {
        SECRET_KEY: process.env.PAYSTACK_SECRET_KEY || '',
        WEBHOOK_SECRET: process.env.PAYSTACK_WEBHOOK_SECRET || '',
    },
    PAYPAL: {
        CLIENT_ID: process.env.PAYPAL_CLIENT_ID || '',
        CLIENT_SECRET: process.env.PAYPAL_CLIENT_SECRET || '',
        WEBHOOK_ID: process.env.PAYPAL_WEBHOOK_ID || '',
    },
    GEMINI: {
        API_KEY: process.env.GEMINI_API_KEY || '',
    },
    SMTP: {
        HOST: process.env.SMTP_HOST || '',
        PORT: parseInt(process.env.SMTP_PORT || '587'),
        USER: process.env.SMTP_USER || '',
        PASS: process.env.SMTP_PASS || '',
        FROM: process.env.FROM_EMAIL || '',
    },
};

export const connectDB = async () => {
    try {
        await mongoose.connect(config.MONGODB_URI);
        console.log('MongoDB Connected...');
    } catch (err) {
        console.error('Failed to connect to MongoDB', err);
        process.exit(1);
    }
};
