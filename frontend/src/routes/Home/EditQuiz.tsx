import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import "../../routes/Home/EditQuiz.css";
import { api } from "../../api";

type Category = { id: number; name: string };

type Question = {
  id: number;
  text: string;
  choices: string[];
  correctAnswerIndex: number;
  points: number;
  timeLimit: number; // seconds, 0 = no limit
};

type Quiz = {
  id: number;
  title: string;
  description: string;
  categoryId: number | "";
  difficulty: "Easy" | "Medium" | "Hard";
  coverImage?: File | null;
  questions: Question[];
};

export default function EditQuiz() {
  const { id } = useParams(); // expects /admin/quizzes/:id/edit
  const nav = useNavigate();

  const [quiz, setQuiz] = useState<Quiz>({
    id: Number(id),
    title: "",
    description: "",
    categoryId: "",
    difficulty: "Easy",
    coverImage: null,
    questions: [],
  });

  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // load categories + quiz
    const load = async () => {
      const [catRes, quizRes] = await Promise.all([
        api.get("/categories"),
        api.get(`/quizzes/${id}`),
      ]);

      setCategories(catRes.data);

      const q = quizRes.data;
      setQuiz({
        id: q.id,
        title: q.title ?? "",
        description: q.description ?? "",
        categoryId: q.categoryId ?? "",
        difficulty: (q.difficulty ?? "Easy") as Quiz["difficulty"],
        coverImage: null,
        questions: (q.questions ?? []).map((qq: any) => ({
          id: qq.id,
          text: qq.text ?? "",
          choices: qq.choices ?? ["", ""],
          correctAnswerIndex: qq.correctAnswerIndex ?? 0,
          points: qq.points ?? 1,
          timeLimit: qq.timeLimit ?? 0,
        })),
      });

      setLoading(false);
    };
    load();
  }, [id]);

  const setField = (field: keyof Quiz, value: any) =>
    setQuiz(prev => ({ ...prev, [field]: value }));

  const setQuestionField = (index: number, field: keyof Question, value: any) =>
    setQuiz(prev => ({
      ...prev,
      questions: prev.questions.map((q, i) => (i === index ? { ...q, [field]: value } : q)),
    }));

  const setChoice = (qIndex: number, cIndex: number, value: string) =>
    setQuiz(prev => ({
      ...prev,
      questions: prev.questions.map((q, i) =>
        i === qIndex
          ? { ...q, choices: q.choices.map((c, j) => (j === cIndex ? value : c)) }
          : q
      ),
    }));

  const onFile = (f: File | null) => setField("coverImage", f);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();

    const fd = new FormData();
    fd.append("title", quiz.title);
    fd.append("description", quiz.description);
    fd.append("categoryId", String(quiz.categoryId));
    fd.append("difficulty", quiz.difficulty);
    if (quiz.coverImage) fd.append("coverImage", quiz.coverImage);

    fd.append(
      "questionsJson",
      JSON.stringify(
        quiz.questions.map(q => ({
          id: q.id,
          text: q.text,
          choices: q.choices,
          correctAnswerIndex: q.correctAnswerIndex,
          points: q.points,
          timeLimit: q.timeLimit,
        }))
      )
    );

    await api.put(`/quizzes/${quiz.id}`, fd, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    nav("/mypage");
  };

  if (loading) return <section className="edit-quiz-page"><p>Loading…</p></section>;

  return (
    <section className="edit-quiz-page">
      <div className="edit-quiz-header">
        <h1>Edit Quiz</h1>
      </div>

      <div className="edit-quiz-card">
        <form className="edit-quiz-form" onSubmit={submit} encType="multipart/form-data">
          {/* Quiz info */}
          <div className="edit-form-group">
            <label htmlFor="title">Title</label>
            <input
              id="title"
              className="edit-form-input"
              value={quiz.title}
              onChange={e => setField("title", e.target.value)}
              required
            />
          </div>

          <div className="edit-form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              className="edit-form-input"
              value={quiz.description}
              onChange={e => setField("description", e.target.value)}
            />
          </div>

          <div className="edit-form-group">
            <label htmlFor="categoryId">Category</label>
            <select
              id="categoryId"
              className="edit-form-input"
              value={quiz.categoryId}
              onChange={e => setField("categoryId", Number(e.target.value))}
            >
              <option value="">Select a category</option>
              {categories.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>

          <div className="edit-form-group">
            <label htmlFor="difficulty">Difficulty</label>
            <select
              id="difficulty"
              className="edit-form-input"
              value={quiz.difficulty}
              onChange={e => setField("difficulty", e.target.value)}
            >
              <option value="Easy">Easy</option>
              <option value="Medium">Medium</option>
              <option value="Hard">Hard</option>
            </select>
          </div>

          <div className="edit-form-group">
            <label htmlFor="coverImage">Cover Image</label>
            <input
              id="coverImage"
              type="file"
              className="edit-form-input"
              accept="image/*"
              onChange={e => onFile(e.target.files?.[0] ?? null)}
            />
          </div>

          {/* Questions */}
          <hr />
          <h2>Questions</h2>

          <div id="questions">
            {quiz.questions.map((q, i) => (
              <div className="question-card" key={q.id ?? i}>
                <div className="question-header">
                  <h3>Question {i + 1}</h3>
                </div>

                <div className="edit-form-group">
                  <label htmlFor={`q-text-${i}`}>Question Text</label>
                  <textarea
                    id={`q-text-${i}`}
                    className="edit-form-input"
                    rows={3}
                    value={q.text}
                    onChange={e => setQuestionField(i, "text", e.target.value)}
                  />
                </div>

                <div className="edit-form-group">
                  <label>Answer Options</label>
                  <div className="options-container">
                    {q.choices.map((choice, j) => (
                      <div
                        className={`option-row ${j === q.correctAnswerIndex ? "correct-option" : ""}`}
                        key={j}
                      >
                        <input
                          type="radio"
                          name={`correct-${i}`}
                          value={j}
                          checked={j === q.correctAnswerIndex}
                          onChange={() => setQuestionField(i, "correctAnswerIndex", j)}
                        />
                        <input
                          type="text"
                          className="edit-form-input"
                          value={choice}
                          onChange={e => setChoice(i, j, e.target.value)}
                        />
                      </div>
                    ))}
                  </div>
                </div>

                <div className="form-row">
                  <div className="edit-form-group half">
                    <label htmlFor={`points-${i}`}>Points</label>
                    <input
                      id={`points-${i}`}
                      type="number"
                      className="edit-form-input"
                      min={1}
                      value={q.points}
                      onChange={e => setQuestionField(i, "points", e.target.valueAsNumber || 1)}
                    />
                  </div>
                  <div className="edit-form-group half">
                    <label htmlFor={`timelimit-${i}`}>Time Limit (seconds)</label>
                    <input
                      id={`timelimit-${i}`}
                      type="number"
                      className="edit-form-input"
                      min={0}
                      value={q.timeLimit}
                      onChange={e => setQuestionField(i, "timeLimit", e.target.valueAsNumber || 0)}
                    />
                    <span className="form-hint">0 = no time limit</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="edit-button-row">
            <Link to="/mypage" className="btn-cancel">Cancel</Link>
            <button type="submit" className="btn-save">Save Changes</button>
          </div>
        </form>
      </div>
    </section>
  );
}
