import express from 'express';
import {
  getProperties, getProperty, createProperty, updateProperty, deleteProperty,
} from '../controllers/propertyController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.route('/')
  .get(getProperties)
  .post(protect, authorize('agent', 'admin'), createProperty);

router.route('/:id')
  .get(getProperty)
  .put(protect, updateProperty)
  .delete(protect, deleteProperty);

export default router;
