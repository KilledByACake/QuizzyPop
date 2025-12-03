// frontend/src/components/Input.tsx
import { type InputHTMLAttributes, forwardRef } from 'react';
import styles from './Input.module.css';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  // Optional label text displayed above the input
  label?: string;
  // Error message to display - also applies error styling
  error?: string;
  // Helper text displayed below input when no error
  hint?: string;
}

/**
 * Form input component with label, validation error display, and hints
 * Supports ref forwarding for React Hook Form integration
 * Used throughout forms for text, email, password, number inputs
 */
const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, className = '', ...props }, ref) => {
    const inputClasses = [
      styles.input,
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
        
        {/* Main input field */}
        <input
          ref={ref}
          className={inputClasses}
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

Input.displayName = 'Input';

export default Input;