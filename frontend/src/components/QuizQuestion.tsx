import type { ChangeEvent } from "react";

export type QuizQuestionProps = {
  // Question index in the list
  index: number;
  // Question text/prompt 
  text: string;
  // Optional image file attached to question 
  image?: File | null;
  // Array of answer options 
  options: string[];
  // Point value for this question 
  points: number;
  // Time limit for answering (string format)
  timeLimit: string;
  // Explanation shown after answering
  explanation: string;
  // Whether to randomize answer order
  shuffleAnswers: boolean;
  // Whether question must be answered
  required: boolean;
  // Handler for text/number/checkbox input changes
  onChange: (
    e: ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
    index: number
  ) => void;
  // Handler for updating a specific answer option
  onOptionChange: (index: number, optIndex: number, value: string) => void;
  // Handler for adding a new answer option
  onAddOption: (index: number) => void;
  // Handler for removing this question
  onRemove: (index: number) => void;
  // Handler for moving question up in the list
  onMoveUp: (index: number) => void;
  // Handler for moving question down in the list
  onMoveDown: (index: number) => void;
};

/**
 * Individual question editor component for quiz creation
 * Provides controls for question text, image, multiple options, points, time limit, and settings
 * Note: This appears to be legacy/unused - AddQuestions.tsx uses a different structure
 */
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
      {/* Question header with reorder/delete controls */}
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

      {/* Question text input */}
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

      {/* Image upload with preview */}
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
            {image ? image.name : "Upload image"}
          </label>
        </div>
        {image && (
          <div className="image-preview">
            <img 
              src={URL.createObjectURL(image)} 
              alt="Question preview" 
              style={{ maxWidth: "200px", maxHeight: "150px", marginTop: "10px" }}
            />
          </div>
        )}
      </div>

      {/* Answer options list */}
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

      {/* Add option button */}
      <div className="form-row">
        <button
          type="button"
          className="link-btn"
          onClick={() => onAddOption(index)}
        >
          Add Option
        </button>
      </div>

      {/* Points and time limit */}
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

      {/* Answer explanation textarea */}
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

      {/* Toggle switches for shuffle and required */}
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
