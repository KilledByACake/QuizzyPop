import styles from './QuizCard.module.css';
import Button from './Button';

interface QuizCardProps {
  // Quiz ID for routing/tracking
  id: number;
  // Quiz title displayed prominently
  title: string;
  // Optional cover image URL - falls back to default if missing or fails to load
  imageUrl?: string;
  // Difficulty level badge
  difficulty: 'easy' | 'medium' | 'hard';
  // Number of questions in the quiz
  questionCount: number;
  // Callback fired when user clicks "Take quiz" button
  onTakeQuiz: () => void;
}

/**
 * Quiz card component displaying quiz preview with thumbnail, metadata, and action button
 * Used on the browse/discover page to show available quizzes in a grid
 */
export default function QuizCard({
  title,
  imageUrl,
  difficulty,
  questionCount,
  onTakeQuiz
}: QuizCardProps) {
  const defaultImage = '/images/default-cover.png';

  return (
    <article className={styles.card}>
      {/* Quiz cover image with error fallback */}
      <div className={styles.thumb}>
        <img 
          src={imageUrl || defaultImage} 
          alt={title}
          onError={(e) => {
            e.currentTarget.src = defaultImage;
          }}
        />
      </div>
      
      {/* Quiz metadata */}
      <h3 className={styles.title}>{title}</h3>
      <p className={styles.meta}>Difficulty: {difficulty}</p>
      <p className={styles.meta}>{questionCount} Questions</p>
      
      {/* Primary action button */}
      <Button variant="primary" onClick={onTakeQuiz} fullWidth>
        Take quiz
      </Button>
    </article>
  );
}