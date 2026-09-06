import mongoose from 'mongoose';

const certificateRequestSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true },
    email: { type: String, required: true },
    whatsapp: { type: String, required: true },
    country: { type: String, required: true },
    program: { type: mongoose.Schema.Types.ObjectId, ref: 'Program', required: true },
    wantsForums: { type: Boolean, default: false },
    status: { type: String, enum: ['pending', 'paid', 'issued', 'rejected'], default: 'pending' },
    paymentRef: { type: String, default: '' },
    certificate: { type: mongoose.Schema.Types.ObjectId, ref: 'Certificate' },
  },
  { timestamps: true }
);

export default mongoose.model('CertificateRequest', certificateRequestSchema);
