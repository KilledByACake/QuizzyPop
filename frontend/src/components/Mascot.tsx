import styles from './Mascot.module.css';

interface MascotProps {
  // Mascot image variant - different poses/expressions
  variant?: 'blueberry' | 'celebrate' | 'no-arms' | 'default';
  // Image size preset
  size?: 'small' | 'medium' | 'large';
  // Alt text for accessibility 
  alt?: string;
}

/**
 * Static mascot image component for displaying different poses
 * Used on result pages, success screens, etc. (not the animated landing page mascot)
 * Falls back to blueberry variant if requested image fails to load
 */
export default function Mascot({ 
  variant = 'blueberry', 
  size = 'medium',
  alt = 'QuizzyPop mascot'
}: MascotProps) {
  const imagePath = `/images/quizzy-${variant}.png`;

  return (
    <img 
      src={imagePath} 
      alt={alt}
      className={`${styles.mascot} ${styles[size]}`}
      onError={(e) => {
        // Fallback to default blueberry image if variant doesn't exist
        e.currentTarget.src = '/images/quizzy-blueberry.png';
      }}
    />
  );
}