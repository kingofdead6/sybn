import mongoose from 'mongoose';
import { bilingualDefault, hosting } from './shared.js';

const forumSchema = new mongoose.Schema(
  {
    month: { type: String, required: true },
    year: { type: Number, required: true },
    city: { type: String, required: true, default: 'المدينة المنورة / مكة المكرمة' },
    topics: { type: [String], default: [] },
    notes: { type: bilingualDefault(), default: () => ({}) },
    status: { type: String, enum: ['open', 'full', 'announced-soon'], default: 'announced-soon' },
    seatsTotal: { type: Number, default: 0 },
    seatsTaken: { type: Number, default: 0 },
    startDate: { type: Date },
    tripDays: { type: Number, default: 15 },
    forumDays: { type: Number, default: 3 },
    agreementUrl: { type: String, default: '' },
    partnershipUrl: { type: String, default: '' },

    ...hosting(),
  },
  { timestamps: true }
);

export default mongoose.model('Forum', forumSchema);
