import { body, query, validationResult } from 'express-validator';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import { passwordRegex } from '../utils/password.js';

export const createUserValidators = [
  body('name').isString().isLength({ min: 20, max: 60 }),
  body('email').isEmail(),
  body('password').matches(passwordRegex),
  body('address').optional().isString().isLength({ max: 400 }),
  body('role').isIn(['admin', 'user', 'owner'])
];

export const createUser = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  const { name, email, password, address, role } = req.body;
  const exists = await User.findOne({ email });
  if (exists) return res.status(400).json({ error: 'Email already exists' });
  const passwordHash = await bcrypt.hash(password, 10);
  const user = await User.create({ name, email, passwordHash, address, role });
  res.json({ user: { id: user._id, name: user.name, email: user.email, address: user.address, role: user.role } });
};

export const listUsersValidators = [
  query('search').optional().isString(),
  query('role').optional().isIn(['admin', 'user', 'owner']),
  query('sortBy').optional().isIn(['name','email','address','role','createdAt']),
  query('order').optional().isIn(['asc','desc'])
];

export const listUsers = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  const { search = '', role, sortBy = 'createdAt', order = 'desc' } = req.query;
  const filter = {};
  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
      { address: { $regex: search, $options: 'i' } }
    ];
  }
  if (role) filter.role = role;
  const sort = { [sortBy]: order === 'asc' ? 1 : -1 };
  const users = await User.find(filter).select('-passwordHash').sort(sort);
  res.json({ users });
};

export const getUserById = async (req, res) => {
  const user = await User.findById(req.params.id).select('-passwordHash');
  if (!user) return res.status(404).json({ error: 'User not found' });
  res.json({ user });
};
