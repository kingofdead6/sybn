import mongoose from 'mongoose';

const certificateSchema = new mongoose.Schema(
  {
    number: { type: String, required: true, unique: true, index: true },
    holderName: { type: String, required: true },
    program: { type: mongoose.Schema.Types.ObjectId, ref: 'Program', required: true },
    issuedAt: { type: Date, required: true, default: Date.now },
    status: { type: String, enum: ['valid', 'revoked'], default: 'valid' },
    revokedReason: { type: String, default: '' },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    examAttempt: { type: mongoose.Schema.Types.ObjectId, ref: 'ExamAttempt' },
  },
  { timestamps: true }
);

export default mongoose.model('Certificate', certificateSchema);
