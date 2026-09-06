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
