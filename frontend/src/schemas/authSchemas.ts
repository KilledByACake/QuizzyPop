/**
 * Authentication Validation Schemas
 * 
 * Zod schemas for validating login and registration forms.
 * Enforces password strength requirements and age verification for certain roles.
 */

import { z } from 'zod';

/**
 * Login form validation schema
 * Basic email and password validation for user authentication
 */
export const loginSchema = z.object({
  /** User email address - must be valid format */
  email: z.string()
    .min(1, 'Email is required')
    .email('Invalid email address'),
  /** User password - minimum 8 characters */
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
});

/** TypeScript type for login form data */
export type LoginFormData = z.infer<typeof loginSchema>;

/**
 * Registration form validation schema
 * Enforces strong password requirements and role-based age verification.
 * Teachers and parents must be 18+ years old.
 */
export const registerSchema = z.object({
  /** User email address - must be valid format */
  email: z.string().min(1, 'Email is required').email('Invalid email'),
  
  /** Password with strength requirements: 8+ chars, uppercase, lowercase, number */
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Must contain an uppercase letter')
    .regex(/[a-z]/, 'Must contain a lowercase letter')
    .regex(/\d/, 'Must contain a number'),
  
  /** Password confirmation - must match password field */
  confirmPassword: z.string().min(1, 'Confirm your password'),
  
  /** User role - affects age verification and permissions */
  role: z.enum(['student', 'teacher', 'parent']),
  
  /** Optional phone number - flexible format */
  phone: z.string().regex(/^[\d\s+()-]*$/, 'Invalid phone format').optional(),
  
  /** Birthdate - required for teachers and parents (18+ verification) */
  birthdate: z.string().optional()
})
  // Ensure password and confirmation match
  .refine(data => data.password === data.confirmPassword, {
    path: ['confirmPassword'],
    message: 'Passwords must match'
  })
  // Age verification: teachers and parents must be 18+
  .refine(data => {
    if (data.role === 'teacher' || data.role === 'parent') {
      if (!data.birthdate) return false;
      const age = (Date.now() - new Date(data.birthdate).getTime()) / (1000 * 60 * 60 * 24 * 365.25);
      return age >= 18;
    }
    return true; // Students have no age requirement
  }, {
    path: ['birthdate'],
    message: 'Must be at least 18 years old'
  });

/** TypeScript type for registration form data */
export type RegisterFormData = z.infer<typeof registerSchema>;