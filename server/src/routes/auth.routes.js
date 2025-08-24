import { Router } from 'express';
import { signup, login, logout, me, changePassword, signupValidators, loginValidators, changePasswordValidators } from '../controllers/auth.controller.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

router.post('/signup', signupValidators, signup);
router.post('/login', loginValidators, login);
router.post('/logout', requireAuth, logout);
router.get('/me', requireAuth, me);
router.post('/change-password', requireAuth, changePasswordValidators, changePassword);

export default router;
