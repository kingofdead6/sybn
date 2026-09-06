import mongoose from 'mongoose';
import { bilingual, bilingualDefault } from './shared.js';

const storySchema = new mongoose.Schema(
  {
    slug: { type: String, required: true, unique: true, index: true },
    country: { type: String, required: true },
    videoUrl: { type: String, required: true },
    thumbnail: { type: String, default: '' },
    category: {
      type: String,
      enum: ['lead-trainers', 'trainer-consultants', 'entrepreneurs', 'organizations'],
      required: true,
    },
    title: { type: bilingualDefault(), default: () => ({}) },
    excerpt: { type: bilingualDefault(), default: () => ({}) },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.model('Story', storySchema);
