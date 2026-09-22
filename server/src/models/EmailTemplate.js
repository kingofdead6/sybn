import mongoose from 'mongoose';

/**
 * A saved message the admin can send to certified trainers.
 *
 * Both bodies are kept: `html` for a formatted message and `text` for the
 * plain-text version. A message may be sent as either, and when HTML is sent
 * the text body travels with it as the fallback for clients that will not
 * render HTML — so a trainer never receives an empty email.
 *
 * Placeholders in either body are replaced per recipient. See
 * `utils/emailTemplate.js` for the list.
 */
const emailTemplateSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    subject: { type: String, required: true, trim: true },
    html: { type: String, default: '' },
    text: { type: String, default: '' },
    // Which body this template is meant to be sent as by default.
    format: { type: String, enum: ['html', 'text'], default: 'html' },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.model('EmailTemplate', emailTemplateSchema);
