import mongoose from 'mongoose';
import { bilingual, bilingualDefault } from './shared.js';

/**
 * One question on the course evaluation, written by the admin.
 *
 *   rating → one to five stars
 *   choice → pick one of the admin's options
 *   text   → a written answer
 *
 * A question with no courses listed is asked on every course; listing courses
 * limits it to those. Retiring a question (active: false) keeps the answers
 * already given to it, which deleting would not.
 */
const feedbackQuestionSchema = new mongoose.Schema(
  {
    label: { type: bilingual(true), required: true },
    help: { type: bilingualDefault(), default: () => ({}) },
    type: { type: String, enum: ['rating', 'choice', 'text'], default: 'rating' },
    options: { type: [{ ar: { type: String, trim: true }, en: { type: String, trim: true, default: '' } }], default: [] },
    required: { type: Boolean, default: true },
    active: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
    courses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Course' }],
  },
  { timestamps: true }
);

export default mongoose.model('FeedbackQuestion', feedbackQuestionSchema);
