import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api"; // samme som i QuizContext

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

  // Hent quiz + spørsmål
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

        // init state for valgte svar (null = ikke besvart ennå)
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

  if (!id) {
    return <p>Mangler quiz-id i URL.</p>;
  }

  const totalQuestions = quiz?.questions.length ?? 0;
  const currentQuestion = quiz?.questions[currentIndex];

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

  const isLastQuestion =
    quiz && currentIndex === quiz.questions.length - 1;

  const allAnswered =
    quiz &&
    quiz.questions.every(
      (q) =>
        selectedAnswers[q.id] !== null &&
        selectedAnswers[q.id] !== undefined,
    );

  const handleSubmit = async () => {
    if (!quiz) return;

    const payload: SubmitAnswer[] = quiz.questions
      .map((q) => {
        const selectedIndex = selectedAnswers[q.id];
        if (
          selectedIndex === null ||
          selectedIndex === undefined
        ) {
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

      // Send score/resultat videre til completed-siden
      navigate(`/quiz/${quiz.id}/completed`, { state: res.data });
    } catch (err) {
      console.error(err);
      setError("Kunne ikke sende inn quizen.");
    } finally {
      setSubmitting(false);
    }
  };

  // ====== RENDER ======

  if (loading) return <p>Laster quiz...</p>;
  if (error) return <p className="error-text">{error}</p>;
  if (!quiz || !currentQuestion) return <p>Fant ikke quiz.</p>;

  const currentSelected = selectedAnswers[currentQuestion.id];

  return (
    <section className="qp-page taking-quiz-page">
      <div className="taking-container">
        <header className="taking-header">
          <h1>{quiz.title}</h1>
          <p>
            Question {currentIndex + 1} of {totalQuestions}
          </p>
        </header>

        <div className="quiz-card">
          <h2>{currentQuestion.text}</h2>

          <div className="answers">
            {currentQuestion.choices.map((choice, index) => (
              <label className="answer-option" key={index}>
                <input
                  type="radio"
                  name={`question-${currentQuestion.id}`}
                  value={index}
                  checked={currentSelected === index}
                  onChange={() =>
                    handleOptionChange(currentQuestion.id, index)
                  }
                  required={false} // vi håndterer validering selv
                />
                <span>{choice}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="nav-buttons">
          {currentIndex > 0 ? (
            <button
              type="button"
              className="btn-nav btn-prev"
              onClick={handlePrevious}
            >
              ← Previous
            </button>
          ) : (
            <span />
          )}

          {isLastQuestion ? (
            <button
              type="button"
              className="btn-finish"
              onClick={handleSubmit}
              disabled={!allAnswered || submitting}
            >
              {submitting ? "Submitting..." : "Finish Quiz 🎉"}
            </button>
          ) : (
            <button
              type="button"
              className="btn-nav btn-next"
              onClick={handleNext}
              disabled={currentSelected === null || currentSelected === undefined}
            >
              Next →
            </button>
          )}
        </div>
      </div>
    </section>
  );
};

export default TakingQuiz;
