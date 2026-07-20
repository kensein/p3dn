// routes/authRoutes.js
import express from 'express';
import {
  register,
  login,
  getProfile,
  forgotPassword,
  resetPassword,
} from '../controllers/authController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

// Public routes
router.post('/register', register);
router.post('/login', login);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

// Protected routes (butuh token)
router.get('/profile', authMiddleware, getProfile);

export default router;
