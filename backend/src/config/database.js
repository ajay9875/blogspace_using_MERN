const mongoose = require('mongoose');
const config = require('./environment');
const logger = require('./logger');

const connectDB = async () => {
  try {
    await mongoose.connect(config.mongoose.url, config.mongoose.options);
    logger.info('MongoDB connected successfully');
  } catch (error) {
    logger.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

module.exports = connectDB;