
import { type TextareaHTMLAttributes, forwardRef } from 'react';
import styles from './Textarea.module.css';

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  hint?: string;
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, hint, className = '', ...props }, ref) => {
    const textareaClasses = [
      styles.textarea,
      error ? styles.error : '',
      className
    ].filter(Boolean).join(' ');

    return (
      <div className={styles.group}>
        {label && (
          <label className={styles.label} htmlFor={props.id}>
            {label}
            {props.required && <span className={styles.required}>*</span>}
          </label>
        )}
        
        <textarea
          ref={ref}
          className={textareaClasses}
          {...props}
        />
        
        {hint && !error && (
          <span className={styles.hint}>{hint}</span>
        )}
        
        {error && (
          <span className={styles.errorText}>{error}</span>
        )}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';

export default Textarea;