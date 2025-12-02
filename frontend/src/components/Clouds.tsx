import styles from './Clouds.module.css';

/**
 * Decorative animated clouds background component
 * Adds playful visual atmosphere to pages - marked as aria-hidden since purely decorative
 */
export default function Clouds() {
  return (
    <div className={styles.clouds} aria-hidden="true">
      {/* Multiple cloud divs animated via CSS for parallax effect */}
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