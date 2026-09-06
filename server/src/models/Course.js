import mongoose from 'mongoose';
import { bilingual, bilingualDefault } from './shared.js';

const moduleSchema = new mongoose.Schema(
  { title: { type: bilingual(true), required: true }, description: { type: bilingualDefault(), default: () => ({}) } },
  { _id: false }
);

const courseSchema = new mongoose.Schema(
  {
    slug: { type: String, required: true, unique: true, index: true },
    title: { type: bilingual(true), required: true },
    description: { type: bilingualDefault(), default: () => ({}) },
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
    program: { type: mongoose.Schema.Types.ObjectId, ref: 'Program' },
    modules: { type: [moduleSchema], default: [] },
    published: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model('Course', courseSchema);
