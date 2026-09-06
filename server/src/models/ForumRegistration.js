import mongoose from 'mongoose';

const forumRegistrationSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true },
    whatsapp: { type: String, required: true },
    email: { type: String, required: true },
    country: { type: String, required: true },
    forum: { type: mongoose.Schema.Types.ObjectId, ref: 'Forum', required: true },
    status: { type: String, enum: ['pending', 'confirmed', 'cancelled'], default: 'pending' },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

export default mongoose.model('ForumRegistration', forumRegistrationSchema);
