import mongoose from 'mongoose';
import { bilingual } from './shared.js';

const mediaSchema = new mongoose.Schema(
  {
    cloudinaryId: { type: String, required: true },
    url: { type: String, required: true },
    format: { type: String, default: '' },
    width: { type: Number, default: 0 },
    height: { type: Number, default: 0 },
    alt: { type: bilingual(true), required: true },
    folder: { type: String, default: 'siyb/misc' },
    uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

export default mongoose.model('Media', mediaSchema);
