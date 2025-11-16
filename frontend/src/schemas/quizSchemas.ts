import { z } from 'zod';

export const createQuizSchema = z.object({
  title: z.string()
    .min(3, 'Title must be at least 3 characters')
    .max(100, 'Title must be less than 100 characters'),
  
  description: z.string()
    .min(10, 'Description must be at least 10 characters')
    .max(500, 'Description must be less than 500 characters'),
  
  categoryId: z.string()
    .min(1, 'Please select a category'),
  
  difficulty: z.enum(['easy', 'medium', 'hard'], {
    message: 'Please select a difficulty level'
  }),
  
  tags: z.array(
    z.string()
      .min(2, 'Tag must be at least 2 characters')
      .max(20, 'Tag must be at most 20 characters')
      .regex(/^[a-zA-Z0-9\-]+$/, 'Only letters, numbers and dashes')
  )
  .max(8, 'Maximum 8 tags')
  .optional(),

  image: z.instanceof(File)
    .refine((file) => file.size <= 5000000, 'Image must be less than 5MB')
    .refine(
      (file) => ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'].includes(file.type),
      'Only .jpg, .jpeg, .png and .webp formats are supported'
    )
    .optional()
});

export type CreateQuizFormData = z.infer<typeof createQuizSchema>;