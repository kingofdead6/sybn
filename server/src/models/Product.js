import mongoose from 'mongoose';
import { bilingual } from './shared.js';

/**
 * An item in the shop window.
 *
 * The platform does not sell anything itself: a product is a name, a picture
 * and a link out to wherever it is actually sold, so there is no price, stock
 * or checkout here.
 */
const productSchema = new mongoose.Schema(
  {
    slug: { type: String, required: true, unique: true, index: true },
    title: { type: bilingual(true), required: true },
    image: { type: String, default: '' },
    url: { type: String, required: true, trim: true },
    published: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model('Product', productSchema);
