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

interface MeResponse {
  id: number;
  displayName: string;
  email: string;
  createdAt: string;
  avatarUrl?: string | null;
}

interface QuizSummary {
  id: number;
  title: string;
  category: string;
  createdAt: string;
  difficulty: string;
}

// dev-flagg: bruk mock data hvis ikke innlogget
const USE_DEV_MOCK_WHEN_LOGGED_OUT = true;

const MyPage = () => {
  const { isAuthenticated } = useAuth();
  const [me, setMe] = useState<MeResponse | null>(null);
  const [quizzes, setQuizzes] = useState<QuizSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Hvis vi ikke er innlogget og har dev-modus på → bruk fake data
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
          category: "Math",
          createdAt: "2024-05-01T00:00:00Z",
          difficulty: "easy",
        },
        {
          id: 11,
          title: "History Challenge",
          category: "History",
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

    // Vanlig “ordentlig” flyt når auth + backend funker
    if (!isAuthenticated) {
      setLoading(false);
      setError("You need to be logged in to view this page.");
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const meRes = await api.get<MeResponse>("/api/auth/me");
        setMe(meRes.data);

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

  const quizzesCreated = quizzes.length;
  const quizzesTaken = 0; // placeholder til du får attempts
  const successRate = "-";

  return (
    <section className={styles.page}>
      <header className={styles.header}>
        <div className={styles.profile}>
          <Mascot variant="blueberry" size="medium" />
          <div>
            <h1>{me.displayName}</h1>
            <p>Member since {new Date(me.createdAt).toLocaleDateString()}</p>
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
            label="Success rate"
            variant="secondary"
          />
        </div>
      </header>

      <div className={styles.grid}>
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
                  <p>{quiz.category}</p>
                  <p>
                    Created:{" "}
                    {new Date(quiz.createdAt).toLocaleDateString()}
                  </p>
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

        <section>
          <h2>My Taken Quizzes</h2>
          <p>Coming soon – quiz history / attempts.</p>
        </section>
      </div>
    </section>
  );
};

export default MyPage;
