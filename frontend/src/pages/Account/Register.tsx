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

export default function Register() {
  const navigate = useNavigate();
  const [serverError, setServerError] = useState('');
  const [notImplemented] = useState(true); // flip to false when backend adds endpoint

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

    if (notImplemented) {
      setServerError('Registration API not implemented yet.');
      return;
    }

    try {
      // Adjust endpoint when backend adds /api/auth/register
      const response = await api.post('/api/auth/register', {
        email: data.email,
        password: data.password,
        role: data.role,
        phone: data.phone || null,
        birthdate: data.birthdate || null
      });

      // If backend returns a token immediately you could auto-login:
      if (response.data?.token) {
        // Optionally call useAuth().login(response.data.token)
      }

      navigate('/login');
    } catch (err: any) {
      setServerError(err.response?.data?.message || 'Failed to register.');
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

        {notImplemented && (
          <div className={styles.notImplemented}>
            The backend registration endpoint isn't live yet. You can still design & validate the form.
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
          <Input
            label="Email"
            type="email"
            placeholder="you@example.com"
            error={errors.email?.message}
            {...register('email')}
          />

          <Input
            label="Password"
            type="password"
            placeholder="Enter a strong password"
            error={errors.password?.message}
            {...register('password')}
          />

          <Input
            label="Confirm Password"
            type="password"
            placeholder="Repeat your password"
            error={errors.confirmPassword?.message}
            {...register('confirmPassword')}
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
          />
          <p className={styles.roleHint}>
            Teachers and parents must be at least 18 years old.
          </p>

          {showExtra && (
            <div className={styles.extraFields}>
              <Input
                label="Mobile Number"
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
              />
            </div>
          )}

          <Button
            type="submit"
            variant="primary"
            fullWidth
            disabled={isSubmitting || notImplemented}
          >
            {isSubmitting ? 'Creating account...' : 'Sign Up'}
          </Button>

          <p className={styles.footer}>
            Already have an account? <Link to="/login">Log in!</Link>
          </p>
        </form>
      </div>
    </div>
  );
}
