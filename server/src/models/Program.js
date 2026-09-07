import mongoose from 'mongoose';
import { bilingual, bilingualDefault, formFieldSchema } from './shared.js';

const bulletSchema = new mongoose.Schema(
  { ar: { type: String, required: true }, en: { type: String, required: true } },
  { _id: false }
);

/**
 * A training package inside a program (the cards on the program page:
 * illustration + title + فيديو / PDF / الإمتحان التقييمي buttons).
 */
const moduleSchema = new mongoose.Schema(
  {
    title: { type: bilingual(true), required: true },
    image: { type: String, default: '' },
    videoUrl: { type: String, default: '' },
    pdfUrl: { type: String, default: '' },
    exam: { type: mongoose.Schema.Types.ObjectId, ref: 'Exam' },
    order: { type: Number, default: 0 },
  },
  { _id: true }
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
    modules: { type: [moduleSchema], default: [] },
    resources: {
      interactive: { type: String, default: '' },
      videoPlaylist: { type: String, default: '' },
      pdfUrl: { type: String, default: '' },
    },
    image: { type: String, default: '' },
    category: { type: String, default: '' },
    ctaLabel: { type: bilingualDefault(), default: () => ({}) },

    // Admin-defined certificate-request form. When empty the page falls back to
    // the built-in five-field form, so existing programs keep working untouched.
    formHeading: { type: bilingualDefault(), default: () => ({}) },
    formIntro: { type: bilingualDefault(), default: () => ({}) },
    formNote: { type: bilingualDefault(), default: () => ({}) },
    formFields: { type: [formFieldSchema], default: [] },

    // Home-page presentation. Each program is a full-width band on the home
    // page; `accent` picks the band colour and `bandTitle` decides whether it
    // opens a new coloured band or continues the previous one (the IYB track
    // shares one band across several programs, like the reference site).
    accent: {
      type: String,
      enum: ['green', 'orange', 'blue', 'slate', 'navy'],
      default: 'blue',
    },
    bandTitle: { type: Boolean, default: true },
    bandHeading: { type: bilingualDefault(), default: () => ({}) },

    published: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model('Program', programSchema);
