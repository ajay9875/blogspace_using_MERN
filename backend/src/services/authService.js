const User = require('../models/User');
const tokenService = require('./tokenService');
const AppError = require('../utils/AppError');

class AuthService {
  async signup(userData) {
    const { name, email, password } = userData;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new AppError('Email already registered', 409);
    }

    // Create new user
    const user = await User.create({
      name,
      email,
      password,
    });

    // Generate tokens
    const tokens = tokenService.generateTokens(user);
    await tokenService.saveRefreshToken(user._id, tokens.refreshToken);

    return { user, tokens };
  }

  async login(email, password) {
    // Find user with password field
    const user = await User.findOne({ email }).select('+password');
    
    if (!user) {
      throw new AppError('Invalid email or password', 401);
    }

    // Check if user is active
    if (!user.isActive) {
      throw new AppError('Account is deactivated', 403);
    }

    // Verify password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      throw new AppError('Invalid email or password', 401);
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    // Generate tokens
    const tokens = tokenService.generateTokens(user);
    await tokenService.saveRefreshToken(user._id, tokens.refreshToken);

    return { user, tokens };
  }

  async logout(userId, refreshToken) {
    // Clear refresh token from database
    await User.findByIdAndUpdate(userId, { refreshToken: null });
  }

  async refreshToken(refreshToken) {
    return await tokenService.refreshAccessToken(refreshToken);
  }

  async getProfile(userId) {
    const user = await User.findById(userId);
    if (!user) {
      throw new AppError('User not found', 404);
    }
    return user;
  }

  async updateProfile(userId, updateData) {
    const { name, email } = updateData;
    
    // Check if email is already taken by another user
    if (email) {
      const existingUser = await User.findOne({ email, _id: { $ne: userId } });
      if (existingUser) {
        throw new AppError('Email already in use', 409);
      }
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { name, email },
      { new: true, runValidators: true }
    );

    if (!user) {
      throw new AppError('User not found', 404);
    }

    return user;
  }
}

module.exports = new AuthService();