import { useEffect, useMemo, useState } from "react";
import api from "../api";
import { useAuth } from "../contexts/AuthContext";
import Loader from "../components/Loader";
import Error from "../components/Error";
import StatCard from "../components/StatCard";
import Card from "../components/Card";
import Button from "../components/Button";
import Mascot from "../components/Mascot";
import styles from "./MyPage.module.css";

/** User profile returned by /api/auth/me */
interface MeResponse {
  id: number;
  displayName: string;
  email: string;
  createdAt: string;
  avatarUrl?: string | null;
}

/** Quiz summary for the "My Created Quizzes" list */
interface QuizSummary {
  id: number;
  title: string;
  category?: {
    id: number;
    name: string;
    description?: string;
  } | null;
  createdAt?: string;
  createdDate?: string;
  difficulty?: string;

  // Owner fallback fields (backend may use different names)
  createdByUserId?: number | null;
  ownerId?: number | null;
  userId?: number | null;

  // Statistics (optional if backend sends them)
  attemptsCount?: number;
  averageScore?: number;
}

/** Local quiz attempt stored by QuizCompleted in localStorage */
interface LocalQuizAttempt {
  quizId: number;
  quizTitle: string;
  score: number; // normalized percentage
  completedAt: string;
}

/**
 * MyPage (User Dashboard)
 * - Shows profile info and membership date
 * - Shows quizzes created by the user
 * - Shows quizzes taken (read from localStorage for now)
 * - Includes stats: created quizzes, taken quizzes, average score
 */
const MyPage = () => {
  const { isAuthenticated } = useAuth();

  const [me, setMe] = useState<MeResponse | null>(null);
  const [quizzes, setQuizzes] = useState<QuizSummary[]>([]);
  const [takenQuizzes, setTakenQuizzes] = useState<LocalQuizAttempt[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /** Safely formats an ISO date string */
  const formatDate = (value?: string) => {
    if (!value) return "Unknown";
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return value;
    return d.toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  /** Load local attempts from localStorage */
  const loadLocalAttempts = (): LocalQuizAttempt[] => {
    try {
      const raw = localStorage.getItem("quiz_attempts");
      if (!raw) return [];
      const parsed = JSON.parse(raw) as LocalQuizAttempt[];
      if (!Array.isArray(parsed)) return [];
      return parsed;
    } catch (err) {
      console.error("Failed to load local quiz attempts:", err);
      return [];
    }
  };

  /** Fetch user, their quizzes, and local attempts */
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Require authentication
        if (!isAuthenticated) {
          setLoading(false);
          setError("You must be logged in to view this page.");
          return;
        }

        // --- Fetch user profile ---
        const meRes = await api.get<MeResponse>("/api/auth/me");
        const user = meRes.data;
        setMe(user);

        // --- Fetch quizzes created by the user ---
        const quizzesRes = await api.get<QuizSummary[]>(
          `/api/quizzes?userId=${user.id}`
        );
        const rawQuizzes = quizzesRes.data || [];

        // Extra safety: filter by owner on client as well
        const filtered = rawQuizzes.filter((q) => {
          const ownerId =
            q.createdByUserId ?? q.ownerId ?? q.userId ?? null;
          return ownerId === null || ownerId === user.id;
        });

        setQuizzes(filtered);

        // --- Load taken quizzes from localStorage (recorded by QuizCompleted) ---
        setTakenQuizzes(loadLocalAttempts());
      } catch (err) {
        console.error(err);
        setError("Failed to load your dashboard.");
      } finally {
        setLoading(false);
      }
    };

    void fetchData();
  }, [isAuthenticated]);

  /** Statistics */
  const quizzesCreated = quizzes.length;
  const quizzesTaken = takenQuizzes.length;

  const successRate = useMemo(() => {
    if (takenQuizzes.length === 0) return "-";
    const total = takenQuizzes.reduce(
      (acc: number, a: LocalQuizAttempt) => acc + (a.score ?? 0),
      0
    );
    return `${Math.round(total / takenQuizzes.length)}%`;
  }, [takenQuizzes]);

  /** Actions */
  const handleViewQuiz = (id: number) => {
    window.location.href = `/quiz/${id}/take`;
  };

  const handleEditQuiz = (id: number) => {
    window.location.href = `/quiz/${id}/edit`;
  };

  const handleDeleteQuiz = async (id: number) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this quiz? This action cannot be undone."
    );
    if (!confirmed) return;

    try {
      // Optimistically remove from UI
      setQuizzes((prev) => prev.filter((q) => q.id !== id));

      await api.delete(`/api/quizzes/${id}`);
    } catch (err) {
      console.error(err);
      // You can add a toast/snackbar here later
    }
  };

  /** Loading state */
  if (loading) {
    return (
      <section className={styles.page}>
        <Loader text="Loading your dashboard..." />
      </section>
    );
  }

  /** Error / not logged in state */
  if (error || !me) {
    return (
      <section className={styles.page}>
        <Error message={error ?? "Unknown error"} />
      </section>
    );
  }

  const memberSince = formatDate(me.createdAt);

  return (
    <section className={styles.page}>
      {/* Header with profile and stats */}
      <header className={styles.header}>
        <div className={styles.profile}>
          <Mascot variant="blueberry" size="medium" />
          <div>
            <h1>{me.displayName}</h1>
            <p>{me.email}</p>
            <p>Member since {memberSince}</p>
          </div>
        </div>

        <div className={styles.statsRow}>
          <StatCard number={quizzesCreated} label="Quizzes created" />
          <StatCard
            number={quizzesTaken}
            label="Quizzes taken"
            variant="secondary"
          />
          <StatCard
            number={successRate}
            label="Avg. score"
            variant="secondary"
          />
        </div>
      </header>

      <div className={styles.grid}>
        {/* My Created Quizzes */}
        <section>
          <h2>My Created Quizzes</h2>

          {quizzes.length === 0 ? (
            <p>You haven't created any quizzes yet.</p>
          ) : (
            <div className={styles.quizList}>
              {quizzes.map((quiz) => {
                const created = quiz.createdAt ?? quiz.createdDate ?? "";
                return (
                  <Card
                    key={quiz.id}
                    variant="elevated"
                    className={styles.quizCard}
                  >
                    <h3>{quiz.title}</h3>

                    <p>
                      {quiz.category?.name && (
                        <span>{quiz.category.name} · </span>
                      )}
                      {quiz.difficulty && (
                        <span>
                          Difficulty:{" "}
                          {quiz.difficulty.charAt(0).toUpperCase() +
                            quiz.difficulty.slice(1)}
                          {" · "}
                        </span>
                      )}
                      <span>Created: {formatDate(created)}</span>
                    </p>

                    {typeof quiz.attemptsCount === "number" && (
                      <p>
                        Attempts: {quiz.attemptsCount} · Avg score:{" "}
                        {quiz.averageScore ?? 0}%
                      </p>
                    )}

                    <div className={styles.quizActions}>
                      <Button
                        variant="primary"
                        onClick={() => handleViewQuiz(quiz.id)}
                      >
                        View
                      </Button>
                      <Button
                        variant="gray"
                        onClick={() => handleEditQuiz(quiz.id)}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="danger"
                        onClick={() => handleDeleteQuiz(quiz.id)}
                      >
                        Delete
                      </Button>
                    </div>
                  </Card>
                );
              })}
            </div>
          )}
        </section>

                {/* My Taken Quizzes */}
        <section>
          <h2>My Taken Quizzes</h2>

          {takenQuizzes.length === 0 ? (
            <p>You haven't taken any quizzes yet.</p>
          ) : (
            <div className={styles.takenListWrapper}>
              {/* Scrollable area with max 3 cards visible */}
              <div className={styles.takenList}>
                {takenQuizzes.map((attempt) => (
                  <Card
                    key={`${attempt.quizId}-${attempt.completedAt}`}
                    variant="default"
                    className={styles.takenCard}
                  >
                    <div className={styles.takenHeader}>
                      <h3 className={styles.takenTitle}>{attempt.quizTitle}</h3>
                      <span className={styles.takenScore}>
                        {attempt.score}%
                      </span>
                    </div>

                    <p className={styles.takenMeta}>
                      Completed:{" "}
                      {new Date(attempt.completedAt).toLocaleString()}
                    </p>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </section>


      </div>
    </section>
  );
};

export default MyPage;
