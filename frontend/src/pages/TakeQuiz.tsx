/**
 * TakeQuiz Page
 * 
 * Quiz browsing and discovery page where users can search, filter, and select quizzes to take.
 * Displays all available quizzes in a grid layout with search functionality and multiple filter
 * options (difficulty, category, grade level, sort order).
 * 
 * Features:
 * - Search by quiz title/keyword
 * - Filter by difficulty (Easy, Medium, Hard) - fully functional
 * - Filter by category, grade level, sort order - UI only, not yet implemented
 * - Responsive grid layout with quiz cards
 * - Mock data fallback for development when backend is unavailable
 * - Loading states and error handling
 * - Empty state with helpful mascot illustration
 */

import {
  useEffect,
  useMemo,
  useState,
  useRef,
} from "react";
import { useNavigate } from "react-router-dom";
import { useQuizContext } from "../contexts/QuizContext";
import Button from "../components/Button";
import FilterDropdown from "../components/FilterDropdown";
import SearchBar from "../components/SearchBar";
import Loader from "../components/Loader";
import Mascot from "../components/Mascot";
import styles from "./TakeQuiz.module.css";

/**
 * Development flag to enable mock data fallback when backend is unavailable.
 * Set to false in production to show real errors instead of mock data.
 */
const USE_DEV_MOCK_WHEN_BACKEND_DOWN = true;

/**
 * Shape of quiz summary data displayed in browse view
 */
type QuizSummary = {
  /** Unique quiz identifier */
  id: number;
  /** Display title of the quiz */
  title: string;
  /** Difficulty level (easy, medium, hard) */
  difficulty: string;
  /** Optional cover image URL */
  imageUrl?: string | null;
  /** Number of questions in the quiz */
  questionsCount?: number;
};

/**
 * Mock quiz data for frontend development and testing.
 * Used as fallback when backend is unavailable and USE_DEV_MOCK_WHEN_BACKEND_DOWN is true.
 */
const MOCK_QUIZZES: QuizSummary[] = [
  {
    id: 101,
    title: "Math Basics",
    difficulty: "easy",
    imageUrl: "/images/default-cover.png",
    questionsCount: 8,
  },
  {
    id: 102,
    title: "World Capitals",
    difficulty: "medium",
    imageUrl: "/images/default-cover.png",
    questionsCount: 12,
  },
  {
    id: 103,
    title: "Science Trivia",
    difficulty: "hard",
    imageUrl: "/images/default-cover.png",
    questionsCount: 15,
  },
];

/**
 * TakeQuiz Component
 * 
 * Main quiz browsing page with search and filter functionality. Fetches available quizzes
 * from QuizContext and displays them in a responsive grid. Users can search by title and
 * filter by difficulty. Clicking a quiz card navigates to the quiz-taking experience.
 * 
 * @returns Quiz browsing page with search, filters, and quiz grid
 */
export default function TakeQuiz() {
  // Access quiz data and actions from context
  const { quizzes, loading, error, fetchQuizzes } = useQuizContext();

  // Local state for search and filters
  const [search, setSearch] = useState("");
  const [difficultyFilter, setDifficultyFilter] = useState("");
  // Note: Category, grade, and sort filters are UI-only placeholders (not yet implemented in backend)
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>();
  const [selectedGrade, setSelectedGrade] = useState<string | undefined>();
  const [selectedSort, setSelectedSort] = useState<string | undefined>();

  const navigate = useNavigate();

  // Set document title for better browser history
  useEffect(() => {
    document.title = "Explore Quizzes - Quizzy Pop";
  }, []);

  // Fetch quizzes only once on mount to avoid unnecessary API calls
  const hasFetchedRef = useRef(false);

  useEffect(() => {
    if (!hasFetchedRef.current) {
      hasFetchedRef.current = true;
      void fetchQuizzes();
    }
  }, [fetchQuizzes]);

  /**
   * Handle difficulty filter selection.
   * Clicking the same difficulty again will clear the filter (toggle behavior).
   * 
   * @param option - Selected difficulty option (Easy, Medium, Hard)
   */
  const handleDifficultySelect = (option: string) => {
    const normalized = option.toLowerCase();
    // Toggle: if already selected, clear filter; otherwise set new filter
    setDifficultyFilter((prev) => (prev === normalized ? "" : normalized));
  };

  /**
   * Determine which quiz list to display: real backend data or mock data.
   * Falls back to mock data if backend is down and development flag is enabled.
   */
  const sourceQuizzes = useMemo(() => {
    if (
      USE_DEV_MOCK_WHEN_BACKEND_DOWN &&
      (!quizzes.length || error)
    ) {
      return MOCK_QUIZZES;
    }
    return quizzes;
  }, [quizzes, error]);

  /**
   * Filter quizzes based on search query and difficulty filter.
   * Currently only implements search and difficulty; category/grade/sort are placeholders.
   */
  const filteredQuizzes = useMemo(() => {
    return sourceQuizzes.filter((quiz) => {
      const title = quiz.title ?? "";
      const difficulty = quiz.difficulty ?? "";

      // Check if quiz title contains search query (case-insensitive)
      const matchesSearch =
        search.trim().length === 0 ||
        title.toLowerCase().includes(search.toLowerCase());

      // Check if quiz matches selected difficulty
      const matchesDifficulty =
        difficultyFilter === "" ||
        difficulty.toLowerCase() === difficultyFilter;

      return matchesSearch && matchesDifficulty;
    });
  }, [sourceQuizzes, search, difficultyFilter]);

  /**
   * Navigate to quiz-taking page when user clicks "Take quiz" button
   * 
   * @param id - ID of the quiz to take
   */
  const handleTakeQuiz = (id: number) => {
    navigate(`/quiz/${id}/take`);
  };

  // Format difficulty filter for display (capitalize first letter)
  const difficultyLabel =
    difficultyFilter === ""
      ? undefined
      : difficultyFilter.charAt(0).toUpperCase() + difficultyFilter.slice(1);

  // Dropdown options (Category, Grade, Sort are UI-only placeholders for future implementation)
  const categoryOptions = ["Science", "History", "Geography"];
  const gradeOptions = ["1–4", "5–7", "8–10"];
  const sortOptions = ["Newest", "Oldest", "Most Played"];
  const difficultyOptions = ["Easy", "Medium", "Hard"];

  // Only show error if backend is down and we're not using mock data
  const showError = error && !USE_DEV_MOCK_WHEN_BACKEND_DOWN;

  return (
    <section className={styles["take-quiz-page"]} aria-labelledby="take-quiz-heading">
      {/* Page header with title and quiz count */}
      <div className={styles["title-row"]}>
        <h1 id="take-quiz-heading">Explore Quizzes</h1>
        <p>Loaded quizzes: {sourceQuizzes.length}</p>
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
            {/* Note: Category, Grade Level, and Popular filters are UI placeholders */}
            {/* Backend implementation needed for full functionality */}
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

            {/* Difficulty filter - fully functional */}
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
          {/* Loading state */}
          {loading && <Loader text="Loading quizzes..." />}

          {/* Error state (only shown if not using mock data) */}
          {showError && (
            <p className={styles["no-quizzes"]} role="alert">
              {error}
            </p>
          )}

          {/* Quiz cards - display filtered results */}
          {!loading && !showError && filteredQuizzes.length > 0 && (
            <>
              {filteredQuizzes.map((quiz) => {
                // Use default cover image if quiz doesn't have one
                const imgSrc =
                  quiz.imageUrl?.trim()
                    ? quiz.imageUrl
                    : "/images/default-cover.png";

                // Extract question count (may not be present in all quiz objects)
                const questionsCount =
                  (quiz as any).questionsCount ?? 0;

                return (
                  <article
                    className={styles["quiz-card"]}
                    key={quiz.id}
                    role="listitem"
                  >
                    {/* Quiz cover image */}
                    <div className={styles["quiz-thumb"]}>
                      <img
                        src={imgSrc}
                        alt={quiz.title}
                        className={styles["quiz-thumb-image"]}
                      />
                    </div>

                    {/* Quiz metadata */}
                    <h3 className={styles["quiz-title"]}>{quiz.title}</h3>

                    <p className={styles["quiz-meta"]}>
                      Difficulty: {quiz.difficulty}
                    </p>

                    <p className={styles["quiz-meta"]}>
                      {questionsCount} Questions
                    </p>

                    {/* Action button to start quiz */}
                    <Button
                      className={styles["btn-take"]}
                      type="button"
                      variant="primary"
                      onClick={() => handleTakeQuiz(quiz.id)}
                      aria-label={`Take quiz: ${quiz.title}`}
                    >
                      Take quiz
                    </Button>
                  </article>
                );
              })}
            </>
          )}

          {/* Empty state - no quizzes match current filters */}
          {!loading && !showError && filteredQuizzes.length === 0 && (
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
