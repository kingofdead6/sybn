import mongoose from 'mongoose';

const certificateSchema = new mongoose.Schema(
  {
    number: { type: String, required: true, unique: true, index: true },
    holderName: { type: String, required: true },
    // Where the certificate was sent, when it was issued from a request.
    email: { type: String, default: '' },
    country: { type: String, default: '' },
    // A certificate is for a program or, since courses issue them too, a course.
    program: { type: mongoose.Schema.Types.ObjectId, ref: 'Program' },
    course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' },
    template: { type: mongoose.Schema.Types.ObjectId, ref: 'CertificateTemplate' },
    request: { type: mongoose.Schema.Types.ObjectId, ref: 'CertificateRequest' },
    // When the image was last emailed, so the admin can tell a sent certificate
    // from one whose email failed.
    sentAt: { type: Date },
    issuedAt: { type: Date, required: true, default: Date.now },
    status: { type: String, enum: ['valid', 'revoked'], default: 'valid' },
    revokedReason: { type: String, default: '' },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    examAttempt: { type: mongoose.Schema.Types.ObjectId, ref: 'ExamAttempt' },
  },
  { timestamps: true }
);

export default mongoose.model('Certificate', certificateSchema);
