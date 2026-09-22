import mongoose from 'mongoose';
import { bilingual, bilingualDefault, formFieldSchema } from './shared.js';

const bulletSchema = new mongoose.Schema(
  { ar: { type: String, required: true }, en: { type: String, required: true } },
  { _id: false }
);

/**
 * A training package inside a program (the cards on the program page:
 * illustration + title + فيديو / PDF / الإمتحان التقييمي buttons).
 *
 * A package is one of two things. Normally it is written here: its own title,
 * artwork and links. Alternatively it points at another program via `program`,
 * and the card then stands for that program and links to its page — which is
 * how one program is offered as a package of another without duplicating it.
 * A linked package still honours anything filled in here, so its title or
 * artwork can be overridden for this context.
 */
const moduleSchema = new mongoose.Schema(
  {
    // Required only for a written package; a linked one takes the title of the
    // program it points at, so the check has to look at the whole subdocument.
    title: {
      ar: {
        type: String,
        trim: true,
        required: function required() {
          return !this.program;
        },
      },
      en: { type: String, default: '', trim: true },
    },
    image: { type: String, default: '' },
    videoUrl: { type: String, default: '' },
    pdfUrl: { type: String, default: '' },
    exam: { type: mongoose.Schema.Types.ObjectId, ref: 'Exam' },

    // When set, this package is another program rather than written content.
    program: { type: mongoose.Schema.Types.ObjectId, ref: 'Program' },

    order: { type: Number, default: 0 },
  },
  { _id: true }
);

const programSchema = new mongoose.Schema(
  {
    slug: { type: String, required: true, unique: true, index: true },
    order: { type: Number, required: true },
    code: { type: String, default: '' },
    level: { type: String, default: '' },
    title: { type: bilingual(true), required: true },
    audience: { type: bilingual(true), required: true },
    intro: { type: bilingualDefault(), default: () => ({}) },
    bullets: { type: [bulletSchema], default: [] },
    modules: { type: [moduleSchema], default: [] },
    resources: {
      interactive: { type: String, default: '' },
      videoPlaylist: { type: String, default: '' },
      pdfUrl: { type: String, default: '' },
    },
    image: { type: String, default: '' },
    category: { type: String, default: '' },
    ctaLabel: { type: bilingualDefault(), default: () => ({}) },

    // Which branch of the offering this program belongs to. Drives the
    // grouping in the "Our Programs" navigation menu.
    track: {
      type: String,
      enum: ['entrepreneurship', 'trainers', 'ai'],
      default: 'entrepreneurship',
      index: true,
    },

    // The program this one sits beneath, if any. A child is listed on its
    // parent's page under "Training Resources" and is reached at a nested
    // address, `/programs/<parent>/<child>`, which is its canonical one.
    //
    // Any program may be a parent, so a branch is curated here rather than
    // implied by the track. Nesting is one level deep: a child's own children
    // are not shown, which keeps the URLs and the menus finite.
    parent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Program',
      default: null,
      index: true,
    },

    // Admin-defined certificate-request form. When empty the page falls back to
    // the built-in five-field form, so existing programs keep working untouched.
    formHeading: { type: bilingualDefault(), default: () => ({}) },
    formIntro: { type: bilingualDefault(), default: () => ({}) },
    formNote: { type: bilingualDefault(), default: () => ({}) },
    formFields: { type: [formFieldSchema], default: [] },

    // Home-page presentation. Each program is a full-width band on the home
    // page; `accent` picks the band colour and `bandTitle` decides whether it
    // opens a new coloured band or continues the previous one (the IYB track
    // shares one band across several programs, like the reference site).
    accent: {
      type: String,
      enum: ['green', 'orange', 'blue', 'slate', 'navy'],
      default: 'blue',
    },
    bandTitle: { type: Boolean, default: true },
    bandHeading: { type: bilingualDefault(), default: () => ({}) },

    published: { type: Boolean, default: true },
  },
  { timestamps: true }
);

/**
 * A program cannot be its own parent. The admin picker already excludes it,
 * but a direct API write could still set it and would then render a page that
 * lists itself as its own child.
 */
programSchema.pre('validate', function guardSelfParent(next) {
  if (this.parent && String(this.parent) === String(this._id)) {
    this.invalidate('parent', 'A program cannot be its own parent');
  }
  next();
});

/**
 * The admin panel saves through `findByIdAndUpdate`, which runs field
 * validators but not the document hook above — so the same rule is enforced
 * again here, against the id in the query rather than on the document.
 */
programSchema.pre('findOneAndUpdate', function guardSelfParentOnUpdate(next) {
  const update = this.getUpdate() || {};
  const parent = update.parent ?? update.$set?.parent;
  if (!parent) return next();

  const targetId = this.getQuery()?._id;
  if (targetId && String(parent) === String(targetId)) {
    return next(new Error('A program cannot be its own parent'));
  }
  return next();
});

export default mongoose.model('Program', programSchema);
