import mongoose from 'mongoose';
import { bilingual, bilingualDefault } from './shared.js';

const bulletSchema = new mongoose.Schema(
  { ar: { type: String, required: true }, en: { type: String, required: true } },
  { _id: false }
);

const programSchema = new mongoose.Schema(
  {
    slug: { type: String, required: true, unique: true, index: true },
    order: { type: Number, required: true },
    code: { type: String, default: '' },
    level: { type: String, default: '' },
    title: { type: bilingual(true), required: true },
    audience: { type: bilingual(true), required: true },
    intro: { type: bilingualDefault(), default: () => ({}) },
    bullets: { type: [bulletSchema], default: [] },
    resources: {
      interactive: { type: String, default: '' },
      videoPlaylist: { type: String, default: '' },
      pdfUrl: { type: String, default: '' },
    },
    image: { type: String, default: '' },
    category: { type: String, default: '' },
    ctaLabel: { type: bilingualDefault(), default: () => ({}) },
    published: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model('Program', programSchema);
