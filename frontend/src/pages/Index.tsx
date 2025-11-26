import { Link } from "react-router-dom";
import { useRive, useStateMachineInput } from "@rive-app/react-canvas";
import { useState } from "react";
import styles from "./Index.module.css";
import Button from "../components/Button";

export default function Index() {
  const [currentState, setCurrentState] = useState("Idle");

  const { RiveComponent, rive } = useRive({
    src: "/animations/quizzy.riv",
    stateMachines: "State Machine 1",
    autoplay: true,
  });

  const waveLeftInput = useStateMachineInput(
    rive,
    "State Machine 1",
    "Wave L"
  );
  const waveRightInput = useStateMachineInput(
    rive,
    "State Machine 1",
    "Wave R"
  );

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
      {/* Arc title */}
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
        <text className={styles["arc-text"]}>
          <textPath href="#titlePath" startOffset="50%" textAnchor="middle">
            WELCOME TO QUIZZY POP!
          </textPath>
        </text>
      </svg>

      {/* Mascot + speech bubble, centered under the title */}
      <div className={styles["mascot-wrap"]}>
        <RiveComponent className={styles.mascot} />
        <div className={styles.speech}>Let's play and learn together!</div>
      </div>

      {/* Buttons in their own row so they don't overlap the mascot */}
      <div className={styles["cta-row"]}>
        <Link to="/quizzes" onMouseEnter={triggerWaveLeft}>
          <Button variant="primary" size="xl">
            Take Quiz!
          </Button>
        </Link>

        <Link to="/create" onMouseEnter={triggerWaveRight}>
          <Button variant="primary" size="xl">
            Make Quiz!
          </Button>
        </Link>
      </div>
    </section>
  );
}
