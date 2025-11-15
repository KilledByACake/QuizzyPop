import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import styles from "./NavBar.module.css";

export default function NavBar() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [token, setToken] = useState(localStorage.getItem("token"));

  const isActive = (path: string) =>
    pathname === path ? styles.active : "";

  function logout() {
    localStorage.removeItem("token");
    setToken(null);
    navigate("/login");
  }

  return (
    <header className={styles.navbar}>
      <div className={styles.navbarInner}>
        <Link to="/" className={styles.navbarBrand}>
          <img
            src="/images/quizzy-no-arms.png"
            alt="Blueberry mascot logo"
            className={styles.navbarBrandImg}
          />
          <span className={styles.brandText}>QuizzyPop</span>
        </Link>

        <nav className={styles.navbarNav} aria-label="Main navigation">
          <Link to="/" className={isActive("/")}>Home</Link>
          <Link to="/quizzes" className={isActive("/quizzes")}>Take Quiz</Link>
          <Link to="/create" className={isActive("/create")}>Make Quiz</Link>
        </nav>

        <div className={styles.navbarActions}>
          {token ? (
            <>
              <Link to="/mypage" className={styles.btnOutlineGreen}>Account</Link>
              <button onClick={logout} className={styles.btnOutlineGreen}>
                Log Out
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className={styles.btnOutlineGreen}>Log In</Link>
              <Link to="/register" className={styles.btnOutlineGreen}>Sign Up</Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
