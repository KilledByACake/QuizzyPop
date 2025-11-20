import { useParams, useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import Mascot from '../components/Mascot';
import styles from './PublishedQuiz.module.css';

export default function PublishedQuiz() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  return (
    <div className={styles.publishedPage}>
      <div className={styles.container}>
        <Mascot variant="celebrate" size="large" />
        <h1 className={styles.title}>🎉 Quiz Published!</h1>
        <p className={styles.subtitle}>
          Your quiz is now live and ready for players!
        </p>

        <div className={styles.actions}>
          <Button
            variant="primary"
            onClick={() => navigate(`/quiz/${id}/take`)}
          >
            Take Quiz Now
          </Button>

          <Button
            variant="secondary"
            onClick={() => navigate('/quizzes')}
          >
            Browse All Quizzes
          </Button>

          <Button
            variant="outline"
            onClick={() => navigate('/create')}
          >
            Create Another Quiz
          </Button>
        </div>

        <div className={styles.shareBox}>
          <p className={styles.shareLabel}>Share with friends:</p>
          <code className={styles.shareLink}>
            {window.location.origin}/quiz/{id}/take
          </code>
        </div>
      </div>
    </div>
  );
}