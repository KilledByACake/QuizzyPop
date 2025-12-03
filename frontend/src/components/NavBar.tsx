import { Link, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import styles from "./NavBar.module.css";

/**
 * Site-wide navigation bar with responsive hamburger menu
 * Shows different actions based on authentication state (Login/SignUp vs Account/Logout)
 * Hides on landing page (controlled by Layout component)
 */
export default function NavBar() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [token, setToken] = useState<string | null>(
    localStorage.getItem("token"),
  );
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Check if given path matches current route for active link styling
  const isActive = (path: string) => pathname === path;

  // Clear token and redirect to login page 
  function logout() {
    localStorage.removeItem("token");
    setToken(null);
    navigate("/login");
  }

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  return (
    <header className={styles.navbar} role="banner">
      {/* Accessibility: skip to main content link for keyboard navigation */}
      <a href="#main-content" className={styles.skipLink}>
        Skip to main content
      </a>

      <div className={styles.navbarInner}>
        {/* Brand logo and name */}
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

        {/* Hamburger menu button - visible only on mobile */}
        <button
          type="button"
          className={styles.menuToggle}
          aria-label={isMenuOpen ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={isMenuOpen}
          aria-controls="main-nav"
          onClick={() => setIsMenuOpen((open) => !open)}
        >
          <span className={styles.menuBar} />
          <span className={styles.menuBar} />
          <span className={styles.menuBar} />
        </button>

        {/* Main navigation links - collapses into hamburger menu on mobile */}
        <nav
          id="main-nav"
          className={`${styles.navbarNav} ${
            isMenuOpen ? styles.navbarNavOpen : ""
          }`}
          aria-label="Main navigation"
        >
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

        {/* Authentication actions - shows different buttons based on login state */}
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
