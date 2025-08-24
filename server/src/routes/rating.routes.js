import { Router } from 'express';
import { upsertRating, upsertRatingValidators, getMyRatingForStore, ownerRatings } from '../controllers/rating.controller.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

router.post('/upsert', requireAuth, upsertRatingValidators, upsertRating);
router.get('/mine/:storeId', requireAuth, getMyRatingForStore);
router.get('/owner/:storeId', requireAuth, ownerRatings);

export default router;
