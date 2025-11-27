// frontend/src/pages/QuizCompleted.tsx
import { useLocation, useNavigate } from "react-router-dom";
import Button from "../components/Button";
import Card from "../components/Card";
import StatCard from "../components/StatCard";
import Error from "../components/Error";
import Mascot from "../components/Mascot";
import styles from "./QuizCompleted.module.css";

interface QuizResult {
  quizId: number;
  quizTitle: string;
  correctAnswers: number;
  totalQuestions: number;
  score: number;
  difficulty: string;
  feedbackMessages?: string[];
}

const QuizCompleted = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const result = location.state as QuizResult | undefined;

  // Ingen resultater – typisk hvis man hard-refresh'er siden
  if (!result) {
    return (
      <section className={styles["qp-publish-success"]}>
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

  const scoreLabel = `${result.score}%`;
  const correctLabel = `${result.correctAnswers}/${result.totalQuestions}`;

  return (
    <section className={styles["qp-publish-success"]}>
      <div className={styles["qp-publish__header"]}>
        <h1>🎉 Great Job!</h1>
        <p>
          You've completed the quiz: <strong>{result.quizTitle}</strong>
        </p>
      </div>

      <div className={styles["qp-publish__mascot"]}>
        <Mascot
          variant="celebrate"
          size="large"
          alt="QuizzyPop mascot celebrating your results"
        />
      </div>

      <Card variant="elevated" className={styles["qp-quiz-card"]}>
        <header>
          <h2>Your Results</h2>
        </header>

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

      <div className={styles["qp-publish__actions"]}>
        <Button
          type="button"
          variant="primary"
          className={`${styles["qp-btn"]} ${styles["qp-btn--primary"]}`}
          onClick={() => navigate("/quizzes")}
        >
          Take another quiz
        </Button>

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
