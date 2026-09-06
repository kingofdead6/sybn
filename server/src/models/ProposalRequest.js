import mongoose from 'mongoose';

const proposalRequestSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true },
    email: { type: String, required: true },
    whatsapp: { type: String, required: true },
    targetCountry: { type: String, required: true },
    field: { type: String, required: true },
    tab: { type: String, enum: ['investments', 'employment', 'migration'], required: true },
    wantsForums: { type: Boolean, default: false },
    certificate: { type: mongoose.Schema.Types.ObjectId, ref: 'Certificate', required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true }
);

export default mongoose.model('ProposalRequest', proposalRequestSchema);
