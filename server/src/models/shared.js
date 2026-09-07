import mongoose from 'mongoose';

export const bilingual = (required = false) => ({
  ar: { type: String, required, trim: true },
  en: { type: String, required, trim: true },
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
