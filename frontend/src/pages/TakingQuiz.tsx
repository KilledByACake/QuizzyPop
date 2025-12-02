/**
 * TakingQuiz Page
 * 
 * Interactive quiz player where users answer questions one at a time. Features question
 * navigation (previous/next), progress tracking, and answer validation. On completion,
 * submits answers to backend for scoring and redirects to results page.
 * 
 * Key Features:
 * - Single question view with multiple-choice answers
 * - Progress bar and answered count tracking
 * - Previous/Next navigation between questions
 * - Prevents advancing without selecting an answer
 * - Submit button appears on last question (requires all questions answered)
 * - Passes quiz results to QuizCompleted page via navigation state
 */

import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api";

import Button from "../components/Button";
import Loader from "../components/Loader";
import Error from "../components/Error";
import Card from "../components/Card";
import StatCard from "../components/StatCard";

import styles from "./TakingQuiz.module.css";
import { safeDecode } from "zod";

/**
 * Structure of a quiz question with multiple-choice options
 */
interface Question {
  /** Unique question identifier */
  id: number;
  /** Question text displayed to user */
  text: string;
  /** Array of possible answer choices */
  choices: string[];
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
 * Answer submission payload structure for backend
 */
interface SubmitAnswer {
  /** ID of the question being answered */
  questionId: number;
  /** Index of the selected choice (0-based) */
  selectedChoiceIndex: number;
}

/**
 * TakingQuiz Component
 * 
 * Main quiz-taking interface with question navigation and answer selection.
 * Fetches quiz questions from backend, manages answer state, and submits completed
 * quiz for scoring.
 * 
 * @returns Interactive quiz player with navigation and progress tracking
 */
const TakingQuiz = () => {
  // Extract quiz ID from URL parameters
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // State management
  const [quiz, setQuiz] = useState<QuizWithQuestions | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0); // Current question index (0-based)
  const [selectedAnswers, setSelectedAnswers] = useState<
    Record<number, number | null>
  >({}); // Map of questionId -> selected choice index
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

        // GET /api/quizzes/{id}/with-questions endpoint
        const res = await api.get<QuizWithQuestions>(
          `/api/quizzes/${id}/with-questions`,
        );

        setQuiz(res.data);

        // Initialize answer state: all questions start with null (unanswered)
        const initial: Record<number, number | null> = {};
        res.data.questions.forEach((q) => {
          initial[q.id] = null;
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

  // Calculate progress percentage for progress bar
  const progressPercent =
    totalQuestions > 0 ? ((currentIndex + 1) / totalQuestions) * 100 : 0;

  // Count how many questions have been answered
  const answeredCount =
    quiz?.questions.filter(
      (q) =>
        selectedAnswers[q.id] !== null &&
        selectedAnswers[q.id] !== undefined,
    ).length ?? 0;

  // Check if user is on the last question
  const isLastQuestion =
    !!quiz && currentIndex === quiz.questions.length - 1;

  // Check if all questions have been answered (required for submission)
  const allAnswered =
    !!quiz &&
    quiz.questions.every(
      (q) =>
        selectedAnswers[q.id] !== null &&
        selectedAnswers[q.id] !== undefined,
    );

  // ====== EVENT HANDLERS ======

  /**
   * Handle answer selection for current question
   * 
   * @param questionId - ID of the question being answered
   * @param choiceIndex - Index of the selected choice (0-based)
   */
  const handleOptionChange = (questionId: number, choiceIndex: number) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: choiceIndex,
    }));
  };

  /**
   * Navigate to previous question (disabled on first question)
   */
  const handlePrevious = () => {
    setCurrentIndex((prev) => Math.max(prev - 1, 0));
  };

  /**
   * Navigate to next question (disabled on last question)
   */
  const handleNext = () => {
    if (!quiz) return;
    setCurrentIndex((prev) => Math.min(prev + 1, quiz.questions.length - 1));
  };

  /**
   * Submit all answers to backend for scoring.
   * POST /api/quizzes/{id}/submit endpoint (currently returns 404 - not implemented).
   * On success, navigates to QuizCompleted page with result data.
   */
  const handleSubmit = async () => {
    if (!quiz) return;

    // Build payload: filter out unanswered questions
    const payload: SubmitAnswer[] = quiz.questions
      .map((q) => {
        const selectedIndex = selectedAnswers[q.id];
        if (selectedIndex === null || selectedIndex === undefined) {
          return null;
        }

        return {
          questionId: q.id,
          selectedChoiceIndex: selectedIndex,
        };
      })
      .filter((x): x is SubmitAnswer => x !== null);

    try {
      setSubmitting(true);
      setError(null);

      // Submit answers for scoring
      const res = await api.post(`/api/quizzes/${quiz.id}/submit`, {
        answers: payload,
      });

      // Navigate to results page with score data
      navigate(`/quiz/${quiz.id}/completed`, { state: res.data });
    } catch (err) {
      console.error(err);
      setError("Could not submit the quiz.");
    } finally {
      setSubmitting(false);
    }
  };

  // ====== RENDER: ERROR STATES ======

  // Missing quiz ID in URL
  if (!id) {
    return (
      <section className={`qp-page ${styles["taking-quiz-page"]}`}>
        <div className={styles["taking-container"]}>
          <Error message="Missing quiz ID in URL." />
          <div className={styles["error-actions"]}>
            <Button
              type="button"
              variant="gray"
              onClick={() => navigate(-1)}
            >
              ← Back
            </Button>
          </div>
        </div>
      </section>
    );
  }

  // Loading state while fetching quiz data
  if (loading) {
    return (
      <section
        className={`qp-page ${styles["taking-quiz-page"]}`}
        aria-busy="true"
        aria-describedby="quiz-loading"
      >
        <div className={styles["taking-container"]}>
          <div id="quiz-loading">
            <Loader text="Loading quiz..." />
          </div>
        </div>
      </section>
    );
  }

  // Error state if quiz failed to load
  if (error) {
    return (
      <section className={`qp-page ${styles["taking-quiz-page"]}`}>
        <div className={styles["taking-container"]}>
          <Error message={error} />
          <div className={styles["error-actions"]}>
            <Button
              type="button"
              variant="gray"
              onClick={() => navigate(-1)}
            >
              ← Back
            </Button>
          </div>
        </div>
      </section>
    );
  }

  // Quiz loaded but has no questions
  if (!loading && quiz && totalQuestions === 0) {
    return (
      <section className={`qp-page ${styles["taking-quiz-page"]}`}>
        <div className={styles["taking-container"]}>
          <Card variant="elevated" className={styles["quiz-card"]}>
            <h1 className={styles["question-title"]}>{quiz.title}</h1>
            <p className={styles["no-questions"]}>
              This quiz doesn&apos;t have any questions yet. Please check back
              later.
            </p>
          </Card>
        </div>
      </section>
    );
  }

  // Quiz or current question not found
  if (!quiz || !currentQuestion) {
    return (
      <section className={`qp-page ${styles["taking-quiz-page"]}`}>
        <div className={styles["taking-container"]}>
          <Error message="Quiz not found." />
          <div className={styles["not-found-actions"]}>
            <Button
              type="button"
              variant="gray"
              onClick={() => navigate(-1)}
            >
              ← Back
            </Button>
          </div>
        </div>
      </section>
    );
  }

  // Get selected answer for current question
  const currentSelected = selectedAnswers[currentQuestion.id];

  // ====== RENDER: MAIN QUIZ INTERFACE ======

  return (
    <section className={`qp-page ${styles["taking-quiz-page"]}`}>
      <div className={styles["taking-container"]}>
        {/* Header with title, stats, and progress bar */}
        <header className={styles["taking-header"]}>
          <h1 className={styles["question-title"]}>{quiz.title}</h1>

          {/* Stats: current question number and answered count */}
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

          {/* Progress bar showing quiz completion */}
          <div
            className={styles["progress-wrapper"]}
            role="progressbar"
            tabIndex={0}
            aria-label="Quiz progress"
            aria-valuemin={1}
            aria-valuemax={totalQuestions}
            aria-valuenow={currentIndex + 1}
          >
            <div
              className={styles["progress-bar"]}
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </header>

        {/* Question card with multiple-choice answers */}
        <Card variant="elevated" className={styles["quiz-card"]}>
          <h2
            id={`question-${currentQuestion.id}`}
            className={styles["question-text"]}
          >
            {currentQuestion.text}
          </h2>

          {/* Answer choices as radio buttons */}
          <fieldset
            className={styles.answers}
            aria-labelledby={`question-${currentQuestion.id}`}
          >
            {currentQuestion.choices.map((choice, index) => (
              <label className={styles["answer-option"]} key={index}>
                <input
                  type="radio"
                  name={`question-${currentQuestion.id}`}
                  value={index}
                  checked={currentSelected === index}
                  onChange={() =>
                    handleOptionChange(currentQuestion.id, index)
                  }
                />
                <span>{choice}</span>
              </label>
            ))}
          </fieldset>
        </Card>

        {/* Navigation buttons: Previous, Next, or Finish */}
        <div className={styles["nav-buttons"]}>
          {/* Previous button (hidden on first question) */}
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

          {/* Last question: show Finish button (requires all questions answered) */}
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
            // Not last question: show Next button (requires current question answered)
            <Button
              type="button"
              variant="primary"
              className={`${styles["btn-nav"]} ${styles["btn-next"]}`}
              onClick={handleNext}
              disabled={
                currentSelected === null ||
                currentSelected === undefined
              }
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

