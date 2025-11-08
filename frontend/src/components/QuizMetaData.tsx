import { ChangeEvent } from "react";

export type QuizMetaDataProps = {
  title: string;
  description: string;
  category: string;
  difficulty: string;
  timeLimit: number;
  isPublic: boolean;
  onChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
};

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

      <div className="form-row-2">
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
