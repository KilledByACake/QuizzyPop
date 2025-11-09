import { Link } from "react-router-dom";
import "./HomeIndex.css";

export default function HomeIndex() {
  return (
    <section className="home-hero">
      {/* Curved title */}
      <svg className="arc-title" viewBox="0 0 900 280" aria-hidden="true" width="900" height="280">
        <defs>
          <path id="titlePath" d="M50,220 C270,40 630,40 850,220" />
        </defs>
        <text className="arc-text">
          <textPath href="#titlePath" startOffset="50%" textAnchor="middle">
            WELCOME TO QUIZZY POP!
          </textPath>
        </text>
      </svg>

      {/* Buttons and mascot */}
      <div className="cta-row">
        <Link to="/quizzes" className="btn-cta">Take Quiz!</Link>

        <div className="mascot-wrap">
          <img
            src="/images/quizzy-blueberry.png"
            alt="Quizzy Pop mascot"
            className="mascot"
          />
          <div className="speech">Let's play and learn together!</div>
        </div>

        <Link to="/admin/quizzes/new" className="btn-cta">Make Quiz!</Link>
      </div>
    </section>
  );
}
