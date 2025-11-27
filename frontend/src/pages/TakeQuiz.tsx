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

// for testing,
const USE_DEV_MOCK_WHEN_BACKEND_DOWN = true;

type QuizSummary = {
  id: number;
  title: string;
  difficulty: string;
  imageUrl?: string | null;
  questionsCount?: number;
};

// En enkel mock-liste til frontend-utvikling
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

export default function TakeQuiz() {
  const { quizzes, loading, error, fetchQuizzes } = useQuizContext();

  const [search, setSearch] = useState("");
  const [difficultyFilter, setDifficultyFilter] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>();
  const [selectedGrade, setSelectedGrade] = useState<string | undefined>();
  const [selectedSort, setSelectedSort] = useState<string | undefined>();

  const navigate = useNavigate();

  // Sett tittel i fanen
  useEffect(() => {
    document.title = "Explore Quizzes - Quizzy Pop";
  }, []);

  // Hent quizer kun en gang
  const hasFetchedRef = useRef(false);

  useEffect(() => {
    if (!hasFetchedRef.current) {
      hasFetchedRef.current = true;
      void fetchQuizzes();
    }
  }, [fetchQuizzes]);

  const handleDifficultySelect = (option: string) => {
    const normalized = option.toLowerCase();
    setDifficultyFilter((prev) => (prev === normalized ? "" : normalized));
  };

  // Velg om vi skal bruke ekte quizer eller mock
  const sourceQuizzes = useMemo(() => {
    if (
      USE_DEV_MOCK_WHEN_BACKEND_DOWN &&
      (!quizzes.length || error)
    ) {
      return MOCK_QUIZZES;
    }
    return quizzes;
  }, [quizzes, error]);

  // Filter logikk
  const filteredQuizzes = useMemo(() => {
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
  }, [sourceQuizzes, search, difficultyFilter]);

  const handleTakeQuiz = (id: number) => {
    navigate(`/quiz/${id}/take`);
  };

  // Labels til dropdowns
  const difficultyLabel =
    difficultyFilter === ""
      ? undefined
      : difficultyFilter.charAt(0).toUpperCase() + difficultyFilter.slice(1);

  // Dropdown-alternativer
  const categoryOptions = ["Science", "History", "Geography"];
  const gradeOptions = ["1–4", "5–7", "8–10"];
  const sortOptions = ["Newest", "Oldest", "Most Played"];
  const difficultyOptions = ["Easy", "Medium", "Hard"];

  const showError = error && !USE_DEV_MOCK_WHEN_BACKEND_DOWN;

  return (
    <section className={styles["take-quiz-page"]}>
      <div className={styles["title-row"]}>
        <h1>Explore Quizzes</h1>
        <p>Loaded quizzes: {sourceQuizzes.length}</p>
      </div>

      <div className={styles["tq-grid"]}>
        {/* === Search + filters === */}
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

            {/* 🎯 Faktisk filter */}
            <FilterDropdown
              label="Difficulty"
              options={difficultyOptions}
              selected={difficultyLabel}
              onSelect={handleDifficultySelect}
            />
          </div>
        </div>

        {/* === Quiz Cards === */}
        <div className={styles["quiz-grid"]}>
          {loading && ( <Loader text="Loading quizzes..." />)}
          {showError && <p className={styles["no-quizzes"]}>{error}</p>}

          {!loading && !showError && filteredQuizzes.length > 0 && (
            <>
              {filteredQuizzes.map((quiz) => {
                const imgSrc =
                  quiz.imageUrl?.trim()
                    ? quiz.imageUrl
                    : "/images/default-cover.png";

                const questionsCount =
                  (quiz as any).questionsCount ?? 0;

                return (
                  <article className={styles["quiz-card"]} key={quiz.id}>
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

                    <Button
                      className={styles["btn-take"]}
                      type="button"
                      variant="primary"
                      onClick={() => handleTakeQuiz(quiz.id)}
                    >
                      Take quiz
                    </Button>
                  </article>
                );
              })}
            </>
          )}

          {!loading && !showError && filteredQuizzes.length === 0 && (
            <div className={styles["no-quizzes"]}>
              <Mascot />
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
