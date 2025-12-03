import { useState, useRef, useCallback } from 'react';
import type { KeyboardEvent, ChangeEvent } from 'react';
import styles from './TagInput.module.css';

interface TagInputProps {
  // Label text displayed above the input 
  label?: string;
  // Array of current tags 
  value: string[];
  // Callback fired when tags array changes 
  onChange: (tags: string[]) => void;
  // Error message to display 
  error?: string;
  // Maximum number of tags allowed
  maxTags?: number;
  // Placeholder text for the input field
  placeholder?: string;
  // Helper text displayed below label 
  hint?: string;
}

/**
 * Tag input component for adding/removing multiple text tags
 * Supports Enter and comma key to add tags, Backspace to remove last tag
 * Note: Tag system not yet implemented in backend - prepared for future feature
 */
export default function TagInput({
  label = 'Tags',
  value,
  onChange,
  error,
  maxTags = 8,
  placeholder = 'Type tag and press Enter…',
  hint
}: TagInputProps) {
  const [input, setInput] = useState('');
  const inputRef = useRef<HTMLInputElement | null>(null);

  // Add a new tag if valid (not empty, not duplicate, under max limit) 
  const addTag = useCallback((raw: string) => {
    const tag = raw.trim();
    if (!tag) return;
    if (value.includes(tag)) return;
    if (value.length >= maxTags) return;
    onChange([...value, tag]);
    setInput('');
  }, [value, onChange, maxTags]);

  // Remove a specific tag from the array 
  const removeTag = (tag: string) => {
    onChange(value.filter(t => t !== tag));
  };

  // Handle keyboard shortcuts: Enter/comma to add, Backspace to remove last 
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTag(input);
    } else if (e.key === 'Backspace' && !input && value.length) {
      // Quick remove last tag when input is empty
      removeTag(value[value.length - 1]);
    } else if (e.key === ',' ) {
      e.preventDefault();
      addTag(input);
    }
  };

  // Add tag on blur if input has content 
  const handleBlur = () => {
    if (input) addTag(input);
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  return (
    <div className={styles.wrapper}>
      {label && <label className={styles.label}>{label}</label>}
      {hint && <p className={styles.hint}>{hint}</p>}
      
      {/* Tags container with inline input */}
      <div
        className={`${styles.container} ${error ? styles.containerError : ''}`}
        role="list"
        aria-label="Quiz tags"
      >
        {/* Render existing tags with remove buttons */}
        {value.map(tag => (
          <span key={tag} className={styles.tag} role="listitem">
            <span className={styles.tagText}>{tag}</span>
            <button
              type="button"
              className={styles.removeBtn}
              onClick={() => removeTag(tag)}
              aria-label={`Remove tag ${tag}`}
            >
              ×
            </button>
          </span>
        ))}
        
        {/* Input field - only shown if under max limit */}
        {value.length < maxTags && (
          <input
            ref={inputRef}
            className={styles.input}
            value={input}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            onBlur={handleBlur}
            placeholder={placeholder}
            aria-label="Add tag"
          />
        )}
      </div>
      
      {/* Tag count and error message row */}
      <div className={styles.metaRow}>
        <span className={styles.count}>{value.length}/{maxTags} tags</span>
        {error && <span className={styles.error}>{error}</span>}
      </div>
    </div>
  );
}