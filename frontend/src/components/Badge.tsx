import React from "react";
import styles from './Badge.module.css';

interface BadgeProps {
  children: React.ReactNode;
  // Visual style: default, difficulty, category, success, or danger
  variant?: 'default' | 'difficulty' | 'category' | 'success' | 'danger';
}

//Badge component for displaying labels like difficulty levels, categories, or status indicators
export default function Badge({ children, variant = 'default' }: BadgeProps) {
  return (
    <span className={`${styles.badge} ${styles[variant]}`}>
      {children}
    </span>
  );
}