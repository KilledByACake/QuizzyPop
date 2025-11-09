import { useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { api } from "../../api";
import QuizQuestion from "../../components/QuizQuestion";
import "../AddQuestions.css";

type Question = {
  text: string;
  image: File | null;
  options: string[];
  points: number;
  timeLimit: number; // seconds
  explanation: string;
  shuffleAnswers: boolean;
  required: boolean;
};

export default function AddQuestions() {
  const { quizId } = useParams(); // expects route: /admin/quizzes/:quizId/add-questions
  const nav = useNavigate();

  const [questions, setQuestions] = useState<Question[]>([
    {
      text: "",
      image: null,
      options: ["", "", "", ""],
      points: 10,
      timeLimit: 30,
      explanation: "",
      shuffleAnswers: false,
      required: true,
    },
  ]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
    index: number
  ) => {
    const { name, type, value, checked, files } = e.target as HTMLInputElement;
    setQuestions(prev =>
      prev.map((q, i) =>
        i !== index
          ? q
          : {
              ...q,
              [name]:
                type === "checkbox" ? checked :
                type === "file" ? (files && files[0] ? files[0] : null) :
                name === "points" || name === "timeLimit" ? Number(value) :
                value,
            }
      )
    );
  };

  const handleOptionChange = (qIndex: number, optIndex: number, val: string) => {
    setQuestions(prev =>
      prev.map((q, i) =>
        i === qIndex
          ? { ...q, options: q.options.map((o, j) => (j === optIndex ? val : o)) }
          : q
      )
    );
  };

  const addOption = (qIndex: number) => {
    setQuestions(prev =>
      prev.map((q, i) => (i === qIndex ? { ...q, options: [...q.options, ""] } : q))
    );
  };

  const addQuestionCard = () => {
    setQuestions(prev => [
      ...prev,
      {
        text: "",
        image: null,
        options: ["", "", "", ""],
        points: 10,
        timeLimit: 30,
        explanation: "",
        shuffleAnswers: false,
        required: false,
      },
    ]);
  };

  const removeQuestion = (index: number) => {
    setQuestions(prev => prev.filter((_, i) => i !== index));
  };

  const moveUp = (index: number) => {
    if (index === 0) return;
    setQuestions(prev => {
      const arr = [...prev];
      [arr[index - 1], arr[index]] = [arr[index], arr[index - 1]];
      return arr;
    });
  };

  const moveDown = (index: number) => {
    setQuestions(prev => {
      if (index === prev.length - 1) return prev;
      const arr = [...prev];
      [arr[index], arr[index + 1]] = [arr[index + 1], arr[index]];
      return arr;
    });
  };

  // Build FormData (supports optional images)
  const toFormData = () => {
    const fd = new FormData();
    fd.append("quizId", String(quizId ?? ""));
    fd.append(
      "questionsJson",
      JSON.stringify(
        questions.map(q => ({
          text: q.text,
          options: q.options,
          points: q.points,
          timeLimit: q.timeLimit,
          explanation: q.explanation,
          shuffleAnswers: q.shuffleAnswers,
          required: q.required,
        }))
      )
    );
    questions.forEach((q, i) => {
      if (q.image) fd.append(`image_${i}`, q.image);
    });
    return fd;
  };

  // POST to API
  const saveQuestions = async () => {
    const endpoint = `/quizzes/${quizId}/questions`;
    const fd = toFormData();
    await api.post(endpoint, fd, { headers: { "Content-Type": "multipart/form-data" } });
  };

  const onClickAddAnother = async () => {
    await saveQuestions();
    addQuestionCard();
  };

  const onClickPublish = async () => {
    await saveQuestions();
    nav(`/quizzes/${quizId}`);
  };

  return (
    <section className="create-quiz-page">
      <div className="page-header">
        <img src="/images/quizzy-blueberry.png" alt="Quizzy Pop mascot" className="mascot" />
        <h1>Now add some questions!</h1>
        <p className="subtitle">Share knowledge through fun questions!</p>
      </div>

      <div id="questions">
        {questions.map((q, i) => (
          <div className="quiz-card" key={i}>
            <div className="question-header">
              <h3>Question {i + 1}</h3>
              <div className="question-controls">
                <button
                  type="button"
                  className="move-up-btn"
                  title="Move question up"
                  onClick={() => moveUp(i)}
                  disabled={i === 0}
                >
                  ↑
                </button>
                <button
                  type="button"
                  className="move-down-btn"
                  title="Move question down"
                  onClick={() => moveDown(i)}
                  disabled={i === questions.length - 1}
                >
                  ↓
                </button>
                <button
                  type="button"
                  className="remove-question-btn"
                  title="Remove question"
                  onClick={() => removeQuestion(i)}
                >
                  ✕
                </button>
              </div>
            </div>

            <QuizQuestion
              index={i}
              text={q.text}
              image={q.image}
              options={q.options}
              points={q.points}
              timeLimit={String(q.timeLimit)}
              explanation={q.explanation}
              shuffleAnswers={q.shuffleAnswers}
              required={q.required}
              onChange={handleChange}
              onOptionChange={handleOptionChange}
              onAddOption={addOption}
              onRemove={removeQuestion}
              onMoveUp={moveUp}
              onMoveDown={moveDown}
            />
          </div>
        ))}
      </div>

      <div className="action-buttons">
        <div className="button-row">
          <Link to="/" className="btn-prev">Cancel</Link>
          <button type="button" className="btn-next" onClick={onClickAddAnother}>
            Add Another Question
          </button>
          <button type="button" className="btn-publish" onClick={onClickPublish}>
            Publish Quiz
          </button>
        </div>
      </div>
    </section>
  );
}
