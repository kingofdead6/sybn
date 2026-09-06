import mongoose from 'mongoose';
import { bilingual, bilingualDefault } from './shared.js';

const categorySchema = new mongoose.Schema(
  {
    slug: { type: String, required: true, unique: true, index: true },
    title: { type: bilingual(true), required: true },
    description: { type: bilingualDefault(), default: () => ({}) },
    order: { type: Number, default: 0 },
    image: { type: String, default: '' },
  },
  { timestamps: true }
);

export default mongoose.model('Category', categorySchema);
