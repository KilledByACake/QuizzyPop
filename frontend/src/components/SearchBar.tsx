import styles from './SearchBar.module.css';

interface SearchBarProps {
  // Current search input value
  value: string;
  // Callback fired when search input changes
  onChange: (value: string) => void;
  // Placeholder text displayed when input is empty
  placeholder?: string;
}

/**
 * Search input component with magnifying glass icon
 * Used on quiz browse page for filtering quizzes by title
 */
export default function SearchBar({ 
  value, 
  onChange, 
  placeholder = 'Search quizzes...' 
}: SearchBarProps) {
  return (
    <div className={styles.wrapper}>
      <input
        type="text"
        className={styles.input}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
      />
      <span className={styles.icon}>🔍</span>
    </div>
  );
}