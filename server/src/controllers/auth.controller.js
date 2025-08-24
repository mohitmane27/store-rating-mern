import { validationResult, body } from 'express-validator';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { passwordRegex } from '../utils/password.js';

export const signupValidators = [
  body('name').isString().isLength({ min: 20, max: 60 }).withMessage('Name must be 20-60 chars'),
  body('email').isEmail().withMessage('Invalid email'),
  body('address').optional().isString().isLength({ max: 400 }),
  body('password').matches(passwordRegex).withMessage('Password 8-16 with uppercase & special char')
];

export const loginValidators = [
  body('email').isEmail(),
  body('password').isString().isLength({ min: 1 })
];

const signToken = (user) => {
  return jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

export const signup = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  const { name, email, password, address } = req.body;
  const existing = await User.findOne({ email });
  if (existing) return res.status(400).json({ error: 'Email already in use' });
  const passwordHash = await bcrypt.hash(password, 10);
  const user = await User.create({ name, email, passwordHash, address, role: 'user' });
  const token = signToken(user);
  res.cookie('token', token, { httpOnly: true, sameSite: 'lax' });
  res.json({ user: { id: user._id, name: user.name, email: user.email, role: user.role } });
};

export const login = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ error: 'Invalid credentials' });
  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) return res.status(400).json({ error: 'Invalid credentials' });
  const token = signToken(user);
  res.cookie('token', token, { httpOnly: true, sameSite: 'lax' });
  res.json({ user: { id: user._id, name: user.name, email: user.email, role: user.role } });
};

export const me = async (req, res) => {
  const user = await User.findById(req.user.id).select('-passwordHash');
  res.json({ user });
};

export const logout = async (req, res) => {
  res.clearCookie('token');
  res.json({ ok: true });
};

export const changePasswordValidators = [
  body('oldPassword').isString(),
  body('newPassword').matches(passwordRegex).withMessage('Password 8-16 with uppercase & special char')
];

export const changePassword = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  const { oldPassword, newPassword } = req.body;
  const user = await User.findById(req.user.id);
  const ok = await bcrypt.compare(oldPassword, user.passwordHash);
  if (!ok) return res.status(400).json({ error: 'Old password incorrect' });
  user.passwordHash = await bcrypt.hash(newPassword, 10);
  await user.save();
  res.json({ ok: true });
};
