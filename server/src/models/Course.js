import mongoose from 'mongoose';
import { bilingual, bilingualDefault, formFieldSchema, hosting } from './shared.js';

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
    /* Five stars on the card. Set by the admin until students have rated the
       course; from the first evaluation on, it is the students' average and
       `ratingCount` says how many evaluations it rests on. */
    rating: { type: Number, min: 0, max: 5, default: 0 },
    ratingCount: { type: Number, default: 0 },
    order: { type: Number, default: 0 },
    /* Sorted on for "تاريخ الإصدار (الأحدث أولا)"; falls back to createdAt. */
    releasedAt: { type: Date },

    // Admin-defined registration form, same shape as a program's.
    formHeading: { type: bilingualDefault(), default: () => ({}) },
    formIntro: { type: bilingualDefault(), default: () => ({}) },
    formNote: { type: bilingualDefault(), default: () => ({}) },
    formFields: { type: [formFieldSchema], default: [] },

    // Registration settings. A closed course takes no new registrations; a
    // capacity (0 = unlimited) closes it once that many students are accepted
    // or have completed it; askMessage offers the free-text note to the team.
    enrollmentOpen: { type: Boolean, default: true },
    capacity: { type: Number, default: 0, min: 0 },
    askMessage: { type: Boolean, default: true },

    ...hosting(),

    published: { type: Boolean, default: true },
  },
  { timestamps: true }
);

courseSchema.index({ order: 1, createdAt: -1 });

export default mongoose.model('Course', courseSchema);
