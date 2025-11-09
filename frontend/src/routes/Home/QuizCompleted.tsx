import { useEffect, useState } from "react";
import { Link, useNavigate, useParams, useLocation } from "react-router-dom";
import "./QuizCompleted.css";
import { api } from "../../api";

type ResultVM = {
  quizId: number;
  quizTitle: string;
  correctAnswers: number;
  totalQuestions: number;
  score: number;          // percent (0-100)
  difficulty?: string;
  feedbackMessages?: string[];
};

export default function QuizCompleted() {
  const { quizId } = useParams();
  const nav = useNavigate();
  const location = useLocation() as { state?: Partial<ResultVM> };
  const [data, setData] = useState<ResultVM | null>(null);

  useEffect(() => {
    if (location.state?.quizTitle) {
      setData(prev => ({ ...(prev || {} as ResultVM), ...(location.state as ResultVM) }));
      return;
    }
    const load = async () => {
      // Adjust to your backend route
      const res = await api.get(`/quizzes/${quizId}/result`);
      setData(res.data);
    };
    load();
  }, [quizId, location.state]);

  const retry = async () => {
    await api.post(`/quizzes/${data?.quizId}/retry`);
    nav(`/quizzes/${data?.quizId}`);
  };

  if (!data) return <section className="qp-page qp-publish-success"><p>Loading…</p></section>;

  return (
    <section className="qp-page qp-publish-success">
      <div className="qp-publish__header">
        <h1>🎉 Great Job!</h1>
        <p>
          You've completed the quiz: <strong>{data.quizTitle}</strong>
        </p>
      </div>

      <div className="qp-publish__mascot">
        <img src="/images/quizzy-celebrate.png" alt="Celebrating mascot" />
      </div>

      <article className="qp-quiz-card">
        <header><h2>Your Results</h2></header>
        <div className="qp-quiz__meta">
          <span><strong>{data.correctAnswers}</strong> / {data.totalQuestions} correct</span>
          <span>Score: <strong>{Math.round(data.score)}%</strong></span>
          {data.difficulty && <span>Difficulty: {data.difficulty}</span>}
        </div>

        {!!data.feedbackMessages?.length && (
          <div className="qp-feedback">
            {data.feedbackMessages.map((m, i) => (
              <p className="qp-feedback-line" key={i}>{m}</p>
            ))}
          </div>
        )}
      </article>

      <div className="qp-publish__actions">
        <Link to="/quizzes" className="qp-btn qp-btn--primary">Take another quiz</Link>
        <button className="qp-btn qp-btn--secondary" onClick={retry}>Retake quiz 🔁</button>
      </div>
    </section>
  );
}
