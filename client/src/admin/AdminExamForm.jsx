import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../lib/api';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';
import Button from '../components/ui/Button';

function emptyQuestion() {
  return {
    text: { ar: '', en: '' },
    options: [
      { ar: '', en: '' },
      { ar: '', en: '' },
    ],
    correctIndex: 0,
    points: 1,
  };
}

function emptyExam() {
  return { program: '', passScore: 60, durationMinutes: 30, retakeAfterDays: 3, questions: [emptyQuestion()] };
}

export default function AdminExamForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isNew = !id;
  const [exam, setExam] = useState(isNew ? emptyExam() : null);
  const [programs, setPrograms] = useState([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/admin/programs', { params: { limit: 100 } }).then(({ data }) => setPrograms(data.data));
  }, []);

  useEffect(() => {
    if (!isNew) {
      api.get(`/admin/exams/${id}`).then(({ data }) => {
        const e = data.data;
        setExam({ ...e, program: e.program?._id || e.program });
      });
    }
  }, [id, isNew]);

  if (!exam) return <p className="text-sage">Loading…</p>;

  function updateQuestion(qi, patch) {
    setExam((prev) => {
      const questions = [...prev.questions];
      questions[qi] = { ...questions[qi], ...patch };
      return { ...prev, questions };
    });
  }

  function updateOption(qi, oi, patch) {
    setExam((prev) => {
      const questions = [...prev.questions];
      const options = [...questions[qi].options];
      options[oi] = { ...options[oi], ...patch };
      questions[qi] = { ...questions[qi], options };
      return { ...prev, questions };
    });
  }

  function addQuestion() {
    setExam((prev) => ({ ...prev, questions: [...prev.questions, emptyQuestion()] }));
  }

  function removeQuestion(qi) {
    setExam((prev) => ({ ...prev, questions: prev.questions.filter((_, i) => i !== qi) }));
  }

  function addOption(qi) {
    setExam((prev) => {
      const questions = [...prev.questions];
      questions[qi] = { ...questions[qi], options: [...questions[qi].options, { ar: '', en: '' }] };
      return { ...prev, questions };
    });
  }

  function removeOption(qi, oi) {
    setExam((prev) => {
      const questions = [...prev.questions];
      const q = questions[qi];
      const options = q.options.filter((_, i) => i !== oi);
      const correctIndex = q.correctIndex >= options.length ? 0 : q.correctIndex;
      questions[qi] = { ...q, options, correctIndex };
      return { ...prev, questions };
    });
  }

  async function onSave(e) {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      if (isNew) {
        const { data } = await api.post('/admin/exams', exam);
        navigate(`/admin/exams/${data.data._id}`);
      } else {
        await api.put(`/admin/exams/${id}`, exam);
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Save failed');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="max-w-3xl">
      <h1 className="font-display text-2xl text-ink mb-6">{isNew ? 'New Exam' : 'Edit Exam'}</h1>
      <form onSubmit={onSave} className="flex flex-col gap-6">
        <Select
          label="Program"
          value={exam.program}
          onChange={(e) => setExam((prev) => ({ ...prev, program: e.target.value }))}
          required
        >
          <option value="">—</option>
          {programs.map((p) => (
            <option key={p._id} value={p._id}>
              {p.title?.ar} ({p.code})
            </option>
          ))}
        </Select>

        <div className="grid gap-4 sm:grid-cols-3">
          <Input
            label="Pass score (%)"
            type="number"
            value={exam.passScore}
            onChange={(e) => setExam((prev) => ({ ...prev, passScore: Number(e.target.value) }))}
            required
          />
          <Input
            label="Duration (minutes)"
            type="number"
            value={exam.durationMinutes}
            onChange={(e) => setExam((prev) => ({ ...prev, durationMinutes: Number(e.target.value) }))}
            required
          />
          <Input
            label="Retake after (days)"
            type="number"
            value={exam.retakeAfterDays}
            onChange={(e) => setExam((prev) => ({ ...prev, retakeAfterDays: Number(e.target.value) }))}
          />
        </div>

        <div className="flex flex-col gap-5">
          <h2 className="font-display text-lg text-ink">Questions</h2>
          {exam.questions.map((q, qi) => (
            <div key={qi} className="border border-line rounded p-4 flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-ink">Question {qi + 1}</span>
                <button type="button" onClick={() => removeQuestion(qi)} className="text-clay text-sm">
                  Remove question
                </button>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <Input
                  label="Text (AR)"
                  dir="rtl"
                  value={q.text.ar}
                  onChange={(e) => updateQuestion(qi, { text: { ...q.text, ar: e.target.value } })}
                  required
                />
                <Input
                  label="Text (EN)"
                  dir="ltr"
                  value={q.text.en}
                  onChange={(e) => updateQuestion(qi, { text: { ...q.text, en: e.target.value } })}
                  required
                />
              </div>

              <div className="flex flex-col gap-2">
                <span className="text-sm font-medium text-ink">Options (select the correct one)</span>
                {q.options.map((opt, oi) => (
                  <div key={oi} className="flex items-center gap-2">
                    <input
                      type="radio"
                      name={`correct-${qi}`}
                      checked={q.correctIndex === oi}
                      onChange={() => updateQuestion(qi, { correctIndex: oi })}
                    />
                    <input
                      dir="rtl"
                      placeholder="AR"
                      value={opt.ar}
                      onChange={(e) => updateOption(qi, oi, { ar: e.target.value })}
                      className="flex-1 rounded border border-line bg-surface px-2 py-1.5 text-sm"
                    />
                    <input
                      dir="ltr"
                      placeholder="EN"
                      value={opt.en}
                      onChange={(e) => updateOption(qi, oi, { en: e.target.value })}
                      className="flex-1 rounded border border-line bg-surface px-2 py-1.5 text-sm"
                    />
                    <button type="button" onClick={() => removeOption(qi, oi)} className="text-clay text-xs shrink-0">
                      Remove
                    </button>
                  </div>
                ))}
                <Button type="button" variant="secondary" size="sm" onClick={() => addOption(qi)} className="self-start">
                  Add option
                </Button>
              </div>

              <Input
                label="Points"
                type="number"
                value={q.points}
                onChange={(e) => updateQuestion(qi, { points: Number(e.target.value) })}
              />
            </div>
          ))}
          <Button type="button" variant="secondary" onClick={addQuestion} className="self-start">
            Add question
          </Button>
        </div>

        {error && <p className="text-sm text-clay">{error}</p>}
        <div className="flex gap-3">
          <Button type="submit" disabled={saving}>
            {saving ? '…' : 'Save'}
          </Button>
          <Button type="button" variant="secondary" onClick={() => navigate('/admin/exams')}>
            Back to list
          </Button>
        </div>
      </form>
    </div>
  );
}
