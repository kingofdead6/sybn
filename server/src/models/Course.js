import mongoose from 'mongoose';
import { bilingual, bilingualDefault, formFieldSchema } from './shared.js';

const moduleSchema = new mongoose.Schema(
  { title: { type: bilingual(true), required: true }, description: { type: bilingualDefault(), default: () => ({}) } },
  { _id: false }
);

/**
 * A specialized course — the catalogue behind the six categories
 * (الجودة و التميز المؤسسي, التخصصات, …). Distinct from a Program: programs are
 * the eight SIYB entrepreneurship tracks, courses are the standards/skills
 * catalogue that sits at the top level of the nav.
 */
const courseSchema = new mongoose.Schema(
  {
    slug: { type: String, required: true, unique: true, index: true },
    title: { type: bilingual(true), required: true },
    description: { type: bilingualDefault(), default: () => ({}) },
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', index: true },
    program: { type: mongoose.Schema.Types.ObjectId, ref: 'Program' },
    modules: { type: [moduleSchema], default: [] },

    // Catalogue card presentation.
    image: { type: String, default: '' },
    code: { type: String, default: '', trim: true },
    /* Editorial score shown as five stars on the card. Not a review average —
       nothing on this site collects user reviews — so it is admin-set. */
    rating: { type: Number, min: 0, max: 5, default: 0 },
    order: { type: Number, default: 0 },
    /* Sorted on for "تاريخ الإصدار (الأحدث أولا)"; falls back to createdAt. */
    releasedAt: { type: Date },

    // Admin-defined registration form, same shape as a program's.
    formHeading: { type: bilingualDefault(), default: () => ({}) },
    formIntro: { type: bilingualDefault(), default: () => ({}) },
    formNote: { type: bilingualDefault(), default: () => ({}) },
    formFields: { type: [formFieldSchema], default: [] },

    published: { type: Boolean, default: true },
  },
  { timestamps: true }
);

courseSchema.index({ order: 1, createdAt: -1 });

export default mongoose.model('Course', courseSchema);
