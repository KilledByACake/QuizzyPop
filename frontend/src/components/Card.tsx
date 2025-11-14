import type { ReactNode } from 'react';
import styles from './Card.module.css';

interface CardProps {
  children: ReactNode;
  variant?: 'default' | 'elevated' | 'outlined';
  className?: string;
  onClick?: () => void;
}

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