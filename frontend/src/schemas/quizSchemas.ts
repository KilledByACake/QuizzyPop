/**
 * Quiz Validation Schemas
 * 
 * Zod schemas for validating quiz metadata in the CreateQuiz form (step 1 of quiz creation).
 * Validates title, description, category, difficulty, tags, and optional cover image.
 * 
 * Note: Tags are validated here but backend support is not yet fully implemented.
 */

import { z } from 'zod';

/**
 * Schema for CreateQuiz form validation
 * Validates all quiz metadata fields before proceeding to AddQuestions step
 */
export const createQuizSchema = z.object({
  /** Quiz title - displayed in cards and quiz player */
  title: z.string()
    .min(3, 'Title must be at least 3 characters')
    .max(100, 'Title must be less than 100 characters'),
  
  /** Quiz description - shown on quiz detail/take page */
  description: z.string()
    .min(10, 'Description must be at least 10 characters')
    .max(500, 'Description must be less than 500 characters'),
  
  /** Category ID - references backend Category entity */
  categoryId: z.string()
    .min(1, 'Please select a category'),
  
  /** Difficulty level - affects quiz filtering and display */
  difficulty: z.enum(['easy', 'medium', 'hard'], {
    message: 'Please select a difficulty level'
  }),
  
  /** Optional tags for additional categorization (backend support pending) */
  tags: z.array(
    z.string()
      .min(2, 'Tag must be at least 2 characters')
      .max(20, 'Tag must be at most 20 characters')
      .regex(/^[a-zA-Z0-9\-]+$/, 'Only letters, numbers and dashes')
  )
  .max(8, 'Maximum 8 tags')
  .optional(),

  /** Optional cover image - max 5MB, common image formats only */
  image: z.instanceof(File)
    .refine((file) => file.size <= 5000000, 'Image must be less than 5MB')
    .refine(
      (file) => ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'].includes(file.type),
      'Only .jpg, .jpeg, .png and .webp formats are supported'
    )
    .optional()
});

/** TypeScript type inferred from the schema for use in CreateQuiz component */
export type CreateQuizFormData = z.infer<typeof createQuizSchema>;