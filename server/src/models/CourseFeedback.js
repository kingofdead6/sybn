import mongoose from 'mongoose';

/**
 * One answer on a course evaluation. The question's wording (and, for a
 * choice, the chosen option's wording) is copied in, so results still read
 * correctly after the admin edits or retires the question.
 */
const answerSchema = new mongoose.Schema(
  {
    question: { type: mongoose.Schema.Types.ObjectId, ref: 'FeedbackQuestion' },
    type: { type: String, enum: ['rating', 'choice', 'text'], required: true },
    label: { ar: String, en: String },
    rating: { type: Number, min: 1, max: 5 },
    choice: { type: Number, min: 0 },
    choiceLabel: { ar: String, en: String },
    text: { type: String, default: '', maxlength: 3000 },
  },
  { _id: false }
);

/** A student's evaluation of a course they completed — one per registration. */
const courseFeedbackSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true, index: true },
    enrollment: { type: mongoose.Schema.Types.ObjectId, ref: 'CourseEnrollment', required: true, unique: true },
    answers: { type: [answerSchema], default: [] },
    // The mean of this evaluation's star answers, kept for quick averages.
    score: { type: Number, min: 1, max: 5 },
  },
  { timestamps: true }
);

export default mongoose.model('CourseFeedback', courseFeedbackSchema);
