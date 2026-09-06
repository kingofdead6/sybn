import mongoose from 'mongoose';

const enquirySchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, default: '' },
    subject: { type: String, default: '' },
    message: { type: String, required: true },
    source: { type: String, default: 'contact' },
    handled: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model('Enquiry', enquirySchema);
