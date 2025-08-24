import { body, validationResult } from 'express-validator';
import Rating from '../models/Rating.js';

export const upsertRatingValidators = [
  body('storeId').isString(),
  body('value').isInt({ min: 1, max: 5 })
];

export const upsertRating = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  const { storeId, value } = req.body;
  const rating = await Rating.findOneAndUpdate(
    { store: storeId, user: req.user.id },
    { $set: { value } },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );
  res.json({ rating });
};

export const getMyRatingForStore = async (req, res) => {
  const { storeId } = req.params;
  const rating = await Rating.findOne({ store: storeId, user: req.user.id });
  res.json({ rating });
};

export const ownerRatings = async (req, res) => {
  const { storeId } = req.params;
  // Security: only the owner of this store or admin can view
  const store = await (await import('../models/Store.js')).default.findById(storeId);
  if (!store) return res.status(404).json({ error: 'Store not found' });
  if (req.user.role !== 'admin' && store.owner?.toString() !== req.user.id) {
    return res.status(403).json({ error: 'Forbidden' });
  }
  const ratings = await Rating.find({ store: storeId }).populate('user','name email');
  const average = ratings.length ? (ratings.reduce((a, r) => a + r.value, 0) / ratings.length) : null;
  res.json({ ratings, averageRating: average, ratingCount: ratings.length });
};
