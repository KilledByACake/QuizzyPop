
import styles from './StatCard.module.css';

interface StatCardProps {
  number: number | string;
  label: string;
  variant?: 'primary' | 'secondary';
}

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