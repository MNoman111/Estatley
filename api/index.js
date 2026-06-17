// Vercel serverless entry point.
// Vercel turns every file in /api into a serverless function. An Express
// app is itself a (req, res) handler, so we just export it as the default.
import app from '../backend/app.js';

export default app;
