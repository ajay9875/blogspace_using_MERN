const Joi = require('joi');
const AppError = require('../utils/AppError');

const validate = (schema) => (req, res, next) => {
  const validSchema = ['body', 'params', 'query'].reduce((acc, key) => {
    if (schema[key]) {
      acc[key] = schema[key];
    }
    return acc;
  }, {});

  const { error } = Joi.object(validSchema).validate(
    ['body', 'params', 'query'].reduce((acc, key) => {
      if (schema[key]) {
        acc[key] = req[key];
      }
      return acc;
    }, {}),
    { abortEarly: false }
  );

  if (error) {
    const errorMessage = error.details.map((detail) => detail.message).join(', ');
    return next(new AppError(errorMessage, 400));
  }

  next();
};

module.exports = validate;