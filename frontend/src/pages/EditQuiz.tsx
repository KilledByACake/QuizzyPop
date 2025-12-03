import { useEffect, useState } from "react";
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

/** Question structure for editing */
interface EditQuestion {
  id: number; // existing DB id (positive) or temporary negative id for newly added questions
  text: string;
  choices: string[];
  correctChoiceIndex: number;
}

/** Quiz data structure with questions for editing */
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

/**
 * EditQuiz Page
 *
 * Allows editing quiz metadata (title, description, category, difficulty, tags, image)
 * and associated multiple-choice questions.
 *
 * IMPLEMENTATION STATUS:
 * 
 * FULLY IMPLEMENTED:
 * - Load quiz with questions (GET /api/quizzes/{id}/with-questions)
 * - Edit quiz metadata (title, description, category, difficulty, tags)
 * - Image upload with preview and removal
 * - Add/edit/remove questions
 * - Add/edit answer choices with correct answer selection
 * - Save changes (PUT quiz metadata, POST/PUT/DELETE questions)
 * - Navigation back to MyPage
 * 
 * PARTIALLY IMPLEMENTED:
 * - Only supports multiple-choice questions (no true/false, fill-in-blank, etc.)
 * - Question types limited by backend schema
 * 
 * Backend expectations (aligned with AddQuestions page):
 * - GET  /api/quizzes/{id}/with-questions
 * - PUT  /api/quizzes/{id}            (quiz metadata & image)
 * - PUT  /api/quiz-questions/{id}     (update existing question)
 * - POST /api/quiz-questions          (create new question)
 * - DELETE /api/quiz-questions/{id}   (delete question)
 */
const EditQuiz = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [quiz, setQuiz] = useState<EditQuizDto | null>(null);
  const [imageFile, setImageFile] = useState<File | undefined>();
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Track which existing questions have been deleted so we can call DELETE on save
  const [deletedQuestionIds, setDeletedQuestionIds] = useState<number[]>([]);

  // ---------------------------
  // Load quiz with questions
  // ---------------------------
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

        const res = await api.get<EditQuizDto>(
          `/api/quizzes/${id}/with-questions`
        );

        const loadedQuiz: EditQuizDto = {
          ...res.data,
          categoryId: String((res.data as any).categoryId ?? ""),
        };

        setQuiz(loadedQuiz);
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

  // ---------------------------
  // Handlers - metadata
  // ---------------------------

  /** Handle changes to quiz metadata fields (title, description, category, difficulty) */
  const handleMetaChange = (
    e:
      | ChangeEvent<HTMLInputElement>
      | ChangeEvent<HTMLTextAreaElement>
      | ChangeEvent<HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setQuiz((prev) =>
      prev
        ? {
            ...prev,
            [name]: value,
          }
        : prev
    );
  };

  /** Handle changes to tags array */
  const handleTagsChange = (tags: string[]) => {
    setQuiz((prev) => (prev ? { ...prev, tags } : prev));
  };

  /** Handle image file selection and preview generation */
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

  // ---------------------------
  // Handlers - questions
  // ---------------------------

  /** Update question text */
  const handleQuestionTextChange = (qIndex: number, value: string) => {
    if (!quiz) return;
    const questions = [...quiz.questions];
    questions[qIndex] = { ...questions[qIndex], text: value };
    setQuiz({ ...quiz, questions });
  };

  /** Update a specific answer choice */
  const handleChoiceChange = (
    qIndex: number,
    cIndex: number,
    value: string
  ) => {
    if (!quiz) return;
    const questions = [...quiz.questions];
    const choices = [...questions[qIndex].choices];
    choices[cIndex] = value;
    questions[qIndex] = { ...questions[qIndex], choices };
    setQuiz({ ...quiz, questions });
  };

  /** Mark an answer choice as correct */
  const handleCorrectChoiceChange = (qIndex: number, cIndex: number) => {
    if (!quiz) return;
    const questions = [...quiz.questions];
    questions[qIndex] = { ...questions[qIndex], correctChoiceIndex: cIndex };
    setQuiz({ ...quiz, questions });
  };

  /** Add a new answer choice to a question */
  const handleAddChoice = (qIndex: number) => {
    if (!quiz) return;
    const questions = [...quiz.questions];
    const choices = [...questions[qIndex].choices, ""];
    questions[qIndex] = { ...questions[qIndex], choices };
    setQuiz({ ...quiz, questions });
  };

  /** Add a new question (temporary negative id, backend will create real id on POST) */
  const handleAddQuestion = () => {
    if (!quiz) return;
    const newQuestion: EditQuestion = {
      id: -Date.now(), // negative id -> indicates "new question" not yet in DB
      text: "",
      choices: ["", ""],
      correctChoiceIndex: 0,
    };
    setQuiz({ ...quiz, questions: [...quiz.questions, newQuestion] });
  };

  /** Remove a question (and track deletions for existing DB questions) */
  const handleRemoveQuestion = (qIndex: number) => {
    if (!quiz) return;
    const questions = [...quiz.questions];
    const removed = questions[qIndex];

    // If it's an existing DB question (id > 0), remember to DELETE it on save
    if (removed && removed.id > 0) {
      setDeletedQuestionIds((prev) =>
        prev.includes(removed.id) ? prev : [...prev, removed.id]
      );
    }

    questions.splice(qIndex, 1);
    setQuiz({ ...quiz, questions });
  };

  /** Cancel editing and return to MyPage */
  const handleCancel = () => {
    navigate("/mypage");
  };

  // ---------------------------
  // Save quiz changes
  // ---------------------------

  const handleSave = async () => {
    if (!quiz) return;

    try {
      setSaving(true);
      setError(null);

      // 1) Update quiz metadata (including optional image, tags)
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

      // 2) Delete questions that were removed (existing ones only)
      if (deletedQuestionIds.length > 0) {
        await Promise.all(
          deletedQuestionIds.map((qId) =>
            api.delete(`/api/quiz-questions/${qId}`)
          )
        );
      }

      // 3) Split questions into existing (id > 0) and new (id < 0)
      const existingQuestions = quiz.questions.filter((q) => q.id > 0);
      const newQuestions = quiz.questions.filter((q) => q.id < 0);

      // 4) Update existing questions
      if (existingQuestions.length > 0) {
        await Promise.all(
          existingQuestions.map((q) =>
            api.put(`/api/quiz-questions/${q.id}`, {
              text: q.text,
              choices: q.choices,
              // Must match backend naming used in AddQuestions: correctAnswerIndex
              correctAnswerIndex: q.correctChoiceIndex,
            })
          )
        );
      }

      // 5) Create new questions
      if (newQuestions.length > 0) {
        await Promise.all(
          newQuestions.map((q) =>
            api.post(`/api/quiz-questions`, {
              quizId: quiz.id,
              text: q.text,
              choices: q.choices,
              correctAnswerIndex: q.correctChoiceIndex,
            })
          )
        );
      }

      // On success: go back to MyPage
      navigate("/mypage");
    } catch (err) {
      console.error(err);
      setError("Could not save quiz changes.");
    } finally {
      setSaving(false);
    }
  };

  // ---------------------------
  // Render
  // ---------------------------

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

  /** Category options - should match backend seeded categories */
  const categories = [
    { value: "", label: "Select a category" },
    { value: "1", label: "Math" },
    { value: "2", label: "Science" },
    { value: "3", label: "History" },
    { value: "4", label: "Geography" },
    { value: "5", label: "Entertainment" },
  ];

  /** Difficulty level options */
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

      {/* Quiz metadata editor card */}
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

          {/* Image upload section */}
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

      {/* Questions editor section */}
      <section className={styles.questionsSection}>
        <div className={styles.questionsHeader}>
          <h2>Questions</h2>
          <Button type="button" variant="primary" onClick={handleAddQuestion}>
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

                {/* Question text editor */}
                <Textarea
                  label="Question text"
                  value={q.text}
                  onChange={(e) =>
                    handleQuestionTextChange(qIndex, e.target.value)
                  }
                  rows={2}
                />

                {/* Answer choices with radio buttons for correct answer */}
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
                            e.target.value
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

      {/* Save/Cancel actions */}
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
