import express from 'express';
import { registerUser, loginUser, getMe, getMechanics } from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public Routes
router.post('/register', registerUser);
router.post('/login', loginUser);

// Protected Routes
router.get('/me', protect, getMe);
router.get('/mechanics', protect, getMechanics);

export default router;
