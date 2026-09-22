import mongoose from 'mongoose';
import { bilingual, bilingualDefault } from './shared.js';

/**
 * A downloadable resource on the Key Resources page: a guide, manual or
 * template, shown as a named card with cover art and a PDF behind it.
 *
 * `directDownload` decides what the card does when clicked. Ticked, the card
 * is a link straight to the PDF — right for a one-page form nobody needs
 * explained. Unticked, it opens the resource's own page, where the
 * description has room and the download is a deliberate button.
 */
const resourceSchema = new mongoose.Schema(
  {
    title: { type: bilingual(true), required: true },
    slug: { type: String, required: true, unique: true, trim: true, lowercase: true },

    // Shown on the card; the long form is for the detail page only.
    summary: { type: bilingualDefault(), default: () => ({}) },
    description: { type: bilingualDefault(), default: () => ({}) },

    image: { type: String, default: '' },
    pdfUrl: { type: String, default: '', trim: true },

    // Optional shelf label — "Guide", "Template", "Manual".
    category: { type: bilingualDefault(), default: () => ({}) },

    directDownload: { type: Boolean, default: false },
    order: { type: Number, default: 0 },
    published: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model('Resource', resourceSchema);
