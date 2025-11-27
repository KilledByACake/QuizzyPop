import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import styles from "./NavBar.module.css";

export default function NavBar() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [token, setToken] = useState<string | null>(localStorage.getItem("token"));

  const isActive = (path: string) => pathname === path;

  function logout() {
    localStorage.removeItem("token");
    setToken(null);
    navigate("/login");
  }

  return (
    <header className={styles.navbar} role="banner">
      {/* Skip link for keyboard users */}
      <a href="#main-content" className={styles.skipLink}>
        Skip to main content
      </a>

      <div className={styles.navbarInner}>
        <Link
          to="/"
          className={styles.navbarBrand}
          aria-label="Go to QuizzyPop home page"
        >
          <img
            src="/images/quizzy-no-arms.png"
            alt="Blueberry mascot logo"
            className={styles.navbarBrandImg}
          />
          <span className={styles.brandText}>QuizzyPop</span>
        </Link>

        <nav className={styles.navbarNav} aria-label="Main navigation">
          <Link
            to="/"
            className={isActive("/") ? styles.active : undefined}
            aria-current={isActive("/") ? "page" : undefined}
          >
            Home
          </Link>
          <Link
            to="/quizzes"
            className={isActive("/quizzes") ? styles.active : undefined}
            aria-current={isActive("/quizzes") ? "page" : undefined}
          >
            Take Quiz
          </Link>
          <Link
            to="/create"
            className={isActive("/create") ? styles.active : undefined}
            aria-current={isActive("/create") ? "page" : undefined}
          >
            Make Quiz
          </Link>
        </nav>

        <div className={styles.navbarActions}>
          {token ? (
            <>
              <Link to="/mypage" className={styles.btnOutlineGreen}>
                Account
              </Link>
              <button
                type="button"
                onClick={logout}
                className={styles.btnOutlineGreen}
                aria-label="Log out of your account"
              >
                Log Out
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className={styles.btnOutlineGreen}>
                Log In
              </Link>
              <Link to="/register" className={styles.btnOutlineGreen}>
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
