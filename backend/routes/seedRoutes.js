import express from 'express';
import { seedDatabase } from '../seed/seedData.js';

const router = express.Router();

// POST /api/seed?secret=...   (or header x-seed-secret)
// One-off convenience endpoint to populate a freshly deployed database.
// Guarded by the SEED_SECRET env var. WARNING: wipes existing data.
router.post('/', async (req, res) => {
  const provided = req.query.secret || req.headers['x-seed-secret'];
  if (!process.env.SEED_SECRET) {
    return res.status(403).json({ message: 'Seeding is disabled. Set SEED_SECRET to enable.' });
  }
  if (provided !== process.env.SEED_SECRET) {
    return res.status(401).json({ message: 'Invalid seed secret' });
  }
  try {
    const result = await seedDatabase();
    res.json({ message: 'Database seeded', ...result });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
