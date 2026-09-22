import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    /*
     * `select: false` keeps the hash out of every query that does not ask for
     * it by name. The auth routes need it to check a password, so they opt
     * back in with `.select('+passwordHash')`; nothing else — including the
     * generic admin CRUD router, which serialises whole documents — can
     * return it by accident.
     */
    passwordHash: { type: String, required: true, select: false },
    role: { type: String, enum: ['admin', 'editor', 'student'], default: 'student' },
    locale: { type: String, enum: ['ar', 'en'], default: 'ar' },
  },
  { timestamps: true }
);

userSchema.methods.setPassword = async function setPassword(password) {
  this.passwordHash = await bcrypt.hash(password, 12);
};

userSchema.methods.checkPassword = function checkPassword(password) {
  return bcrypt.compare(password, this.passwordHash);
};

userSchema.methods.toSafeJSON = function toSafeJSON() {
  const { _id, name, email, role, locale, createdAt } = this;
  return { id: _id, name, email, role, locale, createdAt };
};

export default mongoose.model('User', userSchema);
