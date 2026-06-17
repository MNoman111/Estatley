import mongoose from 'mongoose';

const propertySchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    purpose: { type: String, enum: ['sale', 'rent'], default: 'sale' },
    type: {
      type: String,
      enum: ['House', 'Flat', 'Upper Portion', 'Lower Portion', 'Farm House', 'Plot', 'Shop', 'Office', 'Building'],
      default: 'House',
    },
    price: { type: Number, required: true }, // in PKR
    city: { type: String, required: true },
    location: { type: String, required: true }, // area / society
    address: { type: String, default: '' },
    area: { type: Number, required: true }, // numeric area
    areaUnit: { type: String, enum: ['Marla', 'Kanal', 'Sq. Ft.', 'Sq. Yd.'], default: 'Marla' },
    bedrooms: { type: Number, default: 0 },
    bathrooms: { type: Number, default: 0 },
    images: [{ type: String }],
    amenities: [{ type: String }],
    featured: { type: Boolean, default: false },
    coordinates: {
      lat: { type: Number, default: null },
      lng: { type: Number, default: null },
    },
    agent: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

propertySchema.index({ title: 'text', description: 'text', location: 'text', city: 'text' });

export default mongoose.model('Property', propertySchema);
