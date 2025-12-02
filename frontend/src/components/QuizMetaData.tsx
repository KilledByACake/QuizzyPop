import { type ChangeEvent } from "react";

/**
 * Quiz metadata form component for editing quiz details
 * Contains fields for title, description, category, difficulty, time limit, and visibility
 * Note: This component appears to be legacy/unused - CreateQuiz.tsx uses a different form structure
 */
export default function QuizMetaData({
  title,
  description,
  category,
  difficulty,
  timeLimit,
  isPublic,
  onChange,
}: QuizMetaDataProps) {
  return (
    <div className="card">
      <div className="card-title">Quiz Details</div>

      {/* Title input */}
      <div className="form-row">
        <label htmlFor="Title">Quiz Title:</label>
        <input
          id="Title"
          name="title"
          type="text"
          className="i-text"
          value={title}
          onChange={onChange}
        />
      </div>

      {/* Description textarea */}
      <div className="form-row">
        <label htmlFor="Description">Description</label>
        <textarea
          id="Description"
          name="description"
          rows={2}
          className="i-text"
          value={description}
          onChange={onChange}
        />
      </div>

      {/* Category, Difficulty, Time Limit, and Public toggle row */}
      <div className="form-row-2">
        {/* Category input */}
        <div style={{ display: "flex", flexDirection: "column" }}>
          <label htmlFor="Category">Category</label>
          <input
            id="Category"
            name="category"
            type="text"
            className="i-text"
            value={category}
            onChange={onChange}
          />
        </div>

        {/* Difficulty dropdown */}
        <div style={{ display: "flex", flexDirection: "column" }}>
          <label htmlFor="Difficulty">Difficulty</label>
          <select
            id="Difficulty"
            name="difficulty"
            className="i-text"
            value={difficulty}
            onChange={onChange}
          >
            <option value="">Select</option>
            <option value="Easy">Easy</option>
            <option value="Medium">Medium</option>
            <option value="Hard">Hard</option>
          </select>
        </div>

        {/* Time limit and public visibility toggle */}
        <div style={{ display: "flex", flexDirection: "row", alignItems: "flex-end", gap: "1rem" }}>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <label htmlFor="TimeLimit">Time Limit</label>
            <input
              id="TimeLimit"
              name="timeLimit"
              type="number"
              className="i-text i-small"
              value={timeLimit}
              onChange={onChange}
            />
          </div>

          {/* Public/private toggle switch */}
          <label className="switch" style={{ marginBottom: "0.3rem" }}>
            <input
              type="checkbox"
              name="isPublic"
              checked={isPublic}
              onChange={onChange}
            />
            <span className="slider"></span>
            <span className="switch-text">Publicly Visible</span>
          </label>
        </div>
      </div>
    </div>
  );
}

export type QuizMetaDataProps = {
  /** Quiz title value */
  title: string;
  /** Quiz description value */
  description: string;
  /** Quiz category value */
  category: string;
  /** Difficulty level (Easy/Medium/Hard) */
  difficulty: string;
  /** Time limit in minutes */
  timeLimit: number;
  /** Whether quiz is publicly visible */
  isPublic: boolean;
  /** Handler for all form input changes */
  onChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
};
