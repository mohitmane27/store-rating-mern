import { Router } from 'express';
import { dashboard } from '../controllers/admin.controller.js';
import { requireAuth, requireRole } from '../middleware/auth.js';

const router = Router();

router.get('/dashboard', requireAuth, requireRole('admin'), dashboard);

export default router;
