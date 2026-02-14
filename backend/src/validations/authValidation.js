const Joi = require('joi');

const signup = {
  body: Joi.object().keys({
    name: Joi.string().min(2).max(50).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).max(50).required(),
    confirmPassword: Joi.string().valid(Joi.ref('password')).required().messages({
      'any.only': 'Passwords do not match'
    }),
  }),
};

const login = {
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),
};

const refreshToken = {
  body: Joi.object().keys({
    refreshToken: Joi.string().required(),
  }),
};

const updateProfile = {
  body: Joi.object().keys({
    name: Joi.string().min(2).max(50),
    email: Joi.string().email(),
  }),
};

module.exports = {
  signup,
  login,
  refreshToken,
  updateProfile,
};