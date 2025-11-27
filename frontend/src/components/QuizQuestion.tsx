import type { ChangeEvent } from "react";

export type QuizQuestionProps = {
  index: number;
  text: string;
  image?: File | null;
  options: string[];
  points: number;
  timeLimit: string;
  explanation: string;
  shuffleAnswers: boolean;
  required: boolean;
  onChange: (
    e: ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
    index: number
  ) => void;
  onOptionChange: (index: number, optIndex: number, value: string) => void;
  onAddOption: (index: number) => void;
  onRemove: (index: number) => void;
  onMoveUp: (index: number) => void;
  onMoveDown: (index: number) => void;
};

export default function QuizQuestion({
  index,
  text,
  image,
  options,
  points,
  timeLimit,
  explanation,
  shuffleAnswers,
  required,
  onChange,
  onOptionChange,
  onAddOption,
  onRemove,
  onMoveUp,
  onMoveDown,
}: QuizQuestionProps) {
  return (
    <div className="card question-card" data-question-index={index}>
      <div className="question-header">
        <h3>Question {index + 1}</h3>
        <div className="question-controls">
          <button
            type="button"
            className="btn btn-sm btn-outline-secondary"
            title="Move Up"
            onClick={() => onMoveUp(index)}
          >
            ↑
          </button>
          <button
            type="button"
            className="btn btn-sm btn-outline-secondary"
            title="Move Down"
            onClick={() => onMoveDown(index)}
          >
            ↓
          </button>
          <button
            type="button"
            className="btn btn-sm btn-outline-danger"
            title="Remove Question"
            onClick={() => onRemove(index)}
          >
            ✕
          </button>
        </div>
      </div>

      <div className="form-row">
        <label htmlFor={`text-${index}`}>Question Text</label>
        <input
          id={`text-${index}`}
          name="text"
          className="i-text"
          value={text}
          onChange={(e) => onChange(e, index)}
        />
      </div>

      <div className="form-row upload-row">
        <div className="upload-box" role="group" aria-label="Upload image">
          <input
            id={`image-${index}`}
            name="image"
            type="file"
            hidden
            onChange={(e) => onChange(e, index)}
          />
          <label htmlFor={`image-${index}`} className="upload-label">
            Upload image
          </label>
        </div>
      </div>

      {options.map((opt, i) => (
        <div className="form-row" key={i}>
          <label className="sr-only" htmlFor={`option-${index}-${i}`}>
            Option {i + 1}
          </label>
          <input
            id={`option-${index}-${i}`}
            value={opt}
            placeholder={`Option ${i + 1}`}
            className="i-text"
            onChange={(e) => onOptionChange(index, i, e.target.value)}
          />
        </div>
      ))}

      <div className="form-row">
        <button
          type="button"
          className="link-btn"
          onClick={() => onAddOption(index)}
        >
          Add Option
        </button>
      </div>

      <div className="form-row form-row-2">
        <div>
          <label htmlFor={`points-${index}`}>Points</label>
          <input
            id={`points-${index}`}
            name="points"
            className="i-text i-small"
            inputMode="numeric"
            value={points}
            onChange={(e) => onChange(e, index)}
          />
        </div>
        <div>
          <label htmlFor={`timelimit-${index}`}>Time limit</label>
          <input
            id={`timelimit-${index}`}
            name="timeLimit"
            className="i-text i-small"
            placeholder="None"
            value={timeLimit}
            onChange={(e) => onChange(e, index)}
          />
        </div>
      </div>

      <div className="form-row">
        <label htmlFor={`explanation-${index}`}>Answer explained:</label>
        <textarea
          id={`explanation-${index}`}
          name="explanation"
          rows={3}
          className="i-text"
          value={explanation}
          onChange={(e) => onChange(e, index)}
        />
      </div>

      <div className="toggles">
        <label className="switch">
          <input
            name="shuffleAnswers"
            type="checkbox"
            checked={shuffleAnswers}
            onChange={(e) => onChange(e, index)}
          />
          <span className="slider"></span>
          <span className="switch-text">Shuffle answers</span>
        </label>

        <label className="switch">
          <input
            name="required"
            type="checkbox"
            checked={required}
            onChange={(e) => onChange(e, index)}
          />
          <span className="slider"></span>
          <span className="switch-text">Required question</span>
        </label>
      </div>
    </div>
  );
}
