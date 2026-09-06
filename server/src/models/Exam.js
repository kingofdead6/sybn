import mongoose from 'mongoose';
import { bilingual } from './shared.js';

const optionSchema = new mongoose.Schema(
  { ar: { type: String, required: true }, en: { type: String, required: true } },
  { _id: false }
);

const questionSchema = new mongoose.Schema(
  {
    text: { type: bilingual(true), required: true },
    options: { type: [optionSchema], required: true, validate: (v) => v.length >= 2 },
    correctIndex: { type: Number, required: true },
    points: { type: Number, default: 1 },
  },
  { _id: false }
);

const examSchema = new mongoose.Schema(
  {
    program: { type: mongoose.Schema.Types.ObjectId, ref: 'Program', required: true },
    questions: { type: [questionSchema], required: true },
    passScore: { type: Number, required: true },
    durationMinutes: { type: Number, required: true, default: 30 },
    retakeAfterDays: { type: Number, default: 3 },
  },
  { timestamps: true }
);

export default mongoose.model('Exam', examSchema);
