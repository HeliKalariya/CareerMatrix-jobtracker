import express from 'express';
import protect from '../middleware/auth.js';
import { registerUser, loginUser, getMe, updateProfile } from '../controllers/authController.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/me', protect, getMe);
router.put('/profile', protect, updateProfile);

export default router;
