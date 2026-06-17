import User from '../models/User.js';
import { signToken } from '../utils/token.js';

const sanitize = (user) => ({
  _id: user._id,
  name: user.name,
  email: user.email,
  phone: user.phone,
  role: user.role,
  avatar: user.avatar,
  agency: user.agency,
  about: user.about,
  favorites: user.favorites,
});

// POST /api/auth/register
export const register = async (req, res) => {
  try {
    const { name, email, password, phone, role, agency } = req.body;
    if (!name || !email || !password)
      return res.status(400).json({ message: 'Name, email and password are required' });

    const exists = await User.findOne({ email });
    if (exists) return res.status(409).json({ message: 'Email already registered' });

    const user = await User.create({
      name,
      email,
      password,
      phone,
      agency,
      role: role === 'agent' ? 'agent' : 'user',
      avatar: `https://ui-avatars.com/api/?background=1f7a4d&color=fff&name=${encodeURIComponent(name)}`,
    });

    res.status(201).json({ token: signToken(user._id), user: sanitize(user) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST /api/auth/login
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.matchPassword(password)))
      return res.status(401).json({ message: 'Invalid email or password' });

    res.json({ token: signToken(user._id), user: sanitize(user) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/auth/me
export const getMe = async (req, res) => {
  res.json({ user: sanitize(req.user) });
};
