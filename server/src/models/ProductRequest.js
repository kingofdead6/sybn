import mongoose from 'mongoose';

/**
 * A request from a visitor to have an item listed in the store. The admin
 * reviews it and, on approval, creates the Product themselves — so nothing a
 * visitor submits ever reaches the storefront unreviewed.
 */
const productRequestSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, default: '' },

    // What they want listed.
    itemTitle: { type: String, required: true },
    itemDescription: { type: String, required: true },
    category: { type: String, default: '' },
    budget: { type: String, default: '' },
    quantity: { type: Number, default: 1 },

    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
      index: true,
    },
    adminNote: { type: String, default: '' },
    // Set once the admin has listed the approved item.
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
  },
  { timestamps: true }
);

export default mongoose.model('ProductRequest', productRequestSchema);
