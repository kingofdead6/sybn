import mongoose from 'mongoose';

/**
 * Arabic is the site's primary language, so it carries the `required` flag.
 * English is always optional - the UI falls back to Arabic when it is blank,
 * which lets an admin publish without waiting on a translation.
 */
export const bilingual = (required = false) => ({
  ar: { type: String, required, trim: true },
  en: { type: String, default: '', trim: true },
});

export const bilingualDefault = () => ({
  ar: { type: String, default: '', trim: true },
  en: { type: String, default: '', trim: true },
});

export const { Schema } = mongoose;

/** The field types an admin can place on a registration form. */
export const FORM_FIELD_TYPES = ['text', 'email', 'tel', 'select', 'textarea', 'checkbox'];

/**
 * One admin-defined field on a program's or course's registration form.
 *
 * `name` is the key the answer is stored under, so it must be stable and
 * unique within a form — the admin UI derives it and keeps it fixed once set.
 * `options` applies to `select` only.
 */
export const formFieldSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    type: { type: String, enum: FORM_FIELD_TYPES, default: 'text' },
    label: { type: bilingual(true), required: true },
    placeholder: { type: bilingualDefault(), default: () => ({}) },
    help: { type: bilingualDefault(), default: () => ({}) },
    options: {
      type: [
        {
          value: { type: String, required: true, trim: true },
          label: { type: bilingual(true), required: true },
          _id: false,
        },
      ],
      default: [],
    },
    required: { type: Boolean, default: false },
    order: { type: Number, default: 0 },
  },
  { _id: true }
);

/**
 * How people sign up for a training. `internal` uses the platform's own
 * registration form; `external` is hosted elsewhere and links out - but the
 * platform form stays available either way, so a visitor can always register
 * here regardless of where the training is run.
 */
export const hosting = () => ({
  registrationType: {
    type: String,
    enum: ['internal', 'external'],
    default: 'internal',
  },
  externalUrl: { type: String, default: '', trim: true },
  externalProvider: { type: String, default: '', trim: true },
});
