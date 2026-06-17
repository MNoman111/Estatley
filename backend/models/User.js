import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, minlength: 6, select: false },
    phone: { type: String, default: '' },
    role: { type: String, enum: ['user', 'agent', 'admin'], default: 'user' },
    avatar: {
      type: String,
      default: 'https://ui-avatars.com/api/?background=1f7a4d&color=fff&name=User',
    },
    agency: { type: String, default: '' },
    about: { type: String, default: '' },
    favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Property' }],
  },
  { timestamps: true }
);

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.matchPassword = function (entered) {
  return bcrypt.compare(entered, this.password);
};

export default mongoose.model('User', userSchema);
