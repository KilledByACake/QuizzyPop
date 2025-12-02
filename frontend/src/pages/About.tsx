import { useEffect } from "react";
import styles from "./About.module.css";

/**
 * About page component
 * Explains QuizzyPop's mission, target audience, values, and educational benefits
 * Designed as a marketing/informational page for new users and parents/teachers
 */
export default function About() {
  // Set page title on mount
  useEffect(() => {
    document.title = "About QuizzyPop";
  }, []);

  return (
    <section className={`${styles["qp-page"]} ${styles["about-page"]}`}>
      <div className={styles["about-container"]}>
        {/* Header with mascot and tagline */}
        <header className={styles["about-header"]}>
          <img
            src="/images/quizzy-blueberry.png"
            alt="Quizzy Pop mascot"
            className={styles.mascot}
          />
          <h1>About Quizzy Pop</h1>
          <p className={styles.subtitle}>
            This is a web application project for children to learn how to create and take quizzes.
          </p>
        </header>

        {/* Mission statement - educational benefits */}
        <section className={styles.mission}>
          <h2>Making Learning Fun and Playful</h2>
          <p>
            Research has shown that taking quizzes is an effective way for children to learn,
            as it engages their memory and critical thinking. Equally important, creating quizzes themselves
            strengthens learning even more,
            since it requires children to process information and reformulate it into questions and answers.
          </p>
        </section>

        {/* Target audience explanation */}
        <section className={styles.audience}>
          <h2>Who is Quizzy Pop for?</h2>
          <div className={styles["audience-list"]}>
            {/* Primary audience: children */}
            <div className={styles["audience-item"]}>
              <div className={styles["audience-content"]}>
                <h3>Mainly for Children 👶</h3>
                <p>
                  Our primary target audience is children from around 8 years old and up.
                  At this age, they generally have developed the writing skills necessary to create their own
                  quizzes.
                  The application is designed to be simple, colorful, and engaging, making it accessible and
                  enjoyable for younger users while still being useful for older children.
                </p>
              </div>
            </div>
            {/* Secondary audience: parents and teachers */}
            <div className={styles["audience-item"]}>
              <div className={styles["audience-content"]}>
                <h3>Parents & Teachers as Secondary Audiences 🌸</h3>
                <p>
                  A secondary audience includes teachers and parents, who can encourage children to use the
                  app as a learning tool in both classroom and home settings.
                  By integrating fun visuals, intuitive navigation, and easy sharing of quizzes, the app
                  supports collaborative learning and sustains motivation.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Device accessibility section */}
        <section className={styles.devices}>
          <h2>Be present where the children are 🚀</h2>
          <div className={styles["value-cards"]}>
            <div className={styles.card}>
              <h3>🎨 Creativity</h3>
              <p>
                Since children increasingly use tablets, laptops, and mobile devices for learning, the app is
                designed with accessibility in mind to ensure that all children, regardless of learning style,
                can benefit from it.
              </p>
            </div>
          </div>
        </section>

        {/* Core values section */}
        <section className={styles.values}>
          <h2>Our Values</h2>
          <div className={styles["value-cards"]}>
            <div className={styles.card}>
              <h3>🎨 Creativity</h3>
              <p>We inspire imagination through fun quiz creation.</p>
            </div>
            <div className={styles.card}>
              <h3>🧠 Curiosity</h3>
              <p>Every quiz helps kids discover something new.</p>
            </div>
            <div className={styles.card}>
              <h3>💫 Confidence</h3>
              <p>Kids shine brighter as they learn and grow!</p>
            </div>
          </div>
        </section>
      </div>
    </section>
  );
}
