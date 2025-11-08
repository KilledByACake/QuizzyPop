import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../../api";
import "./Login.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const nav = useNavigate();

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    try {
      const { data } = await api.post("/auth/login", { email, password });
      const token = data.token ?? data.accessToken;
      localStorage.setItem("token", token);
      api.defaults.headers.common.Authorization = `Bearer ${token}`;
      nav("/");
    } catch {
      setError("Wrong Username or Password");
    }
  }

  return (
    <section className="login-page">
      <div className="login-container">
        <img
          src="/images/quizzy-blueberry.png"
          alt="Quizzy Pop mascot"
          className="login-mascot"
        />
        <h1>Welcome Back!</h1>
        <p className="subtitle">Log in!</p>

        {error && (
          <div className="alert" role="alert">
            {error}
          </div>
        )}

        <form className="login-form" onSubmit={submit}>
          <div className="form-group">
            <label htmlFor="email">Email address</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              placeholder="you@example.com"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              placeholder="••••••••"
            />
          </div>

          <button type="submit" className="btn-primary">
            Log In
          </button>

          <p className="footer-text">
            Don’t have an account? <Link to="/register">Sign up!</Link>
          </p>
        </form>
      </div>
    </section>
  );
}
