// frontend/src/pages/TakingQuiz.tsx
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api";

import Button from "../components/Button";
import Loader from "../components/Loader";
import Error from "../components/Error";
import Card from "../components/Card";
import StatCard from "../components/StatCard";

import styles from "./TakingQuiz.module.css";

interface Question {
  id: number;
  text: string;
  choices: string[];
}

interface QuizWithQuestions {
  id: number;
  title: string;
  questions: Question[];
}

interface SubmitAnswer {
  questionId: number;
  selectedChoiceIndex: number;
}

const TakingQuiz = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [quiz, setQuiz] = useState<QuizWithQuestions | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<
    Record<number, number | null>
  >({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Set document title
  useEffect(() => {
    document.title = "Take Quiz - Quizzy Pop";
  }, []);

  // Fetch quiz + questions
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

        // init state for selected answers (null = not answered yet)
        const initial: Record<number, number | null> = {};
        res.data.questions.forEach((q) => {
          initial[q.id] = null;
        });
        setSelectedAnswers(initial);
      } catch (err) {
        console.error(err);
        setError("Kunne ikke laste quizen.");
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

  const answeredCount =
    quiz?.questions.filter(
      (q) =>
        selectedAnswers[q.id] !== null &&
        selectedAnswers[q.id] !== undefined,
    ).length ?? 0;

  const isLastQuestion =
    !!quiz && currentIndex === quiz.questions.length - 1;

  const allAnswered =
    !!quiz &&
    quiz.questions.every(
      (q) =>
        selectedAnswers[q.id] !== null &&
        selectedAnswers[q.id] !== undefined,
    );

  // ====== HANDLERS ======

  const handleOptionChange = (questionId: number, choiceIndex: number) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: choiceIndex,
    }));
  };

  const handlePrevious = () => {
    setCurrentIndex((prev) => Math.max(prev - 1, 0));
  };

  const handleNext = () => {
    if (!quiz) return;
    setCurrentIndex((prev) => Math.min(prev + 1, quiz.questions.length - 1));
  };

  const handleSubmit = async () => {
    if (!quiz) return;

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

      const res = await api.post(`/api/quizzes/${quiz.id}/submit`, {
        answers: payload,
      });

      // Send score/result to completed page
      navigate(`/quiz/${quiz.id}/completed`, { state: res.data });
    } catch (err) {
      console.error(err);
      setError("Kunne ikke sende inn quizen.");
    } finally {
      setSubmitting(false);
    }
  };

  // ====== RENDER STATES ======

  if (!id) {
    return (
      <section className={`qp-page ${styles["taking-quiz-page"]}`}>
        <div className={styles["taking-container"]}>
          <Error message="Mangler quiz-ID i URL." />
          <div className={styles["error-actions"]}>
            <Button
              type="button"
              variant="gray"
              onClick={() => navigate(-1)}
            >
              ← Tilbake
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
            <Button
              type="button"
              variant="gray"
              onClick={() => navigate(-1)}
            >
              ← Tilbake
            </Button>
          </div>
        </div>
      </section>
    );
  }

  // Quiz exists but has no questions
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

  // Could not resolve quiz / question
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

  const currentSelected = selectedAnswers[currentQuestion.id];

  // ====== MAIN RENDER ======

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

          <div
            className={styles["progress-wrapper"]}
            role="progressbar"
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

        <Card variant="elevated" className={styles["quiz-card"]}>
          <h2 className={styles["question-text"]}>{currentQuestion.text}</h2>

          <div className={styles.answers}>
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
                  required={false}
                />
                <span>{choice}</span>
              </label>
            ))}
          </div>
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