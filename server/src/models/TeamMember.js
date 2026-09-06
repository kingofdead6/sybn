import mongoose from 'mongoose';
import { bilingual, bilingualDefault } from './shared.js';

const teamMemberSchema = new mongoose.Schema(
  {
    slug: { type: String, required: true, unique: true, index: true },
    name: { type: bilingual(true), required: true },
    role: { type: bilingual(true), required: true },
    country: { type: String, default: '' },
    region: {
      type: String,
      required: true,
      enum: [
        'leadership',
        'mena',
        'sub-saharan-africa',
        'europe-central-asia',
        'companies-institutions',
        'training-institutes',
      ],
    },
    photo: { type: String, required: true },
    bio: { type: bilingualDefault(), default: () => ({}) },
    order: { type: Number, default: 0 },
    type: { type: String, enum: ['individual', 'organization'], default: 'individual' },
  },
  { timestamps: true }
);

export default mongoose.model('TeamMember', teamMemberSchema);
