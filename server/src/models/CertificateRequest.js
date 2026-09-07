import mongoose from 'mongoose';

const certificateRequestSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true },
    email: { type: String, required: true },
    whatsapp: { type: String, required: true },
    country: { type: String, required: true },
    program: { type: mongoose.Schema.Types.ObjectId, ref: 'Program' },
    course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' },
    wantsForums: { type: Boolean, default: false },
    /* Answers to the admin-defined fields, keyed by field `name`. The four
       columns above stay first-class because certificate issuance and the
       admin list read them directly. */
    answers: { type: Map, of: String, default: () => new Map() },
    status: { type: String, enum: ['pending', 'paid', 'issued', 'rejected'], default: 'pending' },
    paymentRef: { type: String, default: '' },
    certificate: { type: mongoose.Schema.Types.ObjectId, ref: 'Certificate' },
  },
  { timestamps: true }
);

/* `program` was required before courses existed. It is now optional so a course
   can be the subject instead — but exactly one of the two must be set. */
certificateRequestSchema.pre('validate', function ensureSubject(next) {
  if (!this.program && !this.course) {
    return next(new Error('A certificate request needs either a program or a course'));
  }
  next();
});

export default mongoose.model('CertificateRequest', certificateRequestSchema);
