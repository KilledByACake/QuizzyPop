import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate, Link } from "react-router-dom";
import {
  registerSchema,
  type RegisterFormData,
} from "../../schemas/authSchemas";
import Input from "../../components/Input";
import Select from "../../components/Select";
import Button from "../../components/Button";
import Mascot from "../../components/Mascot";
import { api } from "../../api";
import Loader from "../../components/Loader";
import styles from "./Register.module.css";

/**
 * Registration page component
 * Creates new user accounts with role selection (student/teacher/parent)
 * Shows additional fields (phone, birthdate) for teachers and parents
 * Validates with Zod schema and handles server-side validation errors
 */
export default function Register() {
  const navigate = useNavigate();
  const [serverError, setServerError] = useState("");

  // Set page title on mount
  useEffect(() => {
    document.title = "Sign up - QuizzyPop";
  }, []);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      role: "student",
    },
  });

  // Watch role to conditionally show extra fields
  const role = watch("role");

  // Handle form submission - create account and redirect to login
  const onSubmit = async (data: RegisterFormData) => {
    setServerError("");

    try {
      // Call registration endpoint
      await api.post("/api/auth/register", {
        email: data.email,
        password: data.password,
        role: data.role,
        phone: data.phone || null,
        birthdate: data.birthdate || null,
      });

      // Registration successful - navigate to login with success message
      navigate("/login", {
        state: {
          message: "Account created! Please log in.",
          email: data.email,
        },
      });
    } catch (err: any) {
      console.error("Registration error:", err);

      // Handle various error responses from backend
      if (err.response?.status === 409) {
        setServerError("Email already exists. Please use a different email.");
      } else if (err.response?.data?.message) {
        setServerError(err.response.data.message);
      } else if (err.response?.data?.errors) {
        // FluentValidation errors from backend
        const validationErrors = Object.values(
          err.response.data.errors,
        ).flat();
        setServerError(validationErrors.join(", "));
      } else {
        setServerError("Failed to register. Please try again.");
      }
    }
  };

  // Show phone and birthdate fields for teachers and parents only
  const showExtra = role === "teacher" || role === "parent";

  return (
    <div className={styles.registerPage}>
      <div className={styles.registerContainer}>
        {/* Celebration mascot for welcoming new users */}
        <Mascot variant="celebrate" size="medium" alt="Quizzy Pop mascot" />
        <h1 className={styles.title}>Create Your Account</h1>
        <p className={styles.subtitle}>Join the fun! 💫</p>

        {/* Server error message display */}
        {serverError && (
          <div className={styles.serverError} role="alert">
            {serverError}
          </div>
        )}

        <form
          onSubmit={handleSubmit(onSubmit)}
          className={styles.form}
          aria-busy={isSubmitting}
        >
          {/* Email input */}
          <Input
            label="Email"
            type="email"
            placeholder="you@example.com"
            error={errors.email?.message}
            {...register("email")}
            required
          />

          {/* Password input with strength hint */}
          <Input
            label="Password"
            type="password"
            placeholder="Enter a strong password"
            error={errors.password?.message}
            hint="Must contain uppercase, lowercase, and number"
            {...register("password")}
            required
          />

          {/* Confirm password input */}
          <Input
            label="Confirm Password"
            type="password"
            placeholder="Repeat your password"
            error={errors.confirmPassword?.message}
            {...register("confirmPassword")}
            required
          />

          {/* Role selection dropdown */}
          <Select
            label="Select Your Role"
            error={errors.role?.message}
            {...register("role")}
            options={[
              { value: "student", label: "🎓 Student" },
              { value: "teacher", label: "🍎 Teacher" },
              { value: "parent", label: "👨‍👩‍👧 Parent" },
            ]}
            required
          />
          <p className={styles.roleHint}>
            Teachers and parents must be at least 18 years old.
          </p>

          {/* Additional fields for teachers and parents */}
          {showExtra && (
            <div className={styles.extraFields}>
              <Input
                label="Mobile Number (Optional)"
                type="tel"
                placeholder="+47 999 99 999"
                error={errors.phone?.message}
                {...register("phone")}
              />

              <Input
                label="Date of Birth"
                type="date"
                error={errors.birthdate?.message}
                {...register("birthdate")}
                required
              />
            </div>
          )}

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
            {isSubmitting ? "Creating account..." : "Create account"}
          </Button>

          {/* Link to login page */}
          <p className={styles.footer}>
            Already have an account? <Link to="/login">Log in!</Link>
          </p>
        </form>
      </div>
    </div>
  );
}
