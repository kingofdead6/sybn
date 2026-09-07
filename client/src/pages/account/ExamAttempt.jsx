import { useEffect, useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { useLocale } from '../../context/LocaleContext';
import api from '../../lib/api';
import Section from '../../components/ui/Section';
import Button from '../../components/ui/Button';
import Pill from '../../components/ui/Pill';
import SEO from '../../components/SEO';

export default function ExamAttempt() {
  const { id } = useParams();
  const { locale } = useLocale();
  const [session, setSession] = useState(null);
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [remaining, setRemaining] = useState(null);

  useEffect(() => {
    api
      .post(`/exams/${id}/start`)
      .then(({ data }) => {
        setSession(data.data);
        setRemaining(data.data.durationMinutes * 60);
      })
      .catch((err) => setError(err.response?.data?.error || 'Could not start exam'));
  }, [id]);

  useEffect(() => {
    if (remaining === null || result) return undefined;
    if (remaining <= 0) {
      onSubmit();
      return undefined;
    }
    const t = setTimeout(() => setRemaining((r) => r - 1), 1000);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [remaining, result]);

  const onSubmit = useCallback(async () => {
    if (!session) return;
    const answerArray = session.questions.map((_, i) => answers[i] ?? -1);
    try {
      const { data } = await api.post(`/exams/${id}/submit`, { attemptId: session.attemptId, answers: answerArray });
      setResult(data.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Submission failed');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session, answers, id]);

  if (error) return <Section><p className="text-error">{error}</p></Section>;
  if (!session) return <Section><p className="text-muted">…</p></Section>;

  if (result) {
    return (
      <Section>
        <SEO title={locale === 'ar' ? 'نتيجة الامتحان' : 'Exam Result'} path="/dashboard" />
        <div aria-live="polite">
          <h1 className="font-display text-2xl text-ink mb-4">{locale === 'ar' ? 'نتيجتك' : 'Your Result'}</h1>
          <p className="text-lg text-ink mb-2 numerals">{result.score}%</p>
          <Pill tone={result.passed ? 'success' : 'clay'}>
            {result.passed ? (locale === 'ar' ? 'ناجح' : 'Passed') : (locale === 'ar' ? 'راسب' : 'Not passed')}
          </Pill>
          {result.certificate && (
            <p className="mt-4 text-ink-soft" dir="ltr">
              {locale === 'ar' ? 'رقم الشهادة: ' : 'Certificate number: '}
              {result.certificate.number}
            </p>
          )}
        </div>
      </Section>
    );
  }

  const minutes = Math.floor(remaining / 60);
  const seconds = String(remaining % 60).padStart(2, '0');

  return (
    <Section>
      <SEO title={locale === 'ar' ? 'الامتحان' : 'Exam'} path="/dashboard" />
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-xl text-ink">{locale === 'ar' ? 'الامتحان' : 'Exam'}</h1>
        <span className="text-sm text-error numerals" dir="ltr">{minutes}:{seconds}</span>
      </div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit();
        }}
        className="flex flex-col gap-8"
      >
        {session.questions.map((q, qi) => (
          <fieldset key={qi} className="border border-rule rounded-sm p-4">
            <legend className="font-medium text-ink px-1">{q.text[locale]}</legend>
            <div className="flex flex-col gap-2 mt-2">
              {q.options.map((opt, oi) => (
                <label key={oi} className="flex items-center gap-2 text-ink-soft text-sm">
                  <input
                    type="radio"
                    name={`q-${qi}`}
                    checked={answers[qi] === oi}
                    onChange={() => setAnswers((a) => ({ ...a, [qi]: oi }))}
                  />
                  {opt[locale]}
                </label>
              ))}
            </div>
          </fieldset>
        ))}
        <Button type="submit">{locale === 'ar' ? 'إرسال الإجابات' : 'Submit Answers'}</Button>
      </form>
    </Section>
  );
}
