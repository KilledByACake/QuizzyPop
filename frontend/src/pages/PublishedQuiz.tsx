// frontend/src/pages/PublishedQuiz.tsx
import { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import api from "../api";
import Button from "../components/Button";
import Mascot from "../components/Mascot";
import Loader from "../components/Loader";
import Error from "../components/Error";
import styles from "./PublishedQuiz.module.css";

/** Quiz summary data for published quiz display */
interface PublishedQuizState {
  id: number;
  title: string;
  difficulty: string;
  category: string;
  questionsCount: number;
}

/**
 * Quiz published success page
 * Shown after successfully creating and publishing a quiz
 * Displays quiz summary, celebration message, and sharing options
 * Navigated to from AddQuestions page after question submission
 */
export default function PublishedQuiz() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();

  // Try to get quiz data from navigation state (passed from AddQuestions)
  const stateQuiz = location.state as PublishedQuizState | undefined;

  const [quiz, setQuiz] = useState<PublishedQuizState | null>(stateQuiz ?? null);
  const [loading, setLoading] = useState(!stateQuiz && !!id);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  // Fetch quiz data if not provided via location.state
  useEffect(() => {
    if (!id) {
      setError("Missing quiz id.");
      setLoading(false);
      return;
    }

    // Skip fetch if we already have quiz data from navigation state
    if (quiz || stateQuiz) return;

    const fetchQuiz = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await api.get(`/api/quizzes/${id}`);

        const mapped: PublishedQuizState = {
          id: res.data.id,
          title: res.data.title,
          difficulty: res.data.difficulty,
          category: res.data.category?.name ?? "Unknown",
          questionsCount:
            res.data.questionsCount ?? res.data.questions?.length ?? 0,
        };

        setQuiz(mapped);
      } catch (err) {
        console.error(err);
        setError("Could not load quiz data.");
      } finally {
        setLoading(false);
      }
    };

    void fetchQuiz();
  }, [id, quiz, stateQuiz]);

  if (!id) {
    return (
      <div className={styles.publishedPage}>
        <div className={styles.container}>
          <Error message="Missing quiz id in URL." />
          <div className={styles.actions}>
            <Button variant="secondary" onClick={() => navigate("/quizzes")}>
              Back to quizzes
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className={styles.publishedPage}>
        <div className={styles.container}>
          <Loader text="Loading quiz..." />
        </div>
      </div>
    );
  }

  if (error || !quiz) {
    return (
      <div className={styles.publishedPage}>
        <div className={styles.container}>
          <Error message={error ?? "Quiz not found."} />
          <div className={styles.actions}>
            <Button variant="secondary" onClick={() => navigate("/quizzes")}>
              Back to quizzes
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const shareLink = `${window.location.origin}/quiz/${id}/take`;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error(err);
      setError("Could not copy link to clipboard.");
    }
  };

  return (
    <div className={styles.publishedPage}>
      <div className={styles.container}>
        <div className={styles.centerRow}>
          <Mascot variant="celebrate" size="large" />
        </div>

        <h1 className={styles.title}>🎉 Quiz Published!</h1>
        <p className={styles.subtitle}>
          Your quiz is now live and ready for players!
        </p>

        <div className={styles.summary}>
          <div className={styles.summaryItem}>
            <span className={styles.summaryLabel}>Title</span>
            <span className={styles.summaryValue}>{quiz.title}</span>
          </div>
          <div className={styles.summaryItem}>
            <span className={styles.summaryLabel}>Questions</span>
            <span className={styles.summaryValue}>{quiz.questionsCount}</span>
          </div>
          <div className={styles.summaryItem}>
            <span className={styles.summaryLabel}>Difficulty</span>
            <span className={styles.summaryValue}>{quiz.difficulty}</span>
          </div>
          <div className={styles.summaryItem}>
            <span className={styles.summaryLabel}>Category</span>
            <span className={styles.summaryValue}>{quiz.category}</span>
          </div>
        </div>

        <div className={styles.actions}>
          <Button
            variant="primary"
            onClick={() => navigate(`/quiz/${id}/take`)}
          >
            Take Quiz Now
          </Button>

          <Button variant="secondary" onClick={() => navigate("/mypage")}>
            View My Page
          </Button>

          <Button variant="outline" onClick={() => navigate("/create")}>
            Create Another Quiz
          </Button>
        </div>

        <div className={styles.shareBox}>
          <p className={styles.shareLabel}>Share with friends:</p>

          <code className={styles.shareLink}>{shareLink}</code>

          <div className={styles.shareActions}>
            <Button variant="primary" type="button" onClick={handleCopyLink}>
              {copied ? "Link copied! ✅" : "Copy link"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
