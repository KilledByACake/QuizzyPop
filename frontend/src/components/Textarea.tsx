import { type TextareaHTMLAttributes, forwardRef } from 'react';
import styles from './Textarea.module.css';

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  /** Optional label text displayed above textarea */
  label?: string;
  /** Error message to display - also applies error styling */
  error?: string;
  /** Helper text displayed below textarea when no error */
  hint?: string;
}

/**
 * Multi-line text input component with label, validation error display, and hints
 * Supports ref forwarding for React Hook Form integration
 * Used for quiz descriptions, question text, and other longer text inputs
 */
const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, hint, className = '', ...props }, ref) => {
    const textareaClasses = [
      styles.textarea,
      error ? styles.error : '',
      className
    ].filter(Boolean).join(' ');

    return (
      <div className={styles.group}>
        {/* Label with required indicator */}
        {label && (
          <label className={styles.label} htmlFor={props.id}>
            {label}
            {props.required && <span className={styles.required}>*</span>}
          </label>
        )}
        
        {/* Textarea field */}
        <textarea
          ref={ref}
          className={textareaClasses}
          {...props}
        />
        
        {/* Helper text shown when no error */}
        {hint && !error && (
          <span className={styles.hint}>{hint}</span>
        )}
        
        {/* Error message replaces hint when present */}
        {error && (
          <span className={styles.errorText}>{error}</span>
        )}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';

export default Textarea;