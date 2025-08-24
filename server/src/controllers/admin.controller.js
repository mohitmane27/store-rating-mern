import User from '../models/User.js';
import Store from '../models/Store.js';
import Rating from '../models/Rating.js';

export const dashboard = async (req, res) => {
  const [users, stores, ratings] = await Promise.all([
    User.countDocuments(),
    Store.countDocuments(),
    Rating.countDocuments()
  ]);
  res.json({ totalUsers: users, totalStores: stores, totalRatings: ratings });
};
