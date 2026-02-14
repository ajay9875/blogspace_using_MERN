const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const rateLimit = require('express-rate-limit');
const morgan = require('morgan');
const config = require('./src/config/environment');
const logger = require('./src/config/logger');
const authRoutes = require('./src/routes/authRoutes');
const errorHandler = require('./src/middlewares/errorMiddleware');
const AppError = require('./src/utils/AppError');

const app = express();

if (config.env !== 'test') {
    app.use(morgan('combined', { stream: { write: (message) => logger.info(message.trim()) } }));
}

// Set security HTTP headers
app.use(helmet());

// Enable CORS
app.use(cors({
    origin: config.clientUrl,
    credentials: true,
    optionsSuccessStatus: 200,
}));

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again later.',
});
app.use('/api', limiter);

// Body parser
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// API routes
app.use('/api/auth', authRoutes);

// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// 404 handler
app.all('*', (req, res, next) => {
    next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// Global error handler
app.use(errorHandler);

module.exports = app;