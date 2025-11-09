import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./MyPage.css";
import { api } from "../../api";

type User = {
  id: number;
  name: string;
  displayName?: string | null;
  address?: string | null;
  createdAt: string; // ISO
  quizzesCreated?: number | null;
  quizzesTaken?: number | null;
};

type QuizSummary = {
  id: number;
  title: string;
  categoryId?: number;
  createdAt: string; // ISO
};

type TakenQuiz = {
  id: number;
  title: string;
  scorePercent: number;
  takenAt: string; // ISO
};

type MyPageVM = {
  user: User;
  createdQuizzes: QuizSummary[];
  takenQuizzes: TakenQuiz[];
};

export default function MyPage() {
  const [data, setData] = useState<MyPageVM | null>(null);
  const nav = useNavigate();

  useEffect(() => {
    api.get("/me/mypage").then(r => setData(r.data));
  }, []);

  if (!data) return <div className="qp-page my-page-container"><p>Loading…</p></div>;

  const { user, createdQuizzes, takenQuizzes } = data;
  const displayName = user.displayName || user.name;
  const memberSince = new Date(user.createdAt).toLocaleString(undefined, { month: "long", year: "numeric" });
  const created = user.quizzesCreated ?? 0;
  const taken = user.quizzesTaken ?? 0;
  const success = taken > 0 ? Math.round((created / taken) * 100) : 0;

  const onDelete = async (quizId: number) => {
    if (!confirm("Are you sure you want to delete this quiz?")) return;
    await api.delete(`/quizzes/${quizId}`);
    setData(d => d ? { ...d, createdQuizzes: d.createdQuizzes.filter(q => q.id !== quizId) } : d);
  };

  return (
    <div className="qp-page my-page-container">
      {/* Title */}
      <div className="page-title">
        <h1>My Page</h1>
      </div>

      {/* User overview */}
      <div className="card user-overview">
        <div className="user-info">
          <img src="/images/test.jpg" alt="Profile" className="profile-image" />
          <div className="user-details">
            <h2>{displayName}</h2>
            {user.address && <p className="user-address">📍 {user.address}</p>}
            <p className="user-since">Member since {memberSince}</p>
          </div>
        </div>
        <div className="user-stats">
          <div className="stat">
            <span className="stat-number">{created}</span>
            <span className="stat-label">Created</span>
          </div>
          <div className="stat">
            <span className="stat-number">{taken}</span>
            <span className="stat-label">Taken</span>
          </div>
          <div className="stat">
            <span className="stat-number">{success}%</span>
            <span className="stat-label">Success</span>
          </div>
        </div>
      </div>

      {/* Lists */}
      <div className="quiz-cards-container">
        {/* Created */}
        <div className="card quiz-card">
          <h2>My Created Quizzes</h2>
          <div className="quiz-list">
            {createdQuizzes.length ? (
              createdQuizzes.map(quiz => (
                <div className="quiz-item" key={quiz.id}>
                  <div className="quiz-item-info">
                    <h3>{quiz.title}</h3>
                    <p>
                      Category: {quiz.categoryId ?? "—"} • Created:{" "}
                      {new Date(quiz.createdAt).toLocaleDateString(undefined, { month: "short", day: "2-digit", year: "numeric" })}
                    </p>
                  </div>
                  <div className="quiz-item-actions">
                    <Link className="btn-action" to={`/quizzes/${quiz.id}`}>Details</Link>
                    <Link className="btn-action btn-edit" to={`/admin/quizzes/${quiz.id}/edit`}>Edit</Link>
                    <button className="btn-action btn-delete" onClick={() => onDelete(quiz.id)}>Delete</button>
                  </div>
                </div>
              ))
            ) : (
              <p>You haven't created any quizzes yet.</p>
            )}
          </div>
        </div>

        {/* Taken */}
        <div className="card quiz-card">
          <h2>My Taken Quizzes</h2>
          <div className="quiz-list">
            {takenQuizzes.length ? (
              takenQuizzes.map((tq, i) => (
                <div className="quiz-item" key={tq.id ?? i}>
                  <div className="quiz-item-info">
                    <h3>{tq.title}</h3>
                    <p>
                      Score: {tq.scorePercent}% • Date:{" "}
                      {new Date(tq.takenAt).toLocaleDateString(undefined, { month: "short", day: "2-digit", year: "numeric" })}
                    </p>
                  </div>
                  <div className="quiz-item-actions">
                    <Link className="btn-action" to={`/results/${tq.id}`}>Details</Link>
                  </div>
                </div>
              ))
            ) : (
              <p>No taken quizzes yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
