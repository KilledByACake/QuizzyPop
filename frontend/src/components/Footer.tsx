import { Link } from "react-router-dom";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="site-footer">
      <div className="footer-content">
        <div className="footer-brand">
          <img
            src="/images/quizzy-no-arms.png"
            alt="Quizzy Pop logo"
            className="footer-logo"
          />
          <span className="footer-title">Quizzy Pop</span>
        </div>

        <nav className="footer-nav">
          <Link to="/">Home</Link>
          <Link to="/quizzes">Quizzes</Link>
          <Link to="/admin/quizzes/new">Create Quiz</Link>
          <Link to="/about">About</Link>
        </nav>

        <div className="footer-copy">
          <span>
            Created with <b>.NET</b>
          </span>{" "}
          — &copy; {year} Quizzy Pop. All rights reserved.
        </div>
      </div>
      <div className="footer-confetti"></div>
    </footer>
  );
}
