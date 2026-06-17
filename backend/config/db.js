import mongoose from 'mongoose';

// Cached connection — critical for serverless (Vercel) so we reuse the
// connection across function invocations instead of opening a new one each time.
let cached = globalThis._mongoose;
if (!cached) cached = globalThis._mongoose = { conn: null, promise: null };

export const connectDB = async () => {
  const uri = process.env.MONGO_URI;
  if (!uri) throw new Error('MONGO_URI is not defined');

  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose
      .connect(uri, { bufferCommands: false })
      .then((m) => {
        console.log('✅ MongoDB connected');
        return m;
      });
  }

  try {
    cached.conn = await cached.promise;
  } catch (err) {
    cached.promise = null;
    throw err;
  }
  return cached.conn;
};
