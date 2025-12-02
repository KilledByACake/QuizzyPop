import { Link } from "react-router-dom";
import styles from "./Footer.module.css";

/**
 * Site-wide footer component with branding, navigation links, and copyright
 * Displayed at the bottom of all pages via Layout wrapper
 */
export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className={styles.siteFooter}>
      <div className={styles.footerContent}>
        {/* Logo and brand name */}
        <div className={styles.footerBrand}>
            <img
              src="/images/quizzy-nav.png"
              alt="Quizzy Pop logo"
              className={styles.footerLogo}
            />
            <span className={styles.footerTitle}>Quizzy Pop</span>
        </div>

        {/* Main navigation links */}
        <nav className={styles.footerNav}>
          <Link to="/">Home</Link>
          <Link to="/quizzes">Quizzes</Link>
          <Link to="/admin/quizzes/new">Create Quiz</Link>
          <Link to="/about">About</Link>
        </nav>

        {/* Copyright notice with current year */}
        <div className={styles.footerCopy}>
          Created with <b>.NET</b> — &copy; {year} Quizzy Pop. All rights reserved.
        </div>
      </div>
      {/* Decorative confetti element */}
      <div className={styles.footerConfetti}></div>
    </footer>
  );
}
