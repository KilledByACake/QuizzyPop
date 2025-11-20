import { useLocation, useNavigate } from "react-router-dom";
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

  if (!result) {
    return (
      <section className={styles["qp-publish-success"]}>
        <div className={styles["qp-publish__header"]}>
          <h1>Quiz Completed</h1>
          <p>No result data found.</p>
        </div>
      </section>
    );
  }

  return (
    <section className={styles["qp-publish-success"]}>
      <div className={styles["qp-publish__header"]}>
        <h1>🎉 Great Job!</h1>
        <p>
          You've completed the quiz: <strong>{result.quizTitle}</strong>
        </p>
      </div>

      <div className={styles["qp-publish__mascot"]}>
        <img src="/images/quizzy-celebrate.png" alt="Mascot" />
      </div>

      <article className={styles["qp-quiz-card"]}>
        <header>
          <h2>Your Results</h2>
        </header>

        <div className={styles["qp-quiz__meta"]}>
          <span>
            <strong>{result.correctAnswers}</strong> / {result.totalQuestions}{" "}
            correct
          </span>
          <span>
            Score: <strong>{result.score}%</strong>
          </span>
          <span>Difficulty: {result.difficulty}</span>
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
      </article>

      <div className={styles["qp-publish__actions"]}>
        <button
          className={`${styles["qp-btn"]} ${styles["qp-btn--primary"]}`}
          onClick={() => navigate("/quizzes")}
        >
          Take another quiz
        </button>

        <button
          className={`${styles["qp-btn"]} ${styles["qp-btn--secondary"]}`}
          onClick={() => navigate(`/quiz/${result.quizId}/take`)}
        >
          Retake quiz 🔁
        </button>
      </div>
    </section>
  );
};

export default QuizCompleted;
