import { Router } from 'express';
import { createUser, listUsers, getUserById, createUserValidators, listUsersValidators } from '../controllers/user.controller.js';
import { requireAuth, requireRole } from '../middleware/auth.js';

const router = Router();

router.post('/', requireAuth, requireRole('admin'), createUserValidators, createUser);
router.get('/', requireAuth, requireRole('admin'), listUsersValidators, listUsers);
router.get('/:id', requireAuth, requireRole('admin'), getUserById);

export default router;
