const jwt = require('jsonwebtoken');
const config = require('../config/environment');
const User = require('../models/User');
const AppError = require('../utils/AppError');

class TokenService {
  generateTokens(user) {
    const accessToken = jwt.sign(
      { userId: user._id, email: user.email },
      config.jwt.secret,
      { expiresIn: config.jwt.accessExpiration }
    );

    const refreshToken = jwt.sign(
      { userId: user._id },
      config.jwt.refreshSecret,
      { expiresIn: config.jwt.refreshExpiration }
    );

    return { accessToken, refreshToken };
  }

  async saveRefreshToken(userId, refreshToken) {
    // Hash refresh token before saving for additional security
    const UserModel = require('../models/User');
    await UserModel.findByIdAndUpdate(userId, { refreshToken });
  }

  async verifyAccessToken(token) {
    try {
      const decoded = jwt.verify(token, config.jwt.secret);
      return decoded;
    } catch (error) {
      throw new AppError('Invalid or expired access token', 401);
    }
  }

  async verifyRefreshToken(token) {
    try {
      const decoded = jwt.verify(token, config.jwt.refreshSecret);
      
      // Check if refresh token exists in database
      const user = await User.findById(decoded.userId).select('+refreshToken');
      if (!user || user.refreshToken !== token) {
        throw new AppError('Invalid refresh token', 401);
      }
      
      return decoded;
    } catch (error) {
      throw new AppError('Invalid or expired refresh token', 401);
    }
  }

  async refreshAccessToken(refreshToken) {
    const decoded = await this.verifyRefreshToken(refreshToken);
    const user = await User.findById(decoded.userId);
    
    if (!user || !user.isActive) {
      throw new AppError('User not found or inactive', 401);
    }

    const tokens = this.generateTokens(user);
    await this.saveRefreshToken(user._id, tokens.refreshToken);
    
    return tokens;
  }
}

module.exports = new TokenService();