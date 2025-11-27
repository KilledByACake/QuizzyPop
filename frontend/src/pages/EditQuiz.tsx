import { useEffect, useState} from "react";
import type { ChangeEvent } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api";

import Input from "../components/Input";
import Textarea from "../components/Textarea";
import Select from "../components/Select";
import Button from "../components/Button";
import Loader from "../components/Loader";
import Error from "../components/Error";
import Card from "../components/Card";
import TagInput from "../components/TagInput";
import styles from "./EditQuiz.module.css";

interface EditQuestion {
  id: number;
  text: string;
  choices: string[];
  correctChoiceIndex: number;
}

interface EditQuizDto {
  id: number;
  title: string;
  description: string;
  categoryId: string;
  difficulty: string;
  tags?: string[];
  imageUrl?: string | null;
  questions: EditQuestion[];
}

// for uten backend kalr
const USE_DEV_MOCK_WHEN_BACKEND_DOWN = true;

const EditQuiz = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [quiz, setQuiz] = useState<EditQuizDto | null>(null);
  const [imageFile, setImageFile] = useState<File | undefined>();
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // === FETCH QUIZ ===
  useEffect(() => {
    if (!id) {
      setError("Missing quiz id.");
      setLoading(false);
      return;
    }

    const fetchQuiz = async () => {
      try {
        setLoading(true);
        setError(null);

        if (USE_DEV_MOCK_WHEN_BACKEND_DOWN) {
          const mock: EditQuizDto = {
            id: Number(id),
            title: "Mock Quiz to Edit",
            description: "This is a mock quiz used in dev mode.",
            categoryId: "1",
            difficulty: "medium",
            tags: ["math", "algebra"],
            imageUrl: null,
            questions: [
              {
                id: 1,
                text: "2 + 2 = ?",
                choices: ["3", "4", "5"],
                correctChoiceIndex: 1,
              },
              {
                id: 2,
                text: "Capital of France?",
                choices: ["Berlin", "Paris", "Rome"],
                correctChoiceIndex: 1,
              },
            ],
          };
          setQuiz(mock);
          setImagePreview(null);
          return;
        }

        const res = await api.get<EditQuizDto>(
          `/api/quizzes/${id}/with-questions`,
        );

        setQuiz(res.data);
        setImagePreview(res.data.imageUrl ?? null);
      } catch (err) {
        console.error(err);
        setError("Could not load quiz.");
      } finally {
        setLoading(false);
      }
    };

    void fetchQuiz();
  }, [id]);

  // === HANDLERS ===

  const handleMetaChange = (
    e:
      | ChangeEvent<HTMLInputElement>
      | ChangeEvent<HTMLTextAreaElement>
      | ChangeEvent<HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setQuiz((prev) =>
      prev
        ? {
            ...prev,
            [name]: value,
          }
        : prev,
    );
  };

  const handleTagsChange = (tags: string[]) => {
    setQuiz((prev) => (prev ? { ...prev, tags } : prev));
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImageFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleQuestionTextChange = (qIndex: number, value: string) => {
    if (!quiz) return;
    const questions = [...quiz.questions];
    questions[qIndex] = { ...questions[qIndex], text: value };
    setQuiz({ ...quiz, questions });
  };

  const handleChoiceChange = (
    qIndex: number,
    cIndex: number,
    value: string,
  ) => {
    if (!quiz) return;
    const questions = [...quiz.questions];
    const choices = [...questions[qIndex].choices];
    choices[cIndex] = value;
    questions[qIndex] = { ...questions[qIndex], choices };
    setQuiz({ ...quiz, questions });
  };

  const handleCorrectChoiceChange = (qIndex: number, cIndex: number) => {
    if (!quiz) return;
    const questions = [...quiz.questions];
    questions[qIndex] = { ...questions[qIndex], correctChoiceIndex: cIndex };
    setQuiz({ ...quiz, questions });
  };

  const handleAddChoice = (qIndex: number) => {
    if (!quiz) return;
    const questions = [...quiz.questions];
    const choices = [...questions[qIndex].choices, ""];
    questions[qIndex] = { ...questions[qIndex], choices };
    setQuiz({ ...quiz, questions });
  };

  const handleAddQuestion = () => {
    if (!quiz) return;
    const newQuestion: EditQuestion = {
      id: Date.now(), // midlertidig klient-id; backend kan ignorere/overskrive
      text: "",
      choices: ["", ""],
      correctChoiceIndex: 0,
    };
    setQuiz({ ...quiz, questions: [...quiz.questions, newQuestion] });
  };

  const handleRemoveQuestion = (qIndex: number) => {
    if (!quiz) return;
    const questions = [...quiz.questions];
    questions.splice(qIndex, 1);
    setQuiz({ ...quiz, questions });
  };

  const handleCancel = () => {
    navigate("/mypage");
  };

  const handleSave = async () => {
    if (!quiz) return;

    try {
      setSaving(true);
      setError(null);

      // 1) Oppdater metadata (+ bilde)
      const formData = new FormData();
      formData.append("title", quiz.title);
      formData.append("description", quiz.description);
      formData.append("categoryId", quiz.categoryId);
      formData.append("difficulty", quiz.difficulty);

      if (quiz.tags && quiz.tags.length > 0) {
        formData.append("tags", JSON.stringify(quiz.tags));
      }

      if (imageFile) {
        formData.append("image", imageFile);
      }

      await api.put(`/api/quizzes/${quiz.id}`, formData);

      // 2) Oppdater spørsmål (en veldig enkel bulk-oppdatering)
      //    Juster til dine faktiske endpoints hvis de er annerledes.
      await api.put(`/api/quizzes/${quiz.id}/questions`, {
        questions: quiz.questions.map((q) => ({
          id: q.id,
          text: q.text,
          choices: q.choices,
          correctChoiceIndex: q.correctChoiceIndex,
        })),
      });

      navigate("/mypage");
    } catch (err) {
      console.error(err);
      setError("Could not save quiz changes.");
    } finally {
      setSaving(false);
    }
  };

  // === RENDER ===

  if (!id) {
    return <Error message="Missing quiz id" />;
  }

  if (loading) {
    return (
      <section className={styles.page}>
        <Loader text="Loading quiz..." />
      </section>
    );
  }

  if (error || !quiz) {
    return (
      <section className={styles.page}>
        <Error message={error ?? "Quiz not found."} />
        <div className={styles.actions}>
          <Button type="button" variant="gray" onClick={() => navigate(-1)}>
            ← Back
          </Button>
        </div>
      </section>
    );
  }

  const categories = [
    { value: "", label: "Select a category" },
    { value: "1", label: "Math" },
    { value: "2", label: "Science" },
    { value: "3", label: "History" },
    { value: "4", label: "Geography" },
    { value: "5", label: "Entertainment" },
  ];

  const difficulties = [
    { value: "easy", label: "Easy" },
    { value: "medium", label: "Medium" },
    { value: "hard", label: "Hard" },
  ];

  return (
    <section className={styles.page}>
      <header className={styles.header}>
        <h1>Edit Quiz</h1>
        <p>Edit quiz details and questions, then save your changes.</p>
      </header>

      {/* METADATA CARD */}
      <Card variant="elevated" className={styles.metaCard}>
        <div className={styles.metaGrid}>
          <Input
            label="Quiz Title"
            placeholder="Enter quiz title"
            value={quiz.title}
            name="title"
            onChange={handleMetaChange}
            required
          />

          <Textarea
            label="Description"
            placeholder="Describe what your quiz is about..."
            rows={3}
            value={quiz.description}
            name="description"
            onChange={handleMetaChange}
            required
          />

          <Select
            label="Category"
            options={categories}
            value={quiz.categoryId}
            name="categoryId"
            onChange={handleMetaChange}
            required
          />

          <Select
            label="Difficulty"
            options={difficulties}
            value={quiz.difficulty}
            name="difficulty"
            onChange={handleMetaChange}
            required
          />

          <TagInput
            label="Tags"
            hint="Short keywords (e.g. math, algebra, grade-5)."
            value={quiz.tags ?? []}
            onChange={handleTagsChange}
          />

          <div className={styles.imageUpload}>
            <label className={styles.imageLabel}>
              Quiz Cover Image
              <span className={styles.optional}>(Optional)</span>
            </label>
            <div className={styles.imagePreviewContainer}>
              {imagePreview ? (
                <div className={styles.imagePreview}>
                  <img src={imagePreview} alt="Quiz cover" />
                  <button
                    type="button"
                    className={styles.removeImage}
                    onClick={() => {
                      setImagePreview(null);
                      setImageFile(undefined);
                    }}
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <label className={styles.uploadBox}>
                  <input
                    type="file"
                    accept="image/jpeg,image/jpg,image/png,image/webp"
                    onChange={handleImageChange}
                    className={styles.fileInput}
                  />
                  <div className={styles.uploadContent}>
                    <span className={styles.uploadIcon}>📷</span>
                    <span className={styles.uploadText}>Click to upload image</span>
                    <span className={styles.uploadHint}>
                      PNG, JPG, WEBP up to 5MB
                    </span>
                  </div>
                </label>
              )}
            </div>
          </div>
        </div>
      </Card>

      {/* QUESTIONS */}
      <section className={styles.questionsSection}>
        <div className={styles.questionsHeader}>
          <h2>Questions</h2>
          <Button
            type="button"
            variant="primary"
            onClick={handleAddQuestion}
          >
            + Add Question
          </Button>
        </div>

        {quiz.questions.length === 0 ? (
          <p>No questions yet. Add your first question.</p>
        ) : (
          <div className={styles.questionsList}>
            {quiz.questions.map((q, qIndex) => (
              <Card
                key={q.id}
                variant="default"
                className={styles.questionCard}
              >
                <div className={styles.questionHeader}>
                  <h3>Question {qIndex + 1}</h3>
                  <button
                    type="button"
                    className={styles.removeQuestion}
                    onClick={() => handleRemoveQuestion(qIndex)}
                  >
                    Remove
                  </button>
                </div>

                <Textarea
                  label="Question text"
                  value={q.text}
                  onChange={(e) =>
                    handleQuestionTextChange(qIndex, e.target.value)
                  }
                  rows={2}
                />

                <div className={styles.choices}>
                  <label className={styles.choicesLabel}>Answer options</label>
                  {q.choices.map((choice, cIndex) => (
                    <div className={styles.choiceRow} key={cIndex}>
                      <input
                        type="radio"
                        name={`correct-${q.id}`}
                        checked={q.correctChoiceIndex === cIndex}
                        onChange={() =>
                          handleCorrectChoiceChange(qIndex, cIndex)
                        }
                      />
                      <input
                        type="text"
                        value={choice}
                        placeholder={`Option ${cIndex + 1}`}
                        className={styles.choiceInput}
                        onChange={(e) =>
                          handleChoiceChange(
                            qIndex,
                            cIndex,
                            e.target.value,
                          )
                        }
                      />
                    </div>
                  ))}

                  <button
                    type="button"
                    className={styles.addChoice}
                    onClick={() => handleAddChoice(qIndex)}
                  >
                    + Add option
                  </button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </section>

      {/* ACTIONS */}
      <div className={styles.actions}>
        <Button
          type="button"
          variant="gray"
          onClick={handleCancel}
          disabled={saving}
        >
          Cancel
        </Button>
        <Button
          type="button"
          variant="primary"
          onClick={handleSave}
          disabled={saving}
        >
          {saving ? "Saving..." : "Save changes"}
        </Button>
      </div>
    </section>
  );
};

export default EditQuiz;
