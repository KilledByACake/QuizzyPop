import { Link } from "react-router-dom";
import styles from "./Index.module.css";
import Button from "../components/Button";

export default function Index() {
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
          {/* Justert kurve for å være sentrert */}
          <path id="titlePath" d="M50,220 C270,40 630,40 850,220" />
        </defs>
        <text className={styles["arc-text"]} style={{ fontSize: "2.2rem" }}>
          <textPath href="#titlePath" startOffset="50%" textAnchor="middle">
            WELCOME TO QUIZZY POP!
          </textPath>
        </text>
      </svg>

      {/* Knapper og maskot */}
    
      <div className={styles["cta-row"]}>
        <Link to="/takequiz">
          <Button variant="primary">Take Quiz!</Button>
        </Link>

        <div className={styles["mascot-wrap"]}>
          <img
            src="/images/quizzy-blueberry.png"
            alt="Quizzy Pop mascot"
            className={styles.mascot}
          />
          <div className={styles.speech}>Let's play and learn together!</div>
        </div>

        <Link to="/createquiz">
          <Button variant="secondary">Make Quiz!</Button>
        </Link>
      </div>
    </section>
  );
}
