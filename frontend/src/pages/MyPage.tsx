import { useEffect, useState } from "react";
import api from "../api";
import { useAuth } from "../contexts/AuthContext";
import Loader from "../components/Loader";
import Error from "../components/Error";
import StatCard from "../components/StatCard";
import Card from "../components/Card";
import Button from "../components/Button";
import Mascot from "../components/Mascot";
import styles from "./MyPage.module.css";

/** User profile data from /api/auth/me endpoint */
interface MeResponse {
  id: number;
  displayName: string;
  email: string;
  createdAt: string;
  avatarUrl?: string | null;
}

/** Quiz summary for user's created quizzes list */
interface QuizSummary {
  id: number;
  title: string;
  category: {
    id: number;
    name: string;
    description?: string;
  };
  createdAt: string;
  difficulty: string;
}

/** Development flag - enables mock data when not logged in for testing UI */
const USE_DEV_MOCK_WHEN_LOGGED_OUT = true;

/**
 * User dashboard page (MyPage)
 * Displays user profile, statistics, created quizzes, and quiz history
 * Note: Quiz history/attempts feature not yet implemented on backend
 */
const MyPage = () => {
  const { isAuthenticated } = useAuth();
  const [me, setMe] = useState<MeResponse | null>(null);
  const [quizzes, setQuizzes] = useState<QuizSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch user data and quizzes on mount
  useEffect(() => {
    // Use mock data in development when not logged in
    if (!isAuthenticated && USE_DEV_MOCK_WHEN_LOGGED_OUT) {
      const mockUser: MeResponse = {
        id: 1,
        displayName: "Dev User",
        email: "dev@example.com",
        createdAt: "2024-01-01T00:00:00Z",
        avatarUrl: null,
      };

      const mockQuizzes: QuizSummary[] = [
        {
          id: 10,
          title: "My First Quiz",
          category: { id: 1, name: "Math", description: "" },
          createdAt: "2024-05-01T00:00:00Z",
          difficulty: "easy",
        },
        {
          id: 11,
          title: "History Challenge",
          category: { id: 2, name: "History", description: "" },
          createdAt: "2024-05-12T00:00:00Z",
          difficulty: "medium",
        },
      ];

      setMe(mockUser);
      setQuizzes(mockQuizzes);
      setLoading(false);
      setError(null);
      return;
    }

    // Require authentication for real data
    if (!isAuthenticated) {
      setLoading(false);
      setError("You need to be logged in to view this page.");
      return;
    }

    /** Fetch user profile and created quizzes from backend */
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch user profile
        const meRes = await api.get<MeResponse>("/api/auth/me");
        setMe(meRes.data);

        // Fetch user's created quizzes
        const quizzesRes = await api.get<QuizSummary[]>(
          `/api/quizzes?userId=${meRes.data.id}`,
        );
        setQuizzes(quizzesRes.data);
      } catch (err) {
        console.error(err);
        setError("Could not load your data.");
      } finally {
        setLoading(false);
      }
    };

    void fetchData();
  }, [isAuthenticated]);

  if (loading) {
    return (
      <section className={styles.page}>
        <Loader text="Loading your dashboard..." />
      </section>
    );
  }

  if (error || !me) {
    return (
      <section className={styles.page}>
        <Error message={error ?? "Unknown error"} />
      </section>
    );
  }

  // Calculate statistics
  const quizzesCreated = quizzes.length;
  const quizzesTaken = 0; // Placeholder - QuizAttempt entity not yet implemented
  const successRate = "-"; // Placeholder - scoring/history not yet implemented

  return (
    <section className={styles.page}>
      {/* Profile header with stats */}
      <header className={styles.header}>
        <div className={styles.profile}>
          <Mascot variant="blueberry" size="medium" />
          <div>
            <h1>{me.displayName}</h1>
            <p>Member since {new Date(me.createdAt).toLocaleDateString()}</p>
          </div>
        </div>

        {/* Statistics cards */}
        <div className={styles.statsRow}>
          <StatCard number={quizzesCreated} label="Quizzes created" />
          <StatCard
            number={quizzesTaken}
            label="Quizzes taken"
            variant="secondary"
          />
          <StatCard
            number={successRate}
            label="Success rate"
            variant="secondary"
          />
        </div>
      </header>

      <div className={styles.grid}>
        {/* Created quizzes section */}
        <section>
          <h2>My Created Quizzes</h2>
          {quizzes.length === 0 ? (
            <p>You haven't created any quizzes yet.</p>
          ) : (
            <div className={styles.quizList}>
              {quizzes.map((quiz) => (
                <Card
                  key={quiz.id}
                  variant="elevated"
                  className={styles.quizCard}
                >
                  <h3>{quiz.title}</h3>
                  <p>{quiz.category.name}</p>
                  <p>
                    Created:{" "}
                    {new Date(quiz.createdAt).toLocaleDateString()}
                  </p>
                  {/* Quiz action buttons */}
                  <div className={styles.quizActions}>
                    <Button
                      type="button"
                      variant="primary"
                      onClick={() =>
                        (window.location.href = `/quiz/${quiz.id}/take`)
                      }
                    >
                      View
                    </Button>
                    <Button
                      type="button"
                      variant="gray"
                      onClick={() =>
                        (window.location.href = `/quiz/${quiz.id}/edit`)
                      }
                    >
                      Edit
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </section>

        {/* Quiz history section - not yet implemented */}
        <section>
          <h2>My Taken Quizzes</h2>
          <p>Coming soon – quiz history / attempts.</p>
        </section>
      </div>
    </section>
  );
};

export default MyPage;
