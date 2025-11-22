import { Link } from "react-router-dom";
import { useRive, useStateMachineInput } from '@rive-app/react-canvas';
import { useState } from 'react';
import styles from "./Index.module.css";
import Button from "../components/Button";

export default function Index() {
  const [currentState, setCurrentState] = useState("Idle");

  const { RiveComponent, rive } = useRive({
    src: '/animations/quizzy.riv',
    stateMachines: 'State Machine 1',
    autoplay: true,
  });

  // Get inputs from state machine
  const waveLeftInput = useStateMachineInput(rive, 'State Machine 1', 'Wave L');
  const waveRightInput = useStateMachineInput(rive, 'State Machine 1', 'Wave R');

  const triggerWaveLeft = () => {
    waveLeftInput?.fire();
    setCurrentState("Wave Left");
    setTimeout(() => setCurrentState("Idle"), 2000);
  };

  const triggerWaveRight = () => {
    waveRightInput?.fire();
    setCurrentState("Wave Right");
    setTimeout(() => setCurrentState("Idle"), 2000);
  };

  return (
    <section className={styles["home-hero"]}>
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

      <div className={styles["cta-row"]}>
        <Link to="/quizzes" onMouseEnter={triggerWaveLeft}>
          <Button variant="primary" size="xl">Take Quiz!</Button>
        </Link>

        <div className={styles["mascot-wrap"]}>
          <RiveComponent className={styles.mascot} />
          <div className={styles.speech}>Let's play and learn together!</div>
        </div>

        <Link to="/create" onMouseEnter={triggerWaveRight}>
          <Button variant="primary" size="xl">Make Quiz!</Button>
        </Link>
      </div>
    </section>
  );
}
