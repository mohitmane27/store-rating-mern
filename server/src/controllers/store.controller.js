import { body, query, validationResult } from 'express-validator';
import Store from '../models/Store.js';
import Rating from '../models/Rating.js';

export const createStoreValidators = [
  body('name').isString().isLength({ min: 1, max: 120 }),
  body('email').isEmail(),
  body('address').isString().isLength({ max: 400 }),
  body('ownerId').optional().isString()
];

export const createStore = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  const { name, email, address, ownerId } = req.body;
  const exists = await Store.findOne({ email });
  if (exists) return res.status(400).json({ error: 'Store email already exists' });
  const store = await Store.create({ name, email, address, owner: ownerId || null });
  res.json({ store });
};

export const listStoresValidators = [
  query('search').optional().isString(),
  query('sortBy').optional().isIn(['name','email','address','createdAt','rating']),
  query('order').optional().isIn(['asc','desc'])
];

export const listStores = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  const { search = '', sortBy = 'createdAt', order = 'desc' } = req.query;

  // Build match filter
  const match = {};
  if (search) {
    match.$or = [
      { name: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
      { address: { $regex: search, $options: 'i' } }
    ];
  }

  const pipeline = [
    { $match: match },
    { $lookup: {
        from: 'ratings',
        localField: '_id',
        foreignField: 'store',
        as: 'ratings'
    }},
    { $addFields: {
        ratingCount: { $size: '$ratings' },
        averageRating: { $cond: [{ $gt: [{ $size: '$ratings' }, 0] }, { $avg: '$ratings.value' }, null] }
    }},
    { $project: { ratings: 0 } }
  ];

  let sortField = sortBy === 'rating' ? 'averageRating' : sortBy;
  pipeline.push({ $sort: { [sortField]: (order === 'asc' ? 1 : -1) } });

  const stores = await Store.aggregate(pipeline);
  res.json({ stores });
};

export const getStoreWithRatings = async (req, res) => {
  const storeId = req.params.id;
  const store = await Store.findById(storeId);
  if (!store) return res.status(404).json({ error: 'Store not found' });

  const ratings = await Rating.find({ store: storeId }).populate('user','name email');
  const average = ratings.length ? (ratings.reduce((a, r) => a + r.value, 0) / ratings.length) : null;
  res.json({ store, ratings, averageRating: average, ratingCount: ratings.length });
};
