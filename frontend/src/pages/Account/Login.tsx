import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { loginSchema, type LoginFormData } from '../../schemas/authSchemas';
import { useAuth } from '../../contexts/AuthContext';
import { api } from '../../api';
import Input from '../../components/Input';
import Button from '../../components/Button';
import styles from './Login.module.css';
import Mascot from '../../components/Mascot';
import Loader from '../../components/Loader';

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const [serverError, setServerError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema)
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      setServerError('');
      
      // Call backend API
      const response = await api.post('/api/auth/login', {
        email: data.email,
        password: data.password
      });

      // Extract token from response
      const token = response.data.accessToken;
      
      // Store token in context and localStorage
      login(token);
      
      // Redirect back to where they came from, or homepage
      const from = location.state?.from || '/';
      navigate(from, { state: { fromLogin: true } });
      
    } catch (error: any) {
      // Handle errors
      if (error.response?.status === 401) {
        setServerError('Invalid email or password');
      } else {
        setServerError('An error occurred. Please try again.');
      }
      console.error('Login error:', error);
    }
  };

  return (
    <div className={styles.loginPage}>
      <div className={styles.loginContainer}>
        <Mascot variant="blueberry" size="medium" />
        <h1 className={styles.title}>Welcome Back!</h1>
        <p className={styles.subtitle}>Log in to your QuizzyPop account</p>

        <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
          {serverError && (
            <div className={styles.serverError}>{serverError}</div>
          )}

          <Input
            label="Email"
            type="email"
            placeholder="Enter your email"
            error={errors.email?.message}
            {...register('email')}
          />

          <Input
            label="Password"
            type="password"
            placeholder="Enter your password"
            error={errors.password?.message}
            {...register('password')}
          />

          <Button type="submit" variant="primary" fullWidth disabled={isSubmitting}>
            {isSubmitting && (
              <div className={styles.formLoader}>
                <Loader size="small" text="Logging in..." />
              </div>
            )}
          </Button>

          <p className={styles.footer}>
            Don't have an account?{' '}
            <a href="/register">Sign up</a>
          </p>
        </form>
      </div>
    </div>
  );
}
