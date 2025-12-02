import { type SelectHTMLAttributes, forwardRef } from 'react';
import styles from './Select.module.css';

interface SelectOption {
  /** Option value submitted with form */
  value: string | number;
  /** Display text for the option */
  label: string;
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  /** Optional label text displayed above select */
  label?: string;
  /** Error message to display - also applies error styling */
  error?: string;
  /** Helper text displayed below select when no error */
  hint?: string;
  /** Array of option objects to render */
  options: SelectOption[];
  /** Placeholder text shown as disabled first option */
  placeholder?: string;
}

/**
 * Form select dropdown component with label, validation error display, and hints
 * Supports ref forwarding for React Hook Form integration
 * Used for category, difficulty, and other dropdown selections in forms
 */
const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, hint, options, placeholder, className = '', ...props }, ref) => {
    const selectClasses = [
      styles.select,
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
        
        {/* Select dropdown */}
        <select
          ref={ref}
          className={selectClasses}
          {...props}
        >
          {/* Optional placeholder as disabled first option */}
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {/* Render all options */}
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        
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

Select.displayName = 'Select';

export default Select;