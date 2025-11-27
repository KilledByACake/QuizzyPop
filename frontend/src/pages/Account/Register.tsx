import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate, Link } from 'react-router-dom';
import { registerSchema, type RegisterFormData } from '../../schemas/authSchemas';
import Input from '../../components/Input';
import Select from '../../components/Select';
import Button from '../../components/Button';
import Mascot from '../../components/Mascot';
import { api } from '../../api';
import styles from './Register.module.css';
import Loader from '../../components/Loader';

export default function Register() {
  const navigate = useNavigate();
  const [serverError, setServerError] = useState('');

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting }
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      role: 'student'
    }
  });

  const role = watch('role');

  const onSubmit = async (data: RegisterFormData) => {
    setServerError('');

    try {
      const response = await api.post('/api/auth/register', {
        email: data.email,
        password: data.password,
        role: data.role,
        phone: data.phone || null,
        birthdate: data.birthdate || null
      });

      // Registration successful - navigate to login
      navigate('/login', { 
        state: { 
          message: 'Account created! Please log in.',
          email: data.email 
        } 
      });
    } catch (err: any) {
      console.error('Registration error:', err);
      
      // Extract error message
      if (err.response?.status === 409) {
        setServerError('Email already exists. Please use a different email.');
      } else if (err.response?.data?.message) {
        setServerError(err.response.data.message);
      } else if (err.response?.data?.errors) {
        // FluentValidation errors
        const validationErrors = Object.values(err.response.data.errors).flat();
        setServerError(validationErrors.join(', '));
      } else {
        setServerError('Failed to register. Please try again.');
      }
    }
  };

  const showExtra = role === 'teacher' || role === 'parent';

  return (
    <div className={styles.registerPage}>
      <div className={styles.registerContainer}>
        <Mascot variant="celebrate" size="medium" alt="Quizzy Pop mascot" />
        <h1 className={styles.title}>Create Your Account</h1>
        <p className={styles.subtitle}>Join the fun! 💫</p>

        {serverError && (
          <div className={styles.serverError}>{serverError}</div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
          <Input
            label="Email"
            type="email"
            placeholder="you@example.com"
            error={errors.email?.message}
            {...register('email')}
            required
          />

          <Input
            label="Password"
            type="password"
            placeholder="Enter a strong password"
            error={errors.password?.message}
            hint="Must contain uppercase, lowercase, and number"
            {...register('password')}
            required
          />

          <Input
            label="Confirm Password"
            type="password"
            placeholder="Repeat your password"
            error={errors.confirmPassword?.message}
            {...register('confirmPassword')}
            required
          />

          <Select
            label="Select Your Role"
            error={errors.role?.message}
            {...register('role')}
            options={[
              { value: 'student', label: '🎓 Student' },
              { value: 'teacher', label: '🍎 Teacher' },
              { value: 'parent', label: '👨‍👩‍👧 Parent' }
            ]}
            required
          />
          <p className={styles.roleHint}>
            Teachers and parents must be at least 18 years old.
          </p>

          {showExtra && (
            <div className={styles.extraFields}>
              <Input
                label="Mobile Number (Optional)"
                type="tel"
                placeholder="+47 999 99 999"
                error={errors.phone?.message}
                {...register('phone')}
              />

              <Input
                label="Date of Birth"
                type="date"
                error={errors.birthdate?.message}
                {...register('birthdate')}
                required
              />
            </div>
          )}

          <Button
            type="submit"
            variant="primary"
            fullWidth
            disabled={isSubmitting}
          >
            {isSubmitting && (
              <div className={styles.formLoader}>
                <Loader size="small" text="Creating account..." />
              </div>
            )}
          <p className={styles.footer}>
            Already have an account? <Link to="/login">Log in!</Link>
          </p>
        </form>
      </div>
    </div>
  );
}
