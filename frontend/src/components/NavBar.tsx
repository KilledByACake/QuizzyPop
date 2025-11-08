import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";

export default function NavBar() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [token, setToken] = useState(localStorage.getItem("token"));

  const isActive = (path: string) =>
    pathname === path ? "active" : "";

  function logout() {
    localStorage.removeItem("token");
    setToken(null);
    navigate("/login");
  }

  return (
    <header className="navbar">
      <div className="navbar-inner">
        {/* Brand */}
        <Link to="/" className="navbar-brand">
          <img
            src="/images/quizzy-no-arms.png"
            alt="Blueberry mascot logo"
            height="60"
          />
          <span className="brand-text">QuizzyPop</span>
        </Link>

        {/* Main navigation */}
        <nav className="navbar-nav" aria-label="Main navigation">
          <Link to="/" className={isActive("/")}>Home</Link>
          <Link to="/quizzes" className={isActive("/quizzes")}>Take Quiz</Link>
          <Link to="/admin/quizzes/new" className={isActive("/admin/quizzes/new")}>Make Quiz</Link>
        </nav>

        {/* Right side actions */}
        <div className="navbar-actions">
          {token ? (
            <>
              <Link to="/mypage" className="btn-outline-green">Account</Link>
              <button onClick={logout} className="btn-outline-green">
                Log Out
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn-outline-green">Log In</Link>
              <Link to="/register" className="btn-outline-green">Sign Up</Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
