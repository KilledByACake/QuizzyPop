import {
  useEffect,
  useMemo,
  useState,
  useRef,
} from "react";
import { useNavigate } from "react-router-dom";
import { useQuizContext } from "../contexts/QuizContext";
import { useAuth } from "../contexts/AuthContext";
import api from "../api";
import Button from "../components/Button";
import FilterDropdown from "../components/FilterDropdown";
import SearchBar from "../components/SearchBar";
import Loader from "../components/Loader";
import Mascot from "../components/Mascot";
import styles from "./TakeQuiz.module.css";
/**
 * Main quiz browsing page with search and filter functionality.
 * Fetches available quizzes from QuizContext and displays them in a responsive grid.
 * Shape of quiz summary data displayed in browse view */
type QuizSummary = {
  id: number;
  title: string;
  difficulty: string;
  imageUrl?: string | null;
  questionsCount?: number;
};

/**
 * Main quiz browsing page with search and filter functionality.
 * Fetches available quizzes from QuizContext and displays them in a responsive grid.
 */
export default function TakeQuiz() {
  const { quizzes, loading, error, fetchQuizzes } = useQuizContext();
  const { token } = useAuth();

  const [search, setSearch] = useState("");
  const [difficultyFilter, setDifficultyFilter] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>();
  const [selectedGrade, setSelectedGrade] = useState<string | undefined>();
  const [selectedSort, setSelectedSort] = useState<string | undefined>();

  const navigate = useNavigate();

  /**
   * Decode the current JWT access token to determine user role.
   * Returns "teacher", "admin", "student", or null if the token is missing/invalid.
   */
  const getUserRole = (): string | null => {
    if (!token) return null;
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] || payload.role || null;
    } catch {
      return null;
    }
  };

  const userRole = getUserRole();
  const isTeacher = userRole === 'teacher' || userRole === 'admin';

    // Set page title when this view is active
  useEffect(() => {
    document.title = "Explore Quizzes - QuizzyPop";
  }, []);

  // Fetch quizzes once on mount
  const hasFetchedRef = useRef(false);

  useEffect(() => {
    if (!hasFetchedRef.current) {
      hasFetchedRef.current = true;
      void fetchQuizzes();
    }
  }, [fetchQuizzes]);

  // Handle difficulty filter selection (toggle behavior)
  const handleDifficultySelect = (option: string) => {
    const normalized = option.toLowerCase();
    setDifficultyFilter((prev) => (prev === normalized ? "" : normalized));
  };

  // Filter quizzes based on search query and difficulty filter
  const filteredQuizzes = useMemo(() => {
    const sourceQuizzes: QuizSummary[] = quizzes as QuizSummary[];

    return sourceQuizzes.filter((quiz) => {
      const title = quiz.title ?? "";
      const difficulty = quiz.difficulty ?? "";

      const matchesSearch =
        search.trim().length === 0 ||
        title.toLowerCase().includes(search.toLowerCase());

      const matchesDifficulty =
        difficultyFilter === "" ||
        difficulty.toLowerCase() === difficultyFilter;

      return matchesSearch && matchesDifficulty;
    });
  }, [quizzes, search, difficultyFilter]);

  // Handle quiz deletion (teachers/admins only)
  const handleDeleteQuiz = async (id: number) => {
    if (!confirm('Are you sure you want to delete this quiz?')) return;
    
    try {
      await api.delete(`/api/quizzes/${id}`);
      // Refresh quiz list after successful deletion
      await fetchQuizzes();
    } catch (err) {
      console.error('Failed to delete quiz:', err);
      alert('Failed to delete quiz. Please try again.');
    }
  };

  const difficultyLabel =
    difficultyFilter === ""
      ? undefined
      : difficultyFilter.charAt(0).toUpperCase() + difficultyFilter.slice(1);

  // Static UI-only filter options (not yet connected to backend)
  const categoryOptions = ["Science", "History", "Geography"];
  const gradeOptions = ["1–4", "5–7", "8–10"];
  const sortOptions = ["Newest", "Oldest", "Most Played"];
  const difficultyOptions = ["Easy", "Medium", "Hard"];

  return (
    <section
      className={styles["take-quiz-page"]}
      aria-labelledby="take-quiz-heading"
    >
      <div className={styles["title-row"]}>
        <h1 id="take-quiz-heading">Explore Quizzes</h1>
        <p>Loaded quizzes: {quizzes.length}</p>
      </div>

      <div className={styles["tq-grid"]}>
        {/* Search and filter controls */}
        <div className={styles["filter-bar"]}>
          <SearchBar
            value={search}
            onChange={setSearch}
            placeholder="Search by keyword or topic..."
          />

          <div className={styles["dropdown-row"]}>
            <FilterDropdown
              label="Category"
              options={categoryOptions}
              selected={selectedCategory}
              onSelect={setSelectedCategory}
            />

            <FilterDropdown
              label="Grade Level"
              options={gradeOptions}
              selected={selectedGrade}
              onSelect={setSelectedGrade}
            />

            <FilterDropdown
              label="Popular"
              options={sortOptions}
              selected={selectedSort}
              onSelect={setSelectedSort}
            />

            <FilterDropdown
              label="Difficulty"
              options={difficultyOptions}
              selected={difficultyLabel}
              onSelect={handleDifficultySelect}
            />
          </div>
        </div>

        {/* Quiz grid with loading, error, and empty states */}
        <div
          className={styles["quiz-grid"]}
          role="list"
          aria-live="polite"
          aria-busy={loading}
        >
          {loading && <Loader text="Loading quizzes..." />}

          {error && !loading && (
            <p className={styles["no-quizzes"]} role="alert">
              {error}
            </p>
          )}

          {!loading && !error && filteredQuizzes.length > 0 && (
            <>
              {filteredQuizzes.map((quiz) => {
                const imgSrc =
                  quiz.imageUrl?.trim()
                    ? quiz.imageUrl
                    : "/images/default-cover.png";

                    const questionsCount = (quiz as any)?.questions?.length ?? 0;


                return (
                  <article
                    className={styles["quiz-card"]}
                    key={quiz.id}
                    role="listitem"
                  >
                    <div className={styles["quiz-thumb"]}>
                      <img
                        src={imgSrc}
                        alt={quiz.title}
                        className={styles["quiz-thumb-image"]}
                      />
                    </div>

                    <h3 className={styles["quiz-title"]}>{quiz.title}</h3>

                    <p className={styles["quiz-meta"]}>
                      Difficulty: {quiz.difficulty}
                    </p>

                    <p className={styles["quiz-meta"]}>
                      {questionsCount} Questions
                    </p>

                    <div className={styles["quiz-actions"]}>
                      <Button
                        type="button"
                        variant="primary"
                        onClick={() => navigate(`/quiz/${quiz.id}/take`)}
                      >
                        Take Quiz
                      </Button>
                      
                      {isTeacher && (
                        <Button
                          type="button"
                          variant="danger"
                          onClick={() => handleDeleteQuiz(quiz.id)}
                        >
                          Delete
                        </Button>
                      )}
                    </div>
                  </article>
                );
              })}
            </>
          )}

          {!loading && !error && filteredQuizzes.length === 0 && (
            <div className={styles["no-quizzes"]} role="status">
              <Mascot
                variant="no-arms"
                size="medium"
                alt="No quizzes found illustration"
              />
              <p>
                No quizzes found. Try changing filters, searching for something
                else, or create a new quiz!
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
