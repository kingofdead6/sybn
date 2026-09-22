import mongoose from 'mongoose';

/**
 * A trainer the programme has certified.
 *
 * Created by certifying an approved certificate request, so the name, email
 * and programme carry over from what the person actually submitted rather
 * than being retyped. The record is kept separate from the request so a
 * trainer survives the request being cleaned up, and separate from TeamMember
 * so certifying someone does not oblige them to have a public profile.
 */
const certifiedTrainerSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    // Indexed below as unique — one trainer per address.
    email: { type: String, required: true, trim: true, lowercase: true },
    phone: { type: String, default: '', trim: true },
    country: { type: String, default: '', trim: true },

    program: { type: mongoose.Schema.Types.ObjectId, ref: 'Program' },
    certificate: { type: mongoose.Schema.Types.ObjectId, ref: 'Certificate' },
    // Where this trainer came from, so the source request can be traced back.
    request: { type: mongoose.Schema.Types.ObjectId, ref: 'CertificateRequest' },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },

    certifiedAt: { type: Date, default: Date.now },
    status: { type: String, enum: ['active', 'suspended'], default: 'active', index: true },
    notes: { type: String, default: '' },

    // Set after a successful send, so the list shows who has been contacted.
    lastEmailedAt: { type: Date },
  },
  { timestamps: true }
);

// One trainer per address: certifying the same person twice is a mistake, not
// a second trainer.
certifiedTrainerSchema.index({ email: 1 }, { unique: true });

export default mongoose.model('CertifiedTrainer', certifiedTrainerSchema);
