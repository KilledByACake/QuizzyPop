import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { loginSchema, type LoginFormData } from "../../schemas/authSchemas";
import { useAuth } from "../../contexts/AuthContext";
import { api } from "../../api";
import Input from "../../components/Input";
import Button from "../../components/Button";
import Mascot from "../../components/Mascot";
import Loader from "../../components/Loader";
import styles from "./Login.module.css";

/**
 * Login page component
 * Authenticates users with email/password and stores JWT token
 * Redirects back to the page they came from after successful login
 */
export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const [serverError, setServerError] = useState("");

  // Set page title on mount
  useEffect(() => {
    document.title = "Log in - QuizzyPop";
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  // Handle form submission - authenticate user and store token
  const onSubmit = async (data: LoginFormData) => {
    try {
      setServerError("");

      // Call backend authentication endpoint
      const response = await api.post("/api/auth/login", {
        email: data.email,
        password: data.password,
      });

      // Extract JWT access token from response
      const token = response.data.accessToken;

      // Store token in context and localStorage
      login(token);

      // Redirect back to originating page (or homepage if direct visit)
      const from = (location.state as any)?.from || "/";
      navigate(from, { state: { fromLogin: true } });
    } catch (error: any) {
      // Handle authentication errors
      if (error.response?.status === 401) {
        setServerError("Invalid email or password");
      } else {
        setServerError("An error occurred. Please try again.");
      }
      console.error("Login error:", error);
    }
  };

  return (
    <div className={styles.loginPage}>
      <div className={styles.loginContainer}>
        {/* Mascot for visual appeal */}
        <Mascot variant="blueberry" size="medium" />
        <h1 className={styles.title}>Welcome Back!</h1>
        <p className={styles.subtitle}>Log in to your QuizzyPop account</p>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className={styles.form}
          aria-busy={isSubmitting}
        >
          {/* Server error message display */}
          {serverError && (
            <div
              className={styles.serverError}
              role="alert"
            >
              {serverError}
            </div>
          )}

          {/* Email input with validation */}
          <Input
            label="Email"
            type="email"
            placeholder="Enter your email"
            error={errors.email?.message}
            {...register("email")}
          />

          {/* Password input with validation */}
          <Input
            label="Password"
            type="password"
            placeholder="Enter your password"
            error={errors.password?.message}
            {...register("password")}
          />

          {/* Submit button with loading state */}
          <Button
            type="submit"
            variant="primary"
            fullWidth
            disabled={isSubmitting}
          >
            {isSubmitting && (
              <span className={styles.formLoaderIcon}>
                <Loader size="small" text="" />
              </span>
            )}
            {isSubmitting ? "Logging in..." : "Log In"}
          </Button>

          {/* Link to registration page */}
          <p className={styles.footer}>
            Don't have an account?{" "}
            <Link to="/register">Sign up</Link>
          </p>
        </form>
      </div>
    </div>
  );
}