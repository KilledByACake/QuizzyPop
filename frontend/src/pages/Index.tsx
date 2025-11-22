import { Link } from "react-router-dom";
import { useRive } from '@rive-app/react-canvas';
import styles from "./Index.module.css";
import Button from "../components/Button";

export default function Index() {
  // Initialize Rive animation
  const { RiveComponent } = useRive({
    src: '/animations/quizzyblueberry.riv', 
    stateMachines: 'State Machine 1', // Optional: use your state machine name
    autoplay: true,
  });

  return (
    <section className={styles["home-hero"]}>
      {/* Dekorativ buet tittel */}
      <svg
        className={styles["arc-title"]}
        viewBox="0 0 900 280"
        aria-hidden="true"
        width="900"
        height="280"
      >
        <defs>
          <path id="titlePath" d="M50,220 C270,40 630,40 850,220" />
        </defs>
        <text className={styles["arc-text"]} style={{ fontSize: "2.2rem" }}>
          <textPath href="#titlePath" startOffset="50%" textAnchor="middle">
            WELCOME TO QUIZZY POP!
          </textPath>
        </text>
      </svg>

      {/* Knapper og Rive animation */}
      <div className={styles["cta-row"]}>
        <Link to="/quizzes">
          <Button variant="primary" size="xl">Take Quiz!</Button>
        </Link>

        <div className={styles["mascot-wrap"]}>
          {/* Replace img with RiveComponent */}
          <RiveComponent className={styles.mascot} />
          <div className={styles.speech}>Let's play and learn together!</div>
        </div>

        <Link to="/create">
          <Button variant="primary" size="xl">Make Quiz!</Button>
        </Link>
      </div>
    </section>
  );
}
