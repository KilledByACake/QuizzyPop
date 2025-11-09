import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import "./PublishedQuiz.css";
import { api } from "../../api";

type Question = { text: string; options?: string[] };
type Quiz = {
  id: number;
  title: string;
  description?: string;
  category?: string;
  difficulty?: string;
  timeLimit?: number; // minutes
  tags?: string | string[];
  questions: Question[];
};

export default function PublishedQuiz() {
  const { id } = useParams(); // expects /admin/quizzes/:id/published
  const [quiz, setQuiz] = useState<Quiz | null>(null);

  useEffect(() => {
    api.get(`/quizzes/${id}`).then(r => setQuiz(r.data));
  }, [id]);

  const shareUrl = useMemo(() => {
    const origin = window.location.origin;
    return `${origin}/quizzes/${id}`;
  }, [id]);

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      const btn = document.querySelector<HTMLButtonElement>(".btn-copy");
      if (!btn) return;
      const old = btn.textContent;
      btn.textContent = "✅ Copied!";
      setTimeout(() => (btn.textContent = old || "📋 Copy"), 1500);
    } catch {
      // no-op
    }
  };

  if (!quiz) return <section className="qp-page published-quiz-page"><p>Loading…</p></section>;

  const tags =
    Array.isArray(quiz.tags)
      ? quiz.tags
      : (quiz.tags || "")
          .split(",")
          .map(t => t.trim())
          .filter(Boolean);

  const firstThree = quiz.questions.slice(0, 3);

  return (
    <section className="qp-page published-quiz-page">
      <div className="published-container">
        {/* Success header */}
        <div className="publish-success-header">
          <div className="success-icon">
            <img src="/images/mascot.png" alt="QuizzyPop Mascot" className="success-mascot" />
            <div className="success-badge">✓</div>
          </div>
          <h1>🎉 Quiz Published Successfully! 🎉</h1>
          <p>Your quiz is live and ready to take.</p>
        </div>

        {/* Preview */}
        <div className="quiz-preview-card">
          <div className="quiz-preview-header">
            <h2>{quiz.title}</h2>
            <div className="quiz-status">
              <span className="status-badge live">LIVE</span>
            </div>
          </div>

          <div className="quiz-preview-content">
            {quiz.description && (
              <div className="quiz-description">
                <p>{quiz.description}</p>
              </div>
            )}

            <div className="quiz-details-grid">
              <div className="detail-item">
                <div className="detail-icon">📚</div>
                <div className="detail-content">
                  <span className="detail-label">Category</span>
                  <span className="detail-value">{quiz.category ?? "—"}</span>
                </div>
              </div>

              <div className="detail-item">
                <div className="detail-icon">📊</div>
                <div className="detail-content">
                  <span className="detail-label">Difficulty</span>
                  <span className="detail-value">{quiz.difficulty ?? "—"}</span>
                </div>
              </div>

              <div className="detail-item">
                <div className="detail-icon">❓</div>
                <div className="detail-content">
                  <span className="detail-label">Questions</span>
                  <span className="detail-value">{quiz.questions.length} questions</span>
                </div>
              </div>

              <div className="detail-item">
                <div className="detail-icon">⏱️</div>
                <div className="detail-content">
                  <span className="detail-label">Time Limit</span>
                  <span className="detail-value">
                    {quiz.timeLimit && quiz.timeLimit > 0 ? `${quiz.timeLimit} minutes` : "No limit"}
                  </span>
                </div>
              </div>
            </div>

            {!!tags.length && (
              <div className="quiz-tags">
                {tags.map((t, i) => (
                  <span className="tag" key={i}>{t}</span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Questions preview */}
        <div className="questions-preview-card">
          <h3>📝 Questions Preview</h3>
          <div className="questions-list">
            {firstThree.map((q, i) => (
              <div className="question-preview-item" key={i}>
                <div className="question-number">{i + 1}</div>
                <div className="question-text">{q.text}</div>
                <div className="question-options-count">
                  {(q.options?.length ?? 0)} options
                </div>
              </div>
            ))}

            {quiz.questions.length > 3 && (
              <div className="question-preview-item more-questions">
                <div className="question-number">…</div>
                <div className="question-text">
                  And {quiz.questions.length - 3} more questions
                </div>
                <div className="question-options-count">
                  Total: {quiz.questions.length} questions
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Share link */}
        <div className="share-quiz-card">
          <h3>🔗 Share Your Quiz</h3>
          <p>Copy this link and send it to participants:</p>
          <div className="share-link-container">
            <input type="text" readOnly value={shareUrl} className="share-link-input" />
            <button type="button" className="btn-copy" onClick={copyLink}>📋 Copy</button>
          </div>
        </div>

        {/* Actions */}
        <div className="published-actions">
          <Link to="/" className="btn btn-secondary">🏠 Back to Home</Link>
          <Link to="/admin/quizzes/new" className="btn btn-primary">➕ Create Another Quiz</Link>
          <Link to={`/admin/quizzes/${quiz.id}/edit`} className="btn btn-edit">✏️ Edit This Quiz</Link>
        </div>
      </div>
    </section>
  );
}
