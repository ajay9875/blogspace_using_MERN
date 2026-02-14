const authService = require('../services/authService');
const catchAsync = require('../utils/catchAsync');

const signup = catchAsync(async (req, res) => {
  const { user, tokens } = await authService.signup(req.body);
  
  res.status(201).json({
    success: true,
    data: {
      user,
      tokens,
    },
  });
});

const login = catchAsync(async (req, res) => {
  const { email, password } = req.body;
  const { user, tokens } = await authService.login(email, password);
  
  res.json({
    success: true,
    data: {
      user,
      tokens,
    },
  });
});

const logout = catchAsync(async (req, res) => {
  const { refreshToken } = req.body;
  await authService.logout(req.user._id, refreshToken);
  
  res.json({
    success: true,
    message: 'Logged out successfully',
  });
});

const refreshToken = catchAsync(async (req, res) => {
  const { refreshToken } = req.body;
  const tokens = await authService.refreshToken(refreshToken);
  
  res.json({
    success: true,
    data: {
      tokens,
    },
  });
});

const getProfile = catchAsync(async (req, res) => {
  const user = await authService.getProfile(req.user._id);
  
  res.json({
    success: true,
    data: {
      user,
    },
  });
});

const updateProfile = catchAsync(async (req, res) => {
  const user = await authService.updateProfile(req.user._id, req.body);
  
  res.json({
    success: true,
    data: {
      user,
    },
  });
});

module.exports = {
  signup,
  login,
  logout,
  refreshToken,
  getProfile,
  updateProfile,
};