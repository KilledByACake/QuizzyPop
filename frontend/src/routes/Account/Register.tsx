import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../../api";
import "./Register.css";

export default function Register() {
  const [form, setForm] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    role: "",
    phone: "",
    birthdate: "",
  });
  const [error, setError] = useState<string | null>(null);
  const nav = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const showExtra = form.role === "teacher" || form.role === "parent";

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (form.password !== form.confirmPassword) {
      setError("Passwords must match.");
      return;
    }

    try {
      await api.post("/auth/register", form);
      nav("/login");
    } catch {
      setError("Registration failed. Try again.");
    }
  }

  return (
    <section className="signup-page">
      <div className="signup-container">
        <img
          src="/images/quizzy-blueberry.png"
          alt="Quizzy Pop mascot"
          className="signup-mascot"
        />
        <h1>Create Your Account</h1>
        <p className="subtitle">Join the fun! 💫</p>

        {error && <div className="alert">{error}</div>}

        <form className="signup-form" onSubmit={submit}>
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              name="email"
              required
              placeholder="you@example.com"
              value={form.email}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              required
              minLength={6}
              placeholder="Enter a strong password"
              value={form.password}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              required
              placeholder="Repeat your password"
              value={form.confirmPassword}
              onChange={handleChange}
            />
          </div>

          <div className="form-group dropdown">
            <label htmlFor="role">Select Your Role</label>
            <div className="dropdown-wrapper">
              <select
                id="role"
                name="role"
                required
                value={form.role}
                onChange={handleChange}
              >
                <option value="">Choose one...</option>
                <option value="student">🎓 Student</option>
                <option value="teacher">🍎 Teacher</option>
                <option value="parent">👨‍👩‍👧 Parent</option>
              </select>
            </div>
            <p className="role-hint">
              Teachers and parents must be at least 18 years old.
            </p>
          </div>

          {showExtra && (
            <div className="extra-fields">
              <div className="form-group">
                <label htmlFor="phone">Mobile Number</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  placeholder="+47 999 99 999"
                  value={form.phone}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label htmlFor="birthdate">Date of Birth</label>
                <input
                  type="date"
                  id="birthdate"
                  name="birthdate"
                  value={form.birthdate}
                  onChange={handleChange}
                />
              </div>
            </div>
          )}

          <button type="submit" className="btn-primary">
            Sign Up
          </button>

          <p className="footer-text">
            Already have an account? <Link to="/login">Log in!</Link>
          </p>
        </form>
      </div>
    </section>
  );
}
