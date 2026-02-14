const mongoose = require('mongoose');
const app = require('./app');
const config = require('./src/config/environment');
const connectDB = require('./src/config/database');
const logger = require('./src/config/logger');

let server;

// Graceful shutdown function
const gracefulShutdown = (signal) => {
    logger.info(`${signal} received. Starting graceful shutdown...`);

    if (server) {
        server.close(() => {
            logger.info('HTTP server closed.');

            // Close database connection
            mongoose.connection.close(false, () => {
                logger.info('MongoDB connection closed.');
                process.exit(0);
            });
        });
    } else {
        process.exit(0);
    }

    // Force shutdown after 10 seconds if graceful shutdown fails
    setTimeout(() => {
        logger.error('Could not close connections in time, forcefully shutting down');
        process.exit(1);
    }, 10000);
};

// Start server
const startServer = async () => {
    try {
        // Connect to database
        await connectDB();

        // Start listening
        server = app.listen(config.port, () => {
            logger.info(`Server running on port ${config.port} in ${config.env} mode`);
        });

        // Handle unhandled rejections
        process.on('unhandledRejection', (err) => {
            logger.error('UNHANDLED REJECTION! 💥 Shutting down...');
            logger.error(err.name, err.message);
            gracefulShutdown('Unhandled Rejection');
        });

        // Handle uncaught exceptions
        process.on('uncaughtException', (err) => {
            logger.error('UNCAUGHT EXCEPTION! 💥 Shutting down...');
            logger.error('Error name:', err.name);
            logger.error('Error message:', err.message);
            logger.error('Error stack:', err.stack);  // Add this line
            console.error('Full error:', err); // Also log to console
            process.exit(1);
        });

        // Graceful shutdown handlers
        process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
        process.on('SIGINT', () => gracefulShutdown('SIGINT'));

    } catch (error) {
        logger.error('Failed to start server:', error);
        process.exit(1);
    }
};

startServer();