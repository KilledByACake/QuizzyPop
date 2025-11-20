import {
  useEffect,
  useMemo,
  useState,
  type ChangeEvent,
} from "react";
import { useNavigate } from "react-router-dom";
import { useQuizContext } from "../contexts/QuizContext";
import "./TakeQuiz.css";

const TakeQuiz = () => {
  const { quizzes, loading, error, fetchQuizzes } = useQuizContext();
  const [search, setSearch] = useState("");
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [difficultyFilter, setDifficultyFilter] = useState<string>("");

  const navigate = useNavigate();

  useEffect(() => {
    if (quizzes.length === 0) {
      void fetchQuizzes();
    }
  }, [fetchQuizzes, quizzes.length]);

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  const toggleDropdown = (name: string) => {
    setOpenDropdown((prev) => (prev === name ? null : name));
  };

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest(".dropdown")) {
        setOpenDropdown(null);
      }
    };

    document.addEventListener("click", handler);
    return () => document.removeEventListener("click", handler);
  }, []);

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

  const handleDifficultyClick = (value: string) => {
    setDifficultyFilter((prev) => (prev === value ? "" : value));
    setOpenDropdown(null);
  };

  return (
    <section className="take-quiz-page">
      <div className="title-row">
        <h1>Explore Quizzes</h1>
      </div>

      <div className="tq-grid">
        <div className="filter-col">
          <div className="filter-bar">
            <div className="search-wrapper">
              <input
                className="search-input"
                type="search"
                placeholder="Search by keyword or topic..."
                aria-label="Search quizzes"
                value={search}
                onChange={handleSearchChange}
              />
              <img
                src="/images/search.png"
                alt="Search"
                className="search-icon"
              />
            </div>

            <div className="dropdown-row">
              <div
                className={`dropdown ${
                  openDropdown === "category" ? "open" : ""
                }`}
              >
                <button
                  className="dropdown-btn"
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleDropdown("category");
                  }}
                >
                  Category ▼
                </button>
                <ul className="dropdown-menu">
                  <li>Science</li>
                  <li>History</li>
                  <li>Geography</li>
                </ul>
              </div>

              <div
                className={`dropdown ${openDropdown === "grade" ? "open" : ""}`}
              >
                <button
                  className="dropdown-btn"
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleDropdown("grade");
                  }}
                >
                  Grade Level ▼
                </button>
                <ul className="dropdown-menu">
                  <li>1–4</li>
                  <li>5–7</li>
                  <li>8–10</li>
                </ul>
              </div>

              <div
                className={`dropdown ${openDropdown === "sort" ? "open" : ""}`}
              >
                <button
                  className="dropdown-btn"
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleDropdown("sort");
                  }}
                >
                  Popular ▼
                </button>
                <ul className="dropdown-menu">
                  <li>Newest</li>
                  <li>Oldest</li>
                  <li>Most Played</li>
                </ul>
              </div>

              <div
                className={`dropdown ${
                  openDropdown === "difficulty" ? "open" : ""
                }`}
              >
                <button
                  className="dropdown-btn"
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleDropdown("difficulty");
                  }}
                >
                  Difficulty ▼
                </button>
                <ul className="dropdown-menu">
                  <li onClick={() => handleDifficultyClick("easy")}>Easy</li>
                  <li onClick={() => handleDifficultyClick("medium")}>
                    Medium
                  </li>
                  <li onClick={() => handleDifficultyClick("hard")}>Hard</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div className="quiz-col">
          <div className="quiz-grid">
            {loading && <p>Loading quizzes...</p>}
            {error && <p className="no-quizzes">{error}</p>}

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
                    <article className="quiz-card" key={quiz.id}>
                      <div className="quiz-thumb">
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
                      <h3 className="quiz-title">{quiz.title}</h3>
                      <p className="quiz-meta">
                        Difficulty: {quiz.difficulty}
                      </p>
                      <p className="quiz-meta">
                        {questionsCount} Questions
                      </p>

                      <button
                        className="btn-take"
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
              <p className="no-quizzes">No quizzes available right now.</p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TakeQuiz;
