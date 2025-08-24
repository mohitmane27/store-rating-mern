import { Router } from 'express';
import { createStore, listStores, getStoreWithRatings, createStoreValidators, listStoresValidators } from '../controllers/store.controller.js';
import { requireAuth, requireRole } from '../middleware/auth.js';

const router = Router();

router.post('/', requireAuth, requireRole('admin'), createStoreValidators, createStore);
router.get('/', requireAuth, listStoresValidators, listStores);
router.get('/:id', requireAuth, getStoreWithRatings);

export default router;
