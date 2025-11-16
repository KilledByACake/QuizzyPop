import { useState, useRef, useCallback } from 'react';
import type { KeyboardEvent, ChangeEvent } from 'react';
import styles from './TagInput.module.css';

interface TagInputProps {
  label?: string;
  value: string[];
  onChange: (tags: string[]) => void;
  error?: string;
  maxTags?: number;
  placeholder?: string;
  hint?: string;
}

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

  const addTag = useCallback((raw: string) => {
    const tag = raw.trim();
    if (!tag) return;
    if (value.includes(tag)) return;
    if (value.length >= maxTags) return;
    onChange([...value, tag]);
    setInput('');
  }, [value, onChange, maxTags]);

  const removeTag = (tag: string) => {
    onChange(value.filter(t => t !== tag));
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTag(input);
    } else if (e.key === 'Backspace' && !input && value.length) {
      // Quick remove last tag
      removeTag(value[value.length - 1]);
    } else if (e.key === ',' ) {
      e.preventDefault();
      addTag(input);
    }
  };

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
      <div
        className={`${styles.container} ${error ? styles.containerError : ''}`}
        role="list"
        aria-label="Quiz tags"
      >
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
      <div className={styles.metaRow}>
        <span className={styles.count}>{value.length}/{maxTags} tags</span>
        {error && <span className={styles.error}>{error}</span>}
      </div>
    </div>
  );
}