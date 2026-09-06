import { Router } from 'express';
import { asyncHandler } from '../middleware/errorHandler.js';
import { ok, fail } from '../utils/apiResponse.js';
import { requireAuth } from '../middleware/auth.js';
import { Exam, ExamAttempt, Certificate, Program } from '../models/index.js';
import { nextSequence } from '../models/Counter.js';

const router = Router();
router.use(requireAuth);

router.post('/:id/start', asyncHandler(async (req, res) => {
  const exam = await Exam.findById(req.params.id);
  if (!exam) return fail(res, 404, 'Exam not found');

  const recentAttempt = await ExamAttempt.findOne({ user: req.user._id, exam: exam._id }).sort('-createdAt');
  if (recentAttempt) {
    const cooldownMs = exam.retakeAfterDays * 24 * 60 * 60 * 1000;
    const elapsed = Date.now() - recentAttempt.startedAt.getTime();
    if (!recentAttempt.passed && elapsed < cooldownMs) {
      return fail(res, 429, `You can retake this exam in ${Math.ceil((cooldownMs - elapsed) / (24 * 60 * 60 * 1000))} day(s)`);
    }
  }

  const attempt = await ExamAttempt.create({ user: req.user._id, exam: exam._id, startedAt: new Date() });
  const questionsForClient = exam.questions.map((q) => ({ text: q.text, options: q.options }));
  ok(res, { attemptId: attempt._id, durationMinutes: exam.durationMinutes, questions: questionsForClient });
}));

router.post('/:id/submit', asyncHandler(async (req, res) => {
  const { attemptId, answers } = req.body;
  const exam = await Exam.findById(req.params.id);
  if (!exam) return fail(res, 404, 'Exam not found');
  const attempt = await ExamAttempt.findOne({ _id: attemptId, user: req.user._id, exam: exam._id });
  if (!attempt) return fail(res, 404, 'Attempt not found');
  if (attempt.submittedAt) return fail(res, 400, 'Attempt already submitted');

  let earned = 0;
  let total = 0;
  exam.questions.forEach((q, i) => {
    total += q.points;
    if (answers[i] === q.correctIndex) earned += q.points;
  });
  const score = total > 0 ? Math.round((earned / total) * 100) : 0;
  const passed = score >= exam.passScore;

  attempt.answers = answers;
  attempt.score = score;
  attempt.passed = passed;
  attempt.submittedAt = new Date();
  await attempt.save();

  let certificate = null;
  if (passed) {
    const program = await Program.findById(exam.program);
    const year = new Date().getFullYear();
    const seq = String(await nextSequence(`certificate-${year}`)).padStart(5, '0');
    const number = `SIYB-${year}-${seq}`;
    certificate = await Certificate.create({
      number,
      holderName: req.user.name,
      program: program._id,
      user: req.user._id,
      examAttempt: attempt._id,
    });
  }

  ok(res, { score, passed, certificate });
}));

export default router;
