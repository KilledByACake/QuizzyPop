/**
 * TakingQuiz Page
 * 
 * Interactive quiz player where users answer questions one at a time. Features question
 * navigation (previous/next), progress tracking, and answer validation. On completion,
 * submits answers to backend for scoring and redirects to results page.
 * 
 * IMPLEMENTATION STATUS:
 * 
 * FULLY IMPLEMENTED:
 * - Multiple-choice questions with radio button selection
 * - True/false questions with True/False button selection
 * - Fill-blank, short, long answer questions with text input
 * - Multi-select questions with checkbox selection
 * - Progress tracking and question navigation
 * - Answer submission and scoring
 * 
 * NOTE: Backend scoring currently only supports multiple-choice questions.
 * Other question types are displayed and answered but may not be scored correctly.
 */

import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api";

import Button from "../components/Button";
import Loader from "../components/Loader";
import Error from "../components/Error";
import Card from "../components/Card";
import StatCard from "../components/StatCard";
import Input from "../components/Input";

import styles from "./TakingQuiz.module.css";

/**
 * Structure of a quiz question with various types
 */
interface Question {
  /** Unique question identifier */
  id: number;
  /** Question text displayed to user */
  text: string;
  /** Question type */
  type: string;
  /** Array of possible answer choices (for multiple-choice, multi-select) */
  choices: string[];
  /** Correct answer index for multiple-choice */
  correctAnswerIndex?: number;
  /** Correct answer indexes for multi-select */
  correctAnswerIndexes?: number[];
  /** Correct boolean for true/false */
  correctBool?: boolean;
  /** Correct text answer for fill-blank, short, long */
  correctAnswer?: string;
}

/**
 * Quiz object with full question data
 */
interface QuizWithQuestions {
  /** Unique quiz identifier */
  id: number;
  /** Quiz display title */
  title: string;
  /** Array of all questions in the quiz */
  questions: Question[];
}

/**
 * Answer type - can be number, boolean, string, or array
 */
type AnswerValue = number | boolean | string | number[] | null;

/**
 * Answer submission payload structure for backend
 */
interface SubmitAnswer {
  /** ID of the question being answered */
  questionId: number;
  /** Index of the selected choice (for multiple-choice) */
  selectedChoiceIndex?: number;
  /** Selected indexes (for multi-select) */
  selectedChoiceIndexes?: number[];
  /** Selected boolean (for true/false) */
  selectedBool?: boolean;
  /** Entered text (for fill-blank, short, long) */
  enteredAnswer?: string;
}

/**
 * TakingQuiz Component
 * 
 * Main quiz-taking interface with question navigation and answer selection.
 * Supports multiple question types: multiple-choice, true/false, fill-blank, short, long, multi-select.
 * 
 * @returns Interactive quiz player with navigation and progress tracking
 */
const TakingQuiz = () => {
  // Extract quiz ID from URL parameters
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // State management
  const [quiz, setQuiz] = useState<QuizWithQuestions | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, AnswerValue>>({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Update document title for browser tab
  useEffect(() => {
    document.title = "Take Quiz - Quizzy Pop";
  }, []);

  // Fetch quiz data and questions from backend
  useEffect(() => {
    if (!id) return;

    const fetchQuiz = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await api.get<QuizWithQuestions>(
          `/api/quizzes/${id}/with-questions`,
        );

        setQuiz(res.data);

        // Initialize answer state: all questions start with null (unanswered)
        const initial: Record<number, AnswerValue> = {};
        res.data.questions.forEach((q) => {
          // For multi-select, initialize with empty array
          initial[q.id] = q.type === 'multi-select' ? [] : null;
        });
        setSelectedAnswers(initial);
      } catch (err) {
        console.error(err);
        setError("Could not load the quiz.");
      } finally {
        setLoading(false);
      }
    };

    void fetchQuiz();
  }, [id]);

  // ====== DERIVED VALUES ======

  const totalQuestions = quiz?.questions.length ?? 0;
  const currentQuestion = quiz?.questions[currentIndex];

  const progressPercent =
    totalQuestions > 0 ? ((currentIndex + 1) / totalQuestions) * 100 : 0;

  // Count how many questions have been answered (including multi-select with at least one choice)
  const answeredCount =
    quiz?.questions.filter((q) => {
      const answer = selectedAnswers[q.id];
      if (q.type === 'multi-select') {
        return Array.isArray(answer) && answer.length > 0;
      }
      return answer !== null && answer !== undefined && answer !== '';
    }).length ?? 0;

  const isLastQuestion =
    !!quiz && currentIndex === quiz.questions.length - 1;

  // Check if all questions have been answered
  const allAnswered =
    !!quiz &&
    quiz.questions.every((q) => {
      const answer = selectedAnswers[q.id];
      if (q.type === 'multi-select') {
        return Array.isArray(answer) && answer.length > 0;
      }
      return answer !== null && answer !== undefined && answer !== '';
    });

  // ====== EVENT HANDLERS ======

  /**
   * Handle answer selection/change for current question
   */
  const handleAnswerChange = (questionId: number, value: AnswerValue) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: value,
    }));
  };

  /**
   * Handle multi-select checkbox toggle
   */
  const handleMultiSelectToggle = (questionId: number, index: number) => {
    setSelectedAnswers((prev) => {
      const current = (prev[questionId] as number[]) || [];
      const updated = current.includes(index)
        ? current.filter(i => i !== index)
        : [...current, index].sort();
      return {
        ...prev,
        [questionId]: updated,
      };
    });
  };

  const handlePrevious = () => {
    setCurrentIndex((prev) => Math.max(prev - 1, 0));
  };

  const handleNext = () => {
    if (!quiz) return;
    setCurrentIndex((prev) => Math.min(prev + 1, quiz.questions.length - 1));
  };

  /**
   * Submit all answers to backend for scoring
   */
  const handleSubmit = async () => {
    if (!quiz) return;

    // Build payload based on question types
    const payload: SubmitAnswer[] = quiz.questions
      .map((q) => {
        const answer = selectedAnswers[q.id];
        
        // Skip unanswered questions
        if (answer === null || answer === undefined || answer === '') {
          return null;
        }
        if (q.type === 'multi-select' && (!Array.isArray(answer) || answer.length === 0)) {
          return null;
        }

        const submission: SubmitAnswer = { questionId: q.id };

        switch (q.type) {
          case 'multiple-choice':
            submission.selectedChoiceIndex = answer as number;
            break;
          
          case 'multi-select':
            submission.selectedChoiceIndexes = answer as number[];
            break;
          
          case 'true-false':
            submission.selectedBool = answer as boolean;
            break;
          
          case 'fill-blank':
          case 'short':
          case 'long':
            submission.enteredAnswer = answer as string;
            break;
        }

        return submission;
      })
      .filter((x): x is SubmitAnswer => x !== null);

    try {
      setSubmitting(true);
      setError(null);

      const res = await api.post(`/api/quizzes/${quiz.id}/submit`, {
        answers: payload,
      });

      navigate(`/quiz/${quiz.id}/completed`, { state: res.data });
    } catch (err) {
      console.error(err);
      setError("Could not submit the quiz.");
    } finally {
      setSubmitting(false);
    }
  };

  // ====== RENDER: ERROR STATES ======

  if (!id) {
    return (
      <section className={`qp-page ${styles["taking-quiz-page"]}`}>
        <div className={styles["taking-container"]}>
          <Error message="Missing quiz ID in URL." />
          <div className={styles["error-actions"]}>
            <Button type="button" variant="gray" onClick={() => navigate(-1)}>
              ← Back
            </Button>
          </div>
        </div>
      </section>
    );
  }

  if (loading) {
    return (
      <section className={`qp-page ${styles["taking-quiz-page"]}`}>
        <div className={styles["taking-container"]}>
          <Loader text="Loading quiz..." />
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className={`qp-page ${styles["taking-quiz-page"]}`}>
        <div className={styles["taking-container"]}>
          <Error message={error} />
          <div className={styles["error-actions"]}>
            <Button type="button" variant="gray" onClick={() => navigate(-1)}>
              ← Back
            </Button>
          </div>
        </div>
      </section>
    );
  }

  if (!loading && quiz && totalQuestions === 0) {
    return (
      <section className={`qp-page ${styles["taking-quiz-page"]}`}>
        <div className={styles["taking-container"]}>
          <Card variant="elevated" className={styles["quiz-card"]}>
            <h1 className={styles["question-title"]}>{quiz.title}</h1>
            <p className={styles["no-questions"]}>
              This quiz doesn&apos;t have any questions yet.
            </p>
          </Card>
        </div>
      </section>
    );
  }

  if (!quiz || !currentQuestion) {
    return (
      <section className={`qp-page ${styles["taking-quiz-page"]}`}>
        <div className={styles["taking-container"]}>
          <Error message="Quiz not found." />
          <div className={styles["not-found-actions"]}>
            <Button type="button" variant="gray" onClick={() => navigate(-1)}>
              ← Back
            </Button>
          </div>
        </div>
      </section>
    );
  }

  const currentAnswer = selectedAnswers[currentQuestion.id];

  // Check if current question is answered
  const isCurrentAnswered = currentQuestion.type === 'multi-select'
    ? Array.isArray(currentAnswer) && currentAnswer.length > 0
    : currentAnswer !== null && currentAnswer !== undefined && currentAnswer !== '';

  // ====== RENDER: MAIN QUIZ INTERFACE ======

  return (
    <section className={`qp-page ${styles["taking-quiz-page"]}`}>
      <div className={styles["taking-container"]}>
        <header className={styles["taking-header"]}>
          <h1 className={styles["question-title"]}>{quiz.title}</h1>

          <div className={styles["stats-row"]}>
            <StatCard
              number={`${currentIndex + 1}/${totalQuestions}`}
              label="Question"
              variant="primary"
            />
            <StatCard
              number={`${answeredCount}/${totalQuestions}`}
              label="Answered"
              variant="secondary"
            />
          </div>

          <div className={styles["progress-wrapper"]}>
            <div
              className={styles["progress-bar"]}
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </header>

        <Card variant="elevated" className={styles["quiz-card"]}>
          <h2 className={styles["question-text"]}>
            {currentQuestion.text}
          </h2>

          {/* Render different question types */}
          
          {/* Multiple-choice: radio buttons */}
          {currentQuestion.type === 'multiple-choice' && (
            <fieldset className={styles.answers}>
              {currentQuestion.choices.map((choice, index) => (
                <label className={styles["answer-option"]} key={index}>
                  <input
                    type="radio"
                    name={`question-${currentQuestion.id}`}
                    value={index}
                    checked={currentAnswer === index}
                    onChange={() => handleAnswerChange(currentQuestion.id, index)}
                  />
                  <span>{choice}</span>
                </label>
              ))}
            </fieldset>
          )}

          {/* True/False: button toggle */}
          {currentQuestion.type === 'true-false' && (
            <div className={styles.tfRow}>
              {[true, false].map(val => (
                <button
                  key={String(val)}
                  type="button"
                  className={`${styles.tfChoice} ${currentAnswer === val ? styles.tfChoiceActive : ''}`}
                  onClick={() => handleAnswerChange(currentQuestion.id, val)}
                >
                  {val ? 'True' : 'False'}
                </button>
              ))}
            </div>
          )}

          {/* Text answer: input field */}
          {(currentQuestion.type === 'fill-blank' || 
            currentQuestion.type === 'short' || 
            currentQuestion.type === 'long') && (
            <Input
              placeholder="Enter your answer"
              value={(currentAnswer as string) || ''}
              onChange={(e) => handleAnswerChange(currentQuestion.id, e.target.value)}
            />
          )}

          {/* Multi-select: checkboxes */}
          {currentQuestion.type === 'multi-select' && (
            <fieldset className={styles.answers}>
              {currentQuestion.choices.map((choice, index) => {
                const selected = (currentAnswer as number[]) || [];
                return (
                  <label className={styles["answer-option"]} key={index}>
                    <input
                      type="checkbox"
                      checked={selected.includes(index)}
                      onChange={() => handleMultiSelectToggle(currentQuestion.id, index)}
                    />
                    <span>{choice}</span>
                  </label>
                );
              })}
            </fieldset>
          )}
        </Card>

        <div className={styles["nav-buttons"]}>
          {currentIndex > 0 ? (
            <Button
              type="button"
              variant="gray"
              className={`${styles["btn-nav"]} ${styles["btn-prev"]}`}
              onClick={handlePrevious}
            >
              ← Previous
            </Button>
          ) : (
            <span />
          )}

          {isLastQuestion ? (
            <Button
              type="button"
              variant="primary"
              className={`${styles["btn-nav"]} ${styles["btn-finish"]}`}
              onClick={handleSubmit}
              disabled={!allAnswered || submitting}
            >
              {submitting ? "Submitting..." : "Finish Quiz 🎉"}
            </Button>
          ) : (
            <Button
              type="button"
              variant="primary"
              className={`${styles["btn-nav"]} ${styles["btn-next"]}`}
              onClick={handleNext}
              disabled={!isCurrentAnswered}
            >
              Next →
            </Button>
          )}
        </div>
      </div>
    </section>
  );
};

export default TakingQuiz;

