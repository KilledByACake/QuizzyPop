// frontend/src/components/Select.tsx
import { type SelectHTMLAttributes, forwardRef } from 'react';
import styles from './Select.module.css';

interface SelectOption {
  value: string | number;
  label: string;
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  hint?: string;
  options: SelectOption[];
  placeholder?: string;
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, hint, options, placeholder, className = '', ...props }, ref) => {
    const selectClasses = [
      styles.select,
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
        
        <select
          ref={ref}
          className={selectClasses}
          {...props}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        
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

Select.displayName = 'Select';

export default Select;