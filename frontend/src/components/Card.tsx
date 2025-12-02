import type { ReactNode } from 'react';
import styles from './Card.module.css';

interface CardProps {
  children: ReactNode;
  /** Card styling variant - default, elevated (with shadow), or outlined (with border) */
  variant?: 'default' | 'elevated' | 'outlined';
  /** Additional CSS classes */
  className?: string;
  /** Optional click handler - makes card interactive */
  onClick?: () => void;
}

/**
 * Generic card container component for grouping related content
 * Used as a base for QuizCard and other content containers
 */
export default function Card({ 
  children, 
  variant = 'default', 
  className = '',
  onClick 
}: CardProps) {
  return (
    <div 
      className={`${styles.card} ${styles[variant]} ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
}