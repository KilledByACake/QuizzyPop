import styles from './Loader.module.css';

interface LoaderProps {
  /** Spinner size - small, medium, or large */
  size?: 'small' | 'medium' | 'large';
  /** Optional loading message displayed below spinner */
  text?: string;
}

/**
 * Loading spinner component with optional text
 * Displayed during async operations like fetching quizzes or submitting forms
 */
export default function Loader({ size = 'medium', text }: LoaderProps) {
  return (
    <div className={styles.loaderContainer}>
      <div className={`${styles.spinner} ${styles[size]}`} />
      {text && <p className={styles.text}>{text}</p>}
    </div>
  );
}