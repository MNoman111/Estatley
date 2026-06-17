import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import propertyRoutes from './routes/propertyRoutes.js';
import userRoutes from './routes/userRoutes.js';
import seedRoutes from './routes/seedRoutes.js';

dotenv.config();

const app = express();
app.use(cors({ origin: process.env.CLIENT_URL || '*' }));
app.use(express.json({ limit: '2mb' }));

// Ensure DB is connected before handling any API request (lazy + cached).
// On Vercel each cold start reuses the cached connection from config/db.js.
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    console.error('DB connection failed:', err.message);
    res.status(503).json({ message: 'Database connection failed' });
  }
});

app.get('/api/health', (req, res) => res.json({ status: 'ok', time: new Date() }));
app.use('/api/auth', authRoutes);
app.use('/api/properties', propertyRoutes);
app.use('/api/users', userRoutes);
app.use('/api/seed', seedRoutes);

app.use('/api', (req, res) => res.status(404).json({ message: 'Route not found' }));

export default app;
