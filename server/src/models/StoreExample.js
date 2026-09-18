import mongoose from 'mongoose';
import { bilingual, bilingualDefault } from './shared.js';

/**
 * A showcase entry on the store-examples page: a real storefront built by a
 * graduate, shown as an image that links out to the live shop.
 */
const storeExampleSchema = new mongoose.Schema(
  {
    title: { type: bilingual(true), required: true },
    description: { type: bilingualDefault(), default: () => ({}) },
    image: { type: String, default: '' },
    url: { type: String, required: true, trim: true },
    owner: { type: String, default: '', trim: true },
    country: { type: String, default: '', trim: true },
    order: { type: Number, default: 0 },
    published: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model('StoreExample', storeExampleSchema);
