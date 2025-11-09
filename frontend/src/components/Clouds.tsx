
import styles from './Clouds.module.css';

export default function Clouds() {
  return (
    <div className={styles.clouds} aria-hidden="true">
      <div className={styles.cloud} />
      <div className={styles.cloud} />
      <div className={styles.cloud} />
      <div className={styles.cloud} />
      <div className={styles.cloud} />
      <div className={styles.cloud} />
      <div className={styles.cloud} />
      <div className={styles.cloud} />
    </div>
  );
}