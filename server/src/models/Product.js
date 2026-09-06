import mongoose from 'mongoose';
import { bilingual, bilingualDefault } from './shared.js';

const productSchema = new mongoose.Schema(
  {
    slug: { type: String, required: true, unique: true, index: true },
    title: { type: bilingual(true), required: true },
    description: { type: bilingualDefault(), default: () => ({}) },
    price: { type: Number, required: true },
    currency: { type: String, default: 'DZD' },
    images: { type: [String], default: [] },
    category: { type: String, required: true },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'TeamMember' },
    stock: { type: Number, default: 0 },
    published: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model('Product', productSchema);
