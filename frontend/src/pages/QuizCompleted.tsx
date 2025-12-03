// QuizCompleted Page
// Displays final results for a completed quiz and stores a local attempt record.
import { useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import Button from "../components/Button";
import Card from "../components/Card";
import StatCard from "../components/StatCard";
import Error from "../components/Error";
import Mascot from "../components/Mascot";
import styles from "./QuizCompleted.module.css";

// Structure of quiz result data passed from TakingQuiz page.
// The backend payload may vary, so fields are treated as optional.
interface QuizResult {
  quizId?: number;
  quizTitle?: string;
  correctAnswers?: number;
  totalQuestions?: number;
  score?: number; // may be raw correct count, fraction, or percentage
  difficulty?: string;
  feedbackMessages?: string[];
}

// Local record of a quiz attempt stored in localStorage.
// Used by MyPage to show quizzes taken and average score.
interface QuizAttempt {
  quizId: number;
  quizTitle: string;
  score: number; // normalized percentage 0–100
  completedAt: string;
}

// Safely normalizes a score to a 0–100 percentage
function normalizeScore(result: QuizResult): number {
  const correct = result.correctAnswers;
  const total = result.totalQuestions;
  const rawScore = result.score;

  // Prefer correct/total if present
  if (
    typeof correct === "number" &&
    typeof total === "number" &&
    total > 0
  ) {
    return Math.round((correct / total) * 100);
  }

  // If no rawScore, fallback to 0
  if (rawScore == null) return 0;

  // If score already looks like a percentage (0–100), keep it
  if (rawScore >= 0 && rawScore <= 100) return Math.round(rawScore);

  // If score is between 0 and 1, treat as fraction
  if (rawScore > 0 && rawScore < 1) {
    return Math.round(rawScore * 100);
  }

  // Otherwise, guess based on totalQuestions if we have it
  if (typeof total === "number" && total > 0) {
    return Math.round((rawScore / total) * 100);
  }

  // Fallback: clamp to [0, 100]
  return Math.max(0, Math.min(100, Math.round(rawScore)));
}

const QuizCompleted = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { id: routeId } = useParams<{ id: string }>();

  // Result from navigation state (set by TakingQuiz after submit)
  const rawResult = location.state as QuizResult | undefined;

  // If the user refreshed or hit this route directly, there is no state
  if (!rawResult) {
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

  // Fallback quizId: prefer state, otherwise parse it from the route
  const quizId =
    rawResult.quizId ??
    (routeId ? Number(routeId) : NaN);

  // Normalize core result fields with safe fallbacks
  const normalizedScore = normalizeScore(rawResult);
  const correctAnswers = rawResult.correctAnswers ?? 0;
  const totalQuestions = rawResult.totalQuestions ?? 0;
  const quizTitle = rawResult.quizTitle ?? "Quiz";
  const difficulty = rawResult.difficulty ?? "Unknown";

  const scoreLabel = `${normalizedScore}%`;
  const correctLabel =
    totalQuestions > 0
      ? `${correctAnswers}/${totalQuestions}`
      : `${correctAnswers}`;

  // Persist attempt in localStorage so MyPage can show basic stats
  useEffect(() => {
    if (!quizId || Number.isNaN(quizId)) return;

    try {
      const raw = localStorage.getItem("quiz_attempts");
      const attempts: QuizAttempt[] = raw ? JSON.parse(raw) : [];

      attempts.push({
        quizId,
        quizTitle,
        score: normalizedScore,
        completedAt: new Date().toISOString(),
      });

      localStorage.setItem("quiz_attempts", JSON.stringify(attempts));
    } catch (err) {
      console.error("Failed to save quiz attempt:", err);
    }
  }, [quizId, quizTitle, normalizedScore]);

  // Update browser tab title for clearer history
  useEffect(() => {
    document.title = `Quiz result - ${quizTitle} | Quizzy Pop`;
  }, [quizTitle]);

  return (
    <section
      className={styles["qp-publish-success"]}
      aria-labelledby="quiz-completed-heading"
      aria-live="polite"
    >
      {/* Header with celebration message and quiz title */}
      <div className={styles["qp-publish__header"]}>
        <h1 id="quiz-completed-heading">🎉 Great Job!</h1>
        <p>
          You&apos;ve completed the quiz: <strong>{quizTitle}</strong>
        </p>
        {/* Hidden summary for screen readers - provides complete context */}
        <p id="quiz-score-summary" className="sr-only">
          You scored {normalizedScore} percent, with {correctAnswers} correct
          answers out of {totalQuestions} questions. Difficulty level was{" "}
          {difficulty}.
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
        aria-describedby="quiz-score-summary"
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
          <StatCard number={scoreLabel} label="Score" variant="secondary" />
          <StatCard number={difficulty} label="Difficulty" variant="secondary" />
        </div>

        {/* Optional feedback messages (e.g., "Perfect score!", "Good job!") */}
        {(rawResult.feedbackMessages?.length ?? 0) > 0 && (
          <div className={styles["qp-feedback"]}>
            {rawResult.feedbackMessages!.map((msg, i) => (
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
          onClick={() =>
            quizId && !Number.isNaN(quizId)
              ? navigate(`/quiz/${quizId}/take`)
              : navigate("/quizzes")
          }
        >
          Retake quiz 🔁
        </Button>
      </div>
    </section>
  );
};

export default QuizCompleted;
