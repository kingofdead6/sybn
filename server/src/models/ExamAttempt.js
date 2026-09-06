import mongoose from 'mongoose';

const examAttemptSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    exam: { type: mongoose.Schema.Types.ObjectId, ref: 'Exam', required: true },
    answers: { type: [Number], default: [] },
    score: { type: Number, default: 0 },
    passed: { type: Boolean, default: false },
    startedAt: { type: Date, required: true },
    submittedAt: { type: Date },
  },
  { timestamps: true }
);

export default mongoose.model('ExamAttempt', examAttemptSchema);
