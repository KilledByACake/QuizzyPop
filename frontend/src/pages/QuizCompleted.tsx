/**
 * QuizCompleted Page
 * 
 * Displays the final results after a user completes a quiz. Shows score, correct answers,
 * difficulty level, and optional feedback messages. Provides options to take another quiz
 * or retake the same quiz.
 * 
 * Result data is passed via React Router location state from TakingQuiz page after
 * submitting answers. If no state exists (e.g., user hard-refreshes), displays an error
 * message with navigation back to quiz browsing.
 * 
 * Key Features:
 * - Score display with percentage and correct answer count
 * - Celebrating mascot animation for positive reinforcement
 * - StatCards for visual result presentation
 * - Accessibility: ARIA labels, live regions, screen reader summaries
 * - Navigation options: take another quiz or retake current quiz
 */

import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Button from "../components/Button";
import Card from "../components/Card";
import StatCard from "../components/StatCard";
import Error from "../components/Error";
import Mascot from "../components/Mascot";
import styles from "./QuizCompleted.module.css";

/**
 * Structure of quiz result data passed from TakingQuiz page
 */
interface QuizResult {
  /** Unique identifier for the quiz */
  quizId: number;
  /** Display title of the completed quiz */
  quizTitle: string;
  /** Number of questions answered correctly */
  correctAnswers: number;
  /** Total number of questions in the quiz */
  totalQuestions: number;
  /** Percentage score (0-100) */
  score: number;
  /** Difficulty level (Easy, Medium, Hard) */
  difficulty: string;
  /** Optional array of feedback messages based on performance */
  feedbackMessages?: string[];
}

/**
 * QuizCompleted Component
 * 
 * Final page in the quiz-taking flow. Receives result data from TakingQuiz via
 * location.state and displays performance metrics with celebration visuals.
 * 
 * @returns Results page with score display and navigation options, or error if no data
 */
const QuizCompleted = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // Extract result data from navigation state
  const result = location.state as QuizResult | undefined;

  // Update document title with quiz name for better browser history
  useEffect(() => {
    if (result) {
      document.title = `Quiz result - ${result.quizTitle} | Quizzy Pop`;
    } else {
      document.title = "Quiz result - Quizzy Pop";
    }
  }, [result]);

  // Handle case where no result data exists (page refresh, direct navigation)
  if (!result) {
    return (
      <section
        className={styles["qp-publish-success"]}
        aria-live="polite"
        aria-label="Quiz result not available"
      >
        <div className={styles["qp-publish__header"]}>
          <Error message="No result data found." />
        </div>
        <div className={styles["qp-publish__actions"]}>
          <Button
            type="button"
            variant="primary"
            className={`${styles["qp-btn"]} ${styles["qp-btn--primary"]}`}
            onClick={() => navigate("/quizzes")}
          >
            Back to quizzes
          </Button>
        </div>
      </section>
    );
  }

  // Format score and correct answers for display
  const scoreLabel = `${result.score}%`;
  const correctLabel = `${result.correctAnswers}/${result.totalQuestions}`;

  return (
    <section
      className={styles["qp-publish-success"]}
      aria-labelledby="quiz-completed-heading"
      aria-live="polite" // Announces content changes to screen readers
    >
      {/* Header with celebration message and quiz title */}
      <div className={styles["qp-publish__header"]}>
        <h1 id="quiz-completed-heading">🎉 Great Job!</h1>
        <p>
          You&apos;ve completed the quiz: <strong>{result.quizTitle}</strong>
        </p>
        {/* Hidden summary for screen readers - provides complete context */}
        <p id="quiz-score-summary" className="sr-only">
          You scored {result.score} percent, with {result.correctAnswers} correct
          answers out of {result.totalQuestions} questions. Difficulty level was{" "}
          {result.difficulty}.
        </p>
      </div>

      {/* Celebrating mascot for positive reinforcement */}
      <div className={styles["qp-publish__mascot"]} aria-hidden="true">
        <Mascot
          variant="celebrate"
          size="large"
          alt="QuizzyPop mascot celebrating your results"
        />
      </div>

      {/* Main results card with score breakdown */}
      <Card
        variant="elevated"
        className={styles["qp-quiz-card"]}
        aria-describedby="quiz-score-summary" // Links to hidden summary for accessibility
      >
        <header>
          <h2>Your Results</h2>
        </header>

        {/* Statistical display of results using StatCard components */}
        <div className={styles["qp-quiz__meta"]}>
          <StatCard
            number={correctLabel}
            label="Correct answers"
            variant="primary"
          />
          <StatCard
            number={scoreLabel}
            label="Score"
            variant="secondary"
          />
          <StatCard
            number={result.difficulty}
            label="Difficulty"
            variant="secondary"
          />
        </div>

        {/* Optional feedback messages (e.g., "Perfect score!", "Good job!") */}
        {(result.feedbackMessages?.length ?? 0) > 0 && (
          <div className={styles["qp-feedback"]}>
            {result.feedbackMessages!.map((msg, i) => (
              <p className={styles["qp-feedback-line"]} key={i}>
                {msg}
              </p>
            ))}
          </div>
        )}
      </Card>

      {/* Action buttons for next steps */}
      <div className={styles["qp-publish__actions"]}>
        {/* Navigate to quiz browsing page */}
        <Button
          type="button"
          variant="primary"
          className={`${styles["qp-btn"]} ${styles["qp-btn--primary"]}`}
          onClick={() => navigate("/quizzes")}
        >
          Take another quiz
        </Button>

        {/* Retake the same quiz to improve score */}
        <Button
          type="button"
          variant="gray"
          className={`${styles["qp-btn"]} ${styles["qp-btn--secondary"]}`}
          onClick={() => navigate(`/quiz/${result.quizId}/take`)}
        >
          Retake quiz 🔁
        </Button>
      </div>
    </section>
  );
};

export default QuizCompleted;