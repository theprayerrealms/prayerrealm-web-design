import app from './app';
import { config } from './config/db';
import './config/firebase'; // Ensure Firebase is initialized
import { initBroadcastScheduler } from './cron/broadcastScheduler';

const startServer = async () => {
    app.listen(config.PORT, () => {
        console.log(`Server running in ${config.NODE_ENV} mode on port ${config.PORT}`);
        console.log('Firebase Backend Ready');
        initBroadcastScheduler();
    });
};

startServer();
