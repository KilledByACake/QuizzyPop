import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./CreateQuiz.css";
import { api } from "../../api";

type Category = {
  id: number;
  name: string;
};

export default function CreateQuiz() {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [categoryId, setCategoryId] = useState<number | "">("");
  const [categories, setCategories] = useState<Category[]>([]);
  const [difficulty, setDifficulty] = useState("Easy");
  const [timeLimit, setTimeLimit] = useState<number | "">("");
  const [isPublic, setIsPublic] = useState(true);


  useEffect(() => {
    const fetchCategories = async () => {
      const res = await api.get("/categories");
      setCategories(res.data);
    };
    fetchCategories();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setCoverImage(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    if (coverImage) formData.append("coverImage", coverImage);
    formData.append("categoryId", String(categoryId));
    formData.append("difficulty", difficulty);
    formData.append("timeLimit", String(timeLimit || 0));
    formData.append("isPublic", String(isPublic));

    await api.post("/quizzes", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    navigate("/admin/quizzes/add-questions"); 
  };

  return (
    <section className="qp-page create-quiz-page">
      <div className="page-header">
        <img
          src="/images/quizzy-blueberry.png"
          alt="Quizzy Pop mascot"
          className="mascot"
        />
        <h1>Create Your Quiz</h1>
        <p className="subtitle">Share knowledge through fun questions!</p>
      </div>

      <div className="quiz-card">
        <form onSubmit={handleSubmit} encType="multipart/form-data">
          {/* Title */}
          <div className="form-group">
            <label htmlFor="title">Quiz Title</label>
            <input
              id="title"
              className="form-input"
              placeholder="Enter quiz title..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          {/* Description */}
          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              className="form-input"
              rows={3}
              placeholder="Describe your quiz..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          {/* Cover Image */}
          <div className="form-group">
            <label htmlFor="coverImage">Cover Image</label>
            <div
              className="file-upload"
              onClick={() =>
                document.getElementById("coverImageInput")?.click()
              }
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                const file = e.dataTransfer.files[0];
                if (file) setCoverImage(file);
              }}
            >
              <input
                id="coverImageInput"
                type="file"
                className="file-input"
                accept="image/*"
                onChange={handleFileChange}
              />
              <div className="file-placeholder">
                <i className="fas fa-cloud-upload-alt"></i>
                <span>
                  {coverImage ? `Selected: ${coverImage.name}` : "Choose an image or drag it here"}
                </span>
              </div>
            </div>
            <span className="form-hint">
              Maximum size: 2MB. Recommended: 1200x630px
            </span>
          </div>

          {/* Category + Difficulty */}
          <div className="form-row">
            <div className="form-group half">
              <label htmlFor="category">Category</label>
              <select
                id="category"
                className="form-input"
                value={categoryId}
                onChange={(e) => setCategoryId(Number(e.target.value))}
              >
                <option value="">Select a category</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group half">
              <label htmlFor="difficulty">Difficulty</label>
              <select
                id="difficulty"
                className="form-input"
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
              >
                <option value="Easy">Easy (10 points per question)</option>
                <option value="Medium">Medium (20 points per question)</option>
                <option value="Hard">Hard (30 points per question)</option>
              </select>
            </div>
          </div>

          {/* Time Limit + Public */}
          <div className="form-row">
            <div className="form-group half">
              <label htmlFor="timeLimit">Time Limit (Optional)</label>
              <div className="time-input">
                <input
                  id="timeLimit"
                  type="number"
                  className="form-input"
                  min={1}
                  max={180}
                  value={timeLimit}
                  onChange={(e) => setTimeLimit(e.target.valueAsNumber || "")}
                />
                <span className="time-suffix">minutes</span>
              </div>
              <span className="form-hint">
                Leave empty for no time limit
              </span>
            </div>

            <div className="form-group half">
              <label>Publicly Visible</label>
              <div className="toggle-container">
                <label className="toggle">
                  <input
                    type="checkbox"
                    checked={isPublic}
                    onChange={(e) => setIsPublic(e.target.checked)}
                  />
                  <span className="slider"></span>
                </label>
              </div>
              <span className="form-hint">
                Allow other users to find and take your quiz
              </span>
            </div>
          </div>

          {/* Buttons */}
          <div className="button-row">
            <button type="submit" className="btn-next">
              Create Quiz
            </button>
            <button
              type="button"
              className="btn-prev"
              onClick={() => navigate("/")}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
