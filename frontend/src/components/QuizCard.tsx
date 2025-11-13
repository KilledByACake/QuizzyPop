import styles from './QuizCard.module.css';
import Button from './Button';

interface QuizCardProps {
  id: number;
  title: string;
  imageUrl?: string;
  difficulty: 'easy' | 'medium' | 'hard';
  questionCount: number;
  onTakeQuiz: () => void;
}

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
      <div className={styles.thumb}>
        <img 
          src={imageUrl || defaultImage} 
          alt={title}
          onError={(e) => {
            e.currentTarget.src = defaultImage;
          }}
        />
      </div>
      <h3 className={styles.title}>{title}</h3>
      <p className={styles.meta}>Difficulty: {difficulty}</p>
      <p className={styles.meta}>{questionCount} Questions</p>
      <Button variant="primary" onClick={onTakeQuiz} fullWidth>
        Take quiz
      </Button>
    </article>
  );
}