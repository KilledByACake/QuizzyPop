import { useEffect, useMemo, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import api from '../api';
import Input from '../components/Input';
import Textarea from '../components/Textarea';
import Select from '../components/Select';
import Button from '../components/Button';
import { addQuestionsSchema } from '../schemas/questionSchemas';
import type { AddQuestionsForm } from '../schemas/questionSchemas';
import styles from './AddQuestions.module.css';

const DRAFT_KEY_PREFIX = 'questions_draft_';

export default function AddQuestions() {
  const { id: quizId } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const [notice, setNotice] = useState<string | null>(null);

  const DRAFT_KEY = useMemo(() => `${DRAFT_KEY_PREFIX}${quizId}`, [quizId]);

  const { control, register, handleSubmit, setValue, watch, reset, formState: { errors, isSubmitting } } =
    useForm<AddQuestionsForm>({
      resolver: zodResolver(addQuestionsSchema),
      defaultValues: {
        questions: [
          {
            type: 'multiple-choice',
            text: '',
            options: ['', '', '', ''],
            correctIndex: 0,
          } as any,
        ],
      },
    });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'questions',
  });

  // Restore draft after login
  useEffect(() => {
    const draftRaw = localStorage.getItem(DRAFT_KEY);
    if (draftRaw && location.state?.fromLogin) {
      try {
        const draft = JSON.parse(draftRaw);
        reset(draft);
        localStorage.removeItem(DRAFT_KEY);
      } catch {
        // ignore
      }
    }
  }, [DRAFT_KEY, location.state, reset]);

  const saveDraft = () => {
    const data = watch();
    localStorage.setItem(DRAFT_KEY, JSON.stringify(data));
  };

  const addNewQuestion = () => {
    append({
      type: 'multiple-choice',
      text: '',
      options: ['', '', '', ''],
      correctIndex: 0,
    } as any);
  };

  const onSubmit = async (data: AddQuestionsForm) => {
    if (!quizId) {
      setNotice('Missing quiz id in the URL.');
      return;
    }

    setNotice(null);

    // Warn for unsupported types by the backend (only multiple-choice supported now)
    const unsupported = data.questions.filter(q => q.type !== 'multiple-choice');
    if (unsupported.length > 0) {
      setNotice('Note: Only multiple-choice questions are published now. Other types are saved locally for now.');
      // Keep them in localStorage
      saveDraft();
    }

    // Publish multiple-choice questions
    const mcQuestions = data.questions
      .map((q, idx) => ({ q, idx }))
      .filter(({ q }) => q.type === 'multiple-choice') as any[];

    try {
      await Promise.all(
        mcQuestions.map(({ q }) => {
          // Backend expects: Text, Choices, CorrectAnswerIndex
          const payload = {
            text: q.text,
            choices: q.options,
            correctAnswerIndex: q.correctIndex,
          };
          return api.post(`/api/quizzes/${quizId}/questions`, payload);
        })
      );

      // Optionally clear draft if there are no unsupported questions left
      if (unsupported.length === 0) {
        localStorage.removeItem(DRAFT_KEY);
      }

      // Navigate to published page
      navigate(`/quiz/${quizId}/published`);
    } catch (err: any) {
      setNotice(err.response?.data?.message || 'Failed to publish questions. Please try again.');
      console.error('Publish error:', err);
    }
  };

  const typeOptions = [
    { value: 'multiple-choice', label: 'Multiple Choice' },
    { value: 'true-false', label: 'True / False' },
    { value: 'fill-blank', label: 'Fill in the Blank' },
    { value: 'short', label: 'Short Answer' },
    { value: 'long', label: 'Long Answer' },
    { value: 'multi-select', label: 'Multi Select' },
  ];

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Add Questions</h1>
        <p className={styles.subtitle}>Quiz ID: {quizId}</p>
      </div>

      {notice && <div className={styles.notice}>{notice}</div>}

      <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
        {fields.map((field, index) => {
          const qType = watch(`questions.${index}.type`);
          const qErrors = (errors.questions?.[index] as any) || {};

          return (
            <div key={field.id} className={styles.questionCard}>
              <div className={styles.row}>
                <Select
                  label="Question Type"
                  options={typeOptions}
                  {...register(`questions.${index}.type` as const)}
                  error={qErrors?.type?.message}
                  required
                />
                <div className={styles.typeHint}>
                  {qType === 'multiple-choice' && 'Provide 4 options and mark the correct one.'}
                  {qType === 'true-false' && 'Pick whether the correct answer is True or False.'}
                  {qType === 'fill-blank' && 'Provide the expected answer text.'}
                  {qType === 'short' && 'Provide the expected short answer.'}
                  {qType === 'long' && 'Provide the expected long answer.'}
                  {qType === 'multi-select' && 'Provide 4 options and select all correct ones.'}
                </div>
              </div>

              <Textarea
                label={`Question ${index + 1}`}
                placeholder="Type your question here..."
                rows={3}
                {...register(`questions.${index}.text` as const)}
                error={qErrors?.text?.message}
                required
              />

              {/* Type-specific editors */}
              {qType === 'multiple-choice' && (
                <div className={styles.optionsGrid}>
                  {[0, 1, 2, 3].map((optIdx) => (
                    <div key={optIdx} className={styles.optionRow}>
                      <input
                        type="radio"
                        name={`questions-${index}-correct`}
                        className={styles.correctRadio}
                        checked={watch(`questions.${index}.correctIndex`) === optIdx}
                        onChange={() => setValue(`questions.${index}.correctIndex`, optIdx)}
                        aria-label={`Mark option ${optIdx + 1} as correct`}
                      />
                      <Input
                        placeholder={`Option ${optIdx + 1}`}
                        {...register(`questions.${index}.options.${optIdx}` as const)}
                      />
                    </div>
                  ))}
                  {qErrors?.options?.message && (
                    <span className={styles.errorText}>{qErrors.options.message as string}</span>
                  )}
                  {qErrors?.correctIndex?.message && (
                    <span className={styles.errorText}>{qErrors.correctIndex.message as string}</span>
                  )}
                </div>
              )}

              {qType === 'true-false' && (
                <div className={styles.tfRow}>
                  <label className={styles.tfLabel}>Correct answer:</label>
                  <div className={styles.tfChoices}>
                    <label className={styles.tfChoice}>
                      <input
                        type="radio"
                        checked={watch(`questions.${index}.correctBool`) === true}
                        onChange={() => setValue(`questions.${index}.correctBool`, true)}
                      />
                      True
                    </label>
                    <label className={styles.tfChoice}>
                      <input
                        type="radio"
                        checked={watch(`questions.${index}.correctBool`) === false}
                        onChange={() => setValue(`questions.${index}.correctBool`, false)}
                      />
                      False
                    </label>
                  </div>
                  {qErrors?.correctBool?.message && (
                    <span className={styles.errorText}>{qErrors.correctBool.message as string}</span>
                  )}
                </div>
              )}

              {(qType === 'fill-blank' || qType === 'short' || qType === 'long') && (
                <Input
                  label="Correct Answer"
                  placeholder="Enter the expected answer"
                  {...register(`questions.${index}.answer` as const)}
                  error={qErrors?.answer?.message}
                  required
                />
              )}

              {qType === 'multi-select' && (
                <div className={styles.optionsGrid}>
                  {[0, 1, 2, 3].map((optIdx) => {
                    const selected = (watch(`questions.${index}.correctIndexes`) || []) as number[];
                    const toggle = () => {
                      const next = new Set(selected);
                      if (next.has(optIdx)) next.delete(optIdx);
                      else next.add(optIdx);
                      setValue(`questions.${index}.correctIndexes`, Array.from(next).sort());
                    };
                    return (
                      <div key={optIdx} className={styles.optionRow}>
                        <input
                          type="checkbox"
                          className={styles.correctCheckbox}
                          checked={selected.includes(optIdx)}
                          onChange={toggle}
                          aria-label={`Toggle option ${optIdx + 1} as correct`}
                        />
                        <Input
                          placeholder={`Option ${optIdx + 1}`}
                          {...register(`questions.${index}.options.${optIdx}` as const)}
                        />
                      </div>
                    );
                  })}
                  {qErrors?.options?.message && (
                    <span className={styles.errorText}>{qErrors.options.message as string}</span>
                  )}
                  {qErrors?.correctIndexes?.message && (
                    <span className={styles.errorText}>{qErrors.correctIndexes.message as string}</span>
                  )}
                </div>
              )}

              <div className={styles.cardActions}>
                <Button
                  type="button"
                  variant="danger"
                  onClick={() => remove(index)}
                >
                  Remove
                </Button>
              </div>
            </div>
          );
        })}

        <div className={styles.footerActions}>
          <Button type="button" variant="secondary" onClick={addNewQuestion}>
            + Add Question
          </Button>
          <div className={styles.rightActions}>
            <Button type="button" variant="gray" onClick={() => { saveDraft(); navigate(-1); }}>
              Save Draft
            </Button>
            <Button type="submit" variant="primary" disabled={isSubmitting}>
              {isSubmitting ? 'Publishing...' : 'Finish & Publish'}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}