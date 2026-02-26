import { connectDB, config } from './config/db';
import app from './app';

const startServer = async () => {
    await connectDB();

    app.listen(config.PORT, () => {
        console.log(`Server running in ${config.NODE_ENV} mode on port ${config.PORT}`);
    });
};

startServer();
