import mongoose from 'mongoose';
import { Course, CourseFeedback, FeedbackQuestion } from '../models/index.js';
import { sendMail } from './mailer.js';

/**
 * The course registration lifecycle and its evaluation, shared by the student
 * routes (/me) and the admin routes.
 */

/** The evaluation questions for a course: those for every course, and its own. */
export function questionsFor(courseId) {
  return FeedbackQuestion.find({
    active: true,
    $or: [{ courses: { $size: 0 } }, { courses: courseId }],
  }).sort('order createdAt');
}

/**
 * Checks a student's answers against the course's questions and returns them
 * ready to store, or throws with a message naming what is missing or wrong.
 * Only the course's own questions are kept, so a client cannot add others.
 */
export async function buildAnswers(courseId, submitted = {}) {
  const questions = await questionsFor(courseId);
  if (!questions.length) {
    const err = new Error('This course has no evaluation questions yet');
    err.status = 400;
    throw err;
  }

  const answers = [];
  for (const q of questions) {
    const raw = submitted[q._id.toString()];
    const label = { ar: q.label.ar, en: q.label.en };
    const missing = raw === undefined || raw === null || String(raw).trim() === '';

    if (missing) {
      if (q.required) {
        const err = new Error(`Please answer: ${q.label.en || q.label.ar}`);
        err.status = 400;
        err.question = q._id;
        throw err;
      }
      continue;
    }

    if (q.type === 'rating') {
      const n = Number(raw);
      if (!Number.isInteger(n) || n < 1 || n > 5) {
        const err = new Error('A rating must be between 1 and 5 stars');
        err.status = 400;
        throw err;
      }
      answers.push({ question: q._id, type: 'rating', label, rating: n });
    } else if (q.type === 'choice') {
      const i = Number(raw);
      const option = q.options[i];
      if (!Number.isInteger(i) || !option) {
        const err = new Error('Choose one of the options');
        err.status = 400;
        throw err;
      }
      answers.push({ question: q._id, type: 'choice', label, choice: i, choiceLabel: { ar: option.ar, en: option.en } });
    } else {
      answers.push({ question: q._id, type: 'text', label, text: String(raw).trim().slice(0, 3000) });
    }
  }
  return answers;
}

/** The mean of an evaluation's star answers, or undefined when it has none. */
export function scoreOf(answers) {
  const stars = answers.filter((a) => a.type === 'rating').map((a) => a.rating);
  return stars.length ? stars.reduce((s, n) => s + n, 0) / stars.length : undefined;
}

/**
 * Sets the course's card rating to its students' average. A course nobody has
 * rated yet keeps the admin's own value.
 */
export async function recomputeCourseRating(courseId) {
  const [agg] = await CourseFeedback.aggregate([
    { $match: { course: new mongoose.Types.ObjectId(String(courseId)), score: { $exists: true } } },
    { $group: { _id: null, avg: { $avg: '$score' }, n: { $sum: 1 } } },
  ]);
  if (!agg) return;
  await Course.updateOne(
    { _id: courseId },
    { rating: Math.round(agg.avg * 10) / 10, ratingCount: agg.n }
  );
}

const MESSAGES = {
  accepted: {
    subject: 'تم قبول تسجيلك | Your registration was accepted',
    ar: (c) => `تم قبول تسجيلك في دورة «${c}».`,
    en: (c) => `Your registration for the course "${c}" has been accepted.`,
  },
  rejected: {
    subject: 'بخصوص تسجيلك | About your registration',
    ar: (c) => `نعتذر، لم يتم قبول تسجيلك في دورة «${c}».`,
    en: (c) => `We are sorry — your registration for the course "${c}" was not accepted.`,
  },
  completed: {
    subject: 'أتممت الدورة | You completed the course',
    ar: (c) => `تهانينا! أتممت دورة «${c}». يمكنك الآن طلب شهادتك وتقييم الدورة من حسابك.`,
    en: (c) => `Congratulations — you have completed "${c}". You can now request your certificate and rate the course from your account.`,
  },
};

/**
 * Tells the student what happened to their registration. Best-effort: with
 * no email configured, or a failed send, the decision still stands and the
 * student sees it in their account anyway.
 */
export async function notifyStudent(enrollment, user, course) {
  const m = MESSAGES[enrollment.status];
  if (!m || !user?.email) return;
  const titleAr = course?.title?.ar || course?.title?.en || '';
  const titleEn = course?.title?.en || course?.title?.ar || '';
  const site = (process.env.CLIENT_URL || '').replace(/\/$/, '');
  const note = enrollment.adminNote ? `\n\n${enrollment.adminNote}` : '';
  const text = [
    `مرحباً ${user.name || ''}،`,
    '',
    m.ar(titleAr) + note,
    site ? `\nتابع تسجيلاتك من حسابك: ${site}/dashboard/courses` : '',
    '',
    '—',
    '',
    `Hello ${user.name || ''},`,
    '',
    m.en(titleEn) + note,
    site ? `\nFollow your registrations in your account: ${site}/en/dashboard/courses` : '',
  ].join('\n');
  try {
    await sendMail({ to: user.email, subject: m.subject, text });
  } catch {
    // Seen in the account regardless; nothing to undo.
  }
}
