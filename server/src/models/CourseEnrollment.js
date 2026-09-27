import mongoose from 'mongoose';

/**
 * A signed-in user's registration for a course, and where it has got to.
 *
 *   pending   → registered, waiting for the admin
 *   accepted  → the admin accepted them onto the course
 *   rejected  → the admin turned the registration down (they may apply again)
 *   completed → the admin marked the course done for them; the certificate
 *               request and the course evaluation open in their account
 *
 * One registration per user per course: re-applying after a rejection reuses
 * the same record rather than piling up duplicates.
 */
const courseEnrollmentSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true, index: true },
    status: {
      type: String,
      enum: ['pending', 'accepted', 'rejected', 'completed'],
      default: 'pending',
      index: true,
    },
    // What the student wrote when registering (optional).
    message: { type: String, default: '', trim: true, maxlength: 1000 },
    // Answers to the course's own registration fields, keyed by field name.
    answers: { type: Map, of: String, default: () => new Map() },
    // What the admin tells the student with a decision — shown in their account.
    adminNote: { type: String, default: '', trim: true, maxlength: 1000 },
    decidedAt: { type: Date },
    completedAt: { type: Date },
    certificateRequest: { type: mongoose.Schema.Types.ObjectId, ref: 'CertificateRequest' },
    feedback: { type: mongoose.Schema.Types.ObjectId, ref: 'CourseFeedback' },
  },
  { timestamps: true }
);

courseEnrollmentSchema.index({ user: 1, course: 1 }, { unique: true });

export default mongoose.model('CourseEnrollment', courseEnrollmentSchema);
