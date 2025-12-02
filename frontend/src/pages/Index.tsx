import { Link } from "react-router-dom";
import { useRive, useStateMachineInput } from "@rive-app/react-canvas";
import styles from "./Index.module.css";
import Button from "../components/Button";

/**
 * Landing page with interactive Rive mascot animation
 * Features animated blueberry mascot that waves when hovering over action buttons
 * Uses Rive state machine with trigger inputs for interactive animations
 */
export default function Index() {
  // Initialize Rive animation with State Machine 1
  const { RiveComponent, rive } = useRive({
    src: "/animations/quizzy.riv",
    stateMachines: "State Machine 1",
    autoplay: true, // Starts Idle Bounce animation automatically
  });

  // Get wave input triggers from state machine
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

  /** Trigger left wave animation (Wave Blueberry_L) */
  const triggerWaveLeft = () => {
    waveLeftInput?.fire();
  };

  /** Trigger right wave animation (Wave Blueberry_R) */
  const triggerWaveRight = () => {
    waveRightInput?.fire();
  };

  return (
    <section className={styles["home-hero"]}>
      {/* Curved SVG title text - wider path for full text */}
      <svg
        className={styles["arc-title"]}
        viewBox="0 0 2000 350"
        preserveAspectRatio="xMidYMid meet"
        aria-hidden="true"
      >
        <defs>
          <path id="titlePath" d="M150,280 C600,70 1400,70 1850,280" />
        </defs>
        <text className={styles["arc-text"]}>
          <textPath href="#titlePath" startOffset="50%" textAnchor="middle">
            WELCOME TO QUIZZY POP!
          </textPath>
        </text>
      </svg>

      {/* Animated mascot with speech bubble */}
      <div className={styles["mascot-wrap"]}>
        <RiveComponent className={styles.mascot} />
        <div className={styles.speech}>Let's play and learn together!</div>
      </div>

      {/* Call-to-action buttons that trigger wave animations on hover */}
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
