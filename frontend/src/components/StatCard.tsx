import styles from './StatCard.module.css';

interface StatCardProps {
  // Statistic value (number or formatted string like "85%")
  number: number | string;
  // Description label for the statistic 
  label: string;
  // Color/style variant 
  variant?: 'primary' | 'secondary';
}

/**
 * Statistic display card showing a number with descriptive label
 * Used for displaying quiz results, user stats, or dashboard metrics
 */
export default function StatCard({ 
  number, 
  label, 
  variant = 'primary' 
}: StatCardProps) {
  return (
    <div className={`${styles.stat} ${styles[variant]}`}>
      <span className={styles.number}>{number}</span>
      <span className={styles.label}>{label}</span>
    </div>
  );
}