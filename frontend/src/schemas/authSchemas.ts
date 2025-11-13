import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string()
    .min(1, 'Email is required')
    .email('Invalid email address'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
});

export type LoginFormData = z.infer<typeof loginSchema>;

// NEW register schema
export const registerSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Invalid email'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Must contain an uppercase letter')
    .regex(/[a-z]/, 'Must contain a lowercase letter')
    .regex(/\d/, 'Must contain a number'),
  confirmPassword: z.string().min(1, 'Confirm your password'),
  role: z.enum(['student', 'teacher', 'parent']),
  phone: z.string().regex(/^[\d\s+()-]*$/, 'Invalid phone format').optional(),
  birthdate: z.string().optional()
}).refine(data => data.password === data.confirmPassword, {
  path: ['confirmPassword'],
  message: 'Passwords must match'
}).refine(data => {
  if (data.role === 'teacher' || data.role === 'parent') {
    if (!data.birthdate) return false;
    const age = (Date.now() - new Date(data.birthdate).getTime()) / (1000 * 60 * 60 * 24 * 365.25);
    return age >= 18;
  }
  return true;
}, {
  path: ['birthdate'],
  message: 'Must be at least 18 years old'
});

export type RegisterFormData = z.infer<typeof registerSchema>;