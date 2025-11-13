
import styles from './Mascot.module.css';

interface MascotProps {
  variant?: 'blueberry' | 'celebrate' | 'no-arms' | 'default';
  size?: 'small' | 'medium' | 'large';
  alt?: string;
}

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
        e.currentTarget.src = '/images/quizzy-blueberry.png';
      }}
    />
  );
}