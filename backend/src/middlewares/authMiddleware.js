const tokenService = require('../services/tokenService');
const User = require('../models/User');
const AppError = require('../utils/AppError');
const catchAsync = require('../utils/catchAsync');

const protect = catchAsync(async (req, res, next) => {
  // Get token from header
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(new AppError('Please authenticate', 401));
  }

  // Verify token
  const decoded = await tokenService.verifyAccessToken(token);
  
  // Check if user still exists
  const user = await User.findById(decoded.userId);
  if (!user) {
    return next(new AppError('User no longer exists', 401));
  }

  // Check if user is active
  if (!user.isActive) {
    return next(new AppError('Account is deactivated', 403));
  }

  // Add user to request
  req.user = user;
  next();
});

module.exports = { protect };