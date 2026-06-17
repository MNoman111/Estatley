import express from 'express';
import { seedDatabase } from '../seed/seedData.js';

const router = express.Router();

// Seeds the database. Guarded by the SEED_SECRET env var. WARNING: wipes existing data.
// Works via POST (curl/Postman) OR GET (just open the URL in a browser):
//   https://<your-app>.vercel.app/api/seed?secret=YOUR_SECRET
const handler = async (req, res) => {
  const provided = req.query.secret || req.headers['x-seed-secret'];
  if (!process.env.SEED_SECRET) {
    return res.status(403).json({ message: 'Seeding is disabled. Set SEED_SECRET to enable.' });
  }
  if (provided !== process.env.SEED_SECRET) {
    return res.status(401).json({ message: 'Invalid or missing seed secret. Add ?secret=YOUR_SECRET to the URL.' });
  }
  try {
    const result = await seedDatabase();
    res.json({ message: '✅ Database seeded successfully', ...result });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

router.get('/', handler);
router.post('/', handler);

export default router;
