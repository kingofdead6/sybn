import mongoose from 'mongoose';

/**
 * A quick-registration lead from the home page's "استمارة التسجيل السريع" —
 * the short capture form that sits between the programme content and the full
 * forum registration. It asks for the minimum needed to call someone back and
 * send them the introductory pack, so it deliberately does NOT hold a Forum
 * reference or consume a seat; that is ForumRegistration's job.
 */
const leadSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true, trim: true },
    whatsapp: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    country: { type: String, required: true, trim: true },

    /* Which of the three routes in the form the person picked. */
    interest: {
      type: String,
      enum: ['entrepreneur', 'trainer', 'partnership'],
      required: true,
    },

    /* The sub-choice within that route — a product track key ("track-1"…),
       a trainer programme code ("TOT", "GYB"…), or empty for partnership. */
    track: { type: String, default: '', trim: true },

    note: { type: String, default: '', trim: true },

    status: {
      type: String,
      enum: ['new', 'contacted', 'converted', 'closed'],
      default: 'new',
    },
    handled: { type: Boolean, default: false },

    /* Where on the site the form was submitted from, for attribution. */
    source: { type: String, default: 'home' },
  },
  { timestamps: true }
);

export default mongoose.model('Lead', leadSchema);
