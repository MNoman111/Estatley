import User from '../models/User.js';
import Property from '../models/Property.js';

// GET /api/users/:id  (public agent profile)
export const getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-favorites');
    if (!user) return res.status(404).json({ message: 'User not found' });
    const listings = await Property.find({ agent: user._id }).sort({ createdAt: -1 });
    res.json({ user, listings });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// PUT /api/users/profile
export const updateProfile = async (req, res) => {
  try {
    const { name, phone, agency, about, avatar } = req.body;
    const user = req.user;
    if (name) user.name = name;
    if (phone !== undefined) user.phone = phone;
    if (agency !== undefined) user.agency = agency;
    if (about !== undefined) user.about = about;
    if (avatar) user.avatar = avatar;
    await user.save();
    res.json({ user });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// GET /api/users/me/favorites
export const getFavorites = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate({
      path: 'favorites',
      populate: { path: 'agent', select: 'name avatar agency' },
    });
    res.json(user.favorites);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST /api/users/me/favorites/:propertyId  (toggle)
export const toggleFavorite = async (req, res) => {
  try {
    const { propertyId } = req.params;
    const user = await User.findById(req.user._id);
    const idx = user.favorites.findIndex((f) => f.toString() === propertyId);
    let favorited;
    if (idx >= 0) {
      user.favorites.splice(idx, 1);
      favorited = false;
    } else {
      user.favorites.push(propertyId);
      favorited = true;
    }
    await user.save();
    res.json({ favorited, favorites: user.favorites });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// GET /api/users/me/listings
export const getMyListings = async (req, res) => {
  try {
    const listings = await Property.find({ agent: req.user._id }).sort({ createdAt: -1 });
    res.json(listings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
