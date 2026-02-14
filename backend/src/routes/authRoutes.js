const express = require('express');
const authController = require('../controllers/authController');
const { protect } = require('../middlewares/authMiddleware');
const validate = require('../middlewares/validationMiddleware');
const authValidation = require('../validations/authValidation');

const router = express.Router();

router.post('/signup', validate(authValidation.signup), authController.signup);
router.post('/login', validate(authValidation.login), authController.login);
router.post('/refresh-token', validate(authValidation.refreshToken), authController.refreshToken);

// Protected routes
router.use(protect); // All routes below this require authentication

router.post('/logout', authController.logout);
router.get('/profile', authController.getProfile);
router.patch('/profile', validate(authValidation.updateProfile), authController.updateProfile);

module.exports = router;