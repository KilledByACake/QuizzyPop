// frontend/src/components/Input.tsx
import { type InputHTMLAttributes, forwardRef } from 'react';
import styles from './Input.module.css';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, className = '', ...props }, ref) => {
    const inputClasses = [
      styles.input,
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
        
        <input
          ref={ref}
          className={inputClasses}
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

Input.displayName = 'Input';

export default Input;