import {
  useEffect,
  useMemo,
  useState,
  type ChangeEvent,
} from "react";
import { useNavigate } from "react-router-dom";
import { useQuizContext } from "../contexts/QuizContext";
import styles from "./TakeQuiz.module.css";

type OpenDropdown = null | "category" | "grade" | "sort" | "difficulty";

export default function TakeQuiz() {
  const { quizzes, loading, error, fetchQuizzes } = useQuizContext();

  const [search, setSearch] = useState("");
  const [openDropdown, setOpenDropdown] = useState<OpenDropdown>(null);
  const [difficultyFilter, setDifficultyFilter] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    document.title = "Explore Quizzes - Quizzy Pop";
  }, []);

  useEffect(() => {
    if (quizzes.length === 0) {
      void fetchQuizzes();
    }
  }, [fetchQuizzes, quizzes.length]);

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  const toggleDropdown = (name: OpenDropdown) => {
    setOpenDropdown((prev) => (prev === name ? null : name));
  };

  const handleDifficultyClick = (value: string) => {
    setDifficultyFilter((prev) => (prev === value ? "" : value));
    setOpenDropdown(null);
  };

  const filteredQuizzes = useMemo(
    () =>
      quizzes.filter((quiz) => {
        const matchesSearch =
          search.trim().length === 0 ||
          quiz.title.toLowerCase().includes(search.toLowerCase());

        const matchesDifficulty =
          difficultyFilter === "" ||
          quiz.difficulty.toLowerCase() === difficultyFilter.toLowerCase();

        return matchesSearch && matchesDifficulty;
      }),
    [quizzes, search, difficultyFilter],
  );

  const handleTakeQuiz = (id: number) => {
    navigate(`/quiz/${id}/take`);
  };

  return (
    <section className={styles["take-quiz-page"]}>
      {/* Enkel debug-linje så du SER at komponenten rendrer */}
      <p style={{ color: "red" }}>DEBUG: TakeQuiz rendered</p>

      {/* === TITLE === */}
      <div className={styles["title-row"]}>
        <h1>Explore Quizzes</h1>
        <p>Loaded quizzes: {quizzes.length}</p>
      </div>

      {/* === LAYOUT GRID === */}
      <div className={styles["tq-grid"]}>
        {/* Search + filters */}
        <div className={styles["filter-bar"]}>
          <div className={styles["search-wrapper"]}>
            <input
              className={styles["search-input"]}
              type="search"
              placeholder="Search by keyword or topic..."
              aria-label="Search quizzes"
              value={search}
              onChange={handleSearchChange}
            />
            <img
              src="/images/search.png"
              alt="Search"
              className={styles["search-icon"]}
            />
          </div>

          <div className={styles["dropdown-row"]}>
            {/* Category */}
            <div
              className={`${styles["dropdown"]} ${
                openDropdown === "category" ? styles["open"] : ""
              }`}
            >
              <button
                className={styles["dropdown-btn"]}
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  toggleDropdown("category");
                }}
              >
                Category ▼
              </button>
              <ul className={styles["dropdown-menu"]}>
                <li>Science</li>
                <li>History</li>
                <li>Geography</li>
              </ul>
            </div>

            {/* Grade */}
            <div
              className={`${styles["dropdown"]} ${
                openDropdown === "grade" ? styles["open"] : ""
              }`}
            >
              <button
                className={styles["dropdown-btn"]}
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  toggleDropdown("grade");
                }}
              >
                Grade Level ▼
              </button>
              <ul className={styles["dropdown-menu"]}>
                <li>1–4</li>
                <li>5–7</li>
                <li>8–10</li>
              </ul>
            </div>

            {/* Sort */}
            <div
              className={`${styles["dropdown"]} ${
                openDropdown === "sort" ? styles["open"] : ""
              }`}
            >
              <button
                className={styles["dropdown-btn"]}
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  toggleDropdown("sort");
                }}
              >
                Popular ▼
              </button>
              <ul className={styles["dropdown-menu"]}>
                <li>Newest</li>
                <li>Oldest</li>
                <li>Most Played</li>
              </ul>
            </div>

            {/* Difficulty */}
            <div
              className={`${styles["dropdown"]} ${
                openDropdown === "difficulty" ? styles["open"] : ""
              }`}
            >
              <button
                className={styles["dropdown-btn"]}
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  toggleDropdown("difficulty");
                }}
              >
                Difficulty ▼
              </button>
              <ul className={styles["dropdown-menu"]}>
                <li onClick={() => handleDifficultyClick("easy")}>Easy</li>
                <li onClick={() => handleDifficultyClick("medium")}>Medium</li>
                <li onClick={() => handleDifficultyClick("hard")}>Hard</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Quiz-grid */}
        <div className={styles["quiz-grid"]}>
          {loading && <p>Loading quizzes...</p>}
          {error && <p className={styles["no-quizzes"]}>{error}</p>}

          {!loading && !error && filteredQuizzes.length > 0 && (
            <>
              {filteredQuizzes.map((quiz) => {
                const imgSrc =
                  quiz.imageUrl && quiz.imageUrl.trim().length > 0
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
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                          borderRadius: "12px",
                        }}
                      />
                    </div>
                    <h3 className={styles["quiz-title"]}>{quiz.title}</h3>
                    <p className={styles["quiz-meta"]}>
                      Difficulty: {quiz.difficulty}
                    </p>
                    <p className={styles["quiz-meta"]}>
                      {questionsCount} Questions
                    </p>

                    <button
                      className={styles["btn-take"]}
                      type="button"
                      onClick={() => handleTakeQuiz(quiz.id)}
                    >
                      Take quiz
                    </button>
                  </article>
                );
              })}
            </>
          )}

          {!loading && !error && filteredQuizzes.length === 0 && (
            <p className={styles["no-quizzes"]}>
              No quizzes available right now.
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
