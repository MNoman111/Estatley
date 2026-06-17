import express from 'express';
import {
  getUser, updateProfile, getFavorites, toggleFavorite, getMyListings,
} from '../controllers/userController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.put('/profile', protect, updateProfile);
router.get('/me/favorites', protect, getFavorites);
router.post('/me/favorites/:propertyId', protect, toggleFavorite);
router.get('/me/listings', protect, getMyListings);
router.get('/:id', getUser);

export default router;
