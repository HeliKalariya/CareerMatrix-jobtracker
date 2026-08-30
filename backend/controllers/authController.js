import User from '../models/User.js';
import jwt from 'jsonwebtoken';

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

export const registerUser = async (req, res) => {
  const name = req.body.name?.trim();
  const email = req.body.email?.trim().toLowerCase();
  const { password } = req.body;
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Please fill all fields' });
  }
  if (name.length < 2) return res.status(400).json({ message: 'Name must be at least 2 characters' });
  if (!emailPattern.test(email)) return res.status(400).json({ message: 'Enter a valid email address' });
  if (password.length < 8 || !/[A-Z]/.test(password) || !/[0-9]/.test(password)) return res.status(400).json({ message: 'Password must be 8+ characters with an uppercase letter and number' });

  const userExists = await User.findOne({ email });
  if (userExists) {
    return res.status(400).json({ message: 'User already exists' });
  }

  const user = await User.create({ name, email, password });
  const token = generateToken(user._id);

  res.status(201).json({
    _id: user._id,
    name: user.name,
    email: user.email,
    token
  });
};

export const getMe = async (req, res) => {
  res.json({
    _id: req.user._id,
    name: req.user.name,
    email: req.user.email,
    createdAt: req.user.createdAt
  });
};

export const loginUser = async (req, res) => {
  const email = req.body.email?.trim().toLowerCase();
  const { password } = req.body;

  if (!email || !password) return res.status(400).json({ message: 'Email and password are required' });

  const user = await User.findOne({ email });
  if (user && await user.comparePassword(password)) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id)
    });
  } else {
    res.status(401).json({ message: 'Invalid email or password' });
  }
};

export const updateProfile = async (req, res) => {
  const name = req.body.name?.trim();
  const email = req.body.email?.trim().toLowerCase();
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!name || name.length < 2) return res.status(400).json({ message: 'Name must be at least 2 characters' });
  if (!emailPattern.test(email)) return res.status(400).json({ message: 'Enter a valid email address' });
  const existing = await User.findOne({ email, _id: { $ne: req.user._id } });
  if (existing) return res.status(400).json({ message: 'That email address is already in use' });
  const user = await User.findByIdAndUpdate(req.user._id, { name, email }, { new: true, runValidators: true });
  res.json({ _id: user._id, name: user.name, email: user.email });
};
