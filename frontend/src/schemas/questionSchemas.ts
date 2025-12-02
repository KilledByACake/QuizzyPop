/**
 * Question Validation Schemas
 * 
 * Zod schemas for validating quiz questions in the AddQuestions form.
 * Supports 6 question types with type-safe validation using discriminated unions.
 */

import { z } from 'zod';

/**
 * All supported question types
 * Note: Only 'multiple-choice' is fully functional in current backend
 */
export const questionTypes = ['multiple-choice', 'fill-blank', 'short', 'long', 'true-false', 'multi-select'] as const;
export type QuestionType = typeof questionTypes[number];

/**
 * Base question schema - common fields for all question types
 */
const baseQuestion = z.object({
  type: z.enum(questionTypes),
  text: z.string().min(5, 'Question must be at least 5 characters'),
});

/**
 * Multiple Choice Question
 * 4 options with one correct answer (0-based index)
 * Fully implemented in backend
 */
const mcQuestion = baseQuestion.extend({
  type: z.literal('multiple-choice'),
  options: z.array(z.string().min(1, 'Option cannot be empty'))
    .length(4, 'Provide exactly 4 options'),
  correctIndex: z.number().int().min(0).max(3, 'Pick the correct option'),
});

/**
 * Fill in the Blank Question
 * User types a word/phrase to complete the sentence
 */
const fillBlankQuestion = baseQuestion.extend({
  type: z.literal('fill-blank'),
  answer: z.string().min(1, 'Answer required'),
});

/**
 * Short Answer Question
 * Brief text response (1-2 sentences)
 */
const shortQuestion = baseQuestion.extend({
  type: z.literal('short'),
  answer: z.string().min(1, 'Answer required'),
});

/**
 * Long Answer Question
 * Extended text response (paragraph)
 */
const longQuestion = baseQuestion.extend({
  type: z.literal('long'),
  answer: z.string().min(1, 'Answer required'),
});

/**
 * True/False Question
 * Binary choice with boolean correct answer
 */
const trueFalseQuestion = baseQuestion.extend({
  type: z.literal('true-false'),
  correctBool: z.boolean(),
});

/**
 * Multi-Select Question
 * 4 options with multiple correct answers
 */
const multiSelectQuestion = baseQuestion.extend({
  type: z.literal('multi-select'),
  options: z.array(z.string().min(1)).length(4, 'Provide exactly 4 options'),
  correctIndexes: z.array(z.number().int().min(0).max(3)).min(1, 'Pick at least one correct option'),
});

/**
 * Main schema for AddQuestions form
 * Uses discriminated union for type-safe question validation based on 'type' field
 */
export const addQuestionsSchema = z.object({
  questions: z.array(
    z.discriminatedUnion('type', [
      mcQuestion,
      fillBlankQuestion,
      shortQuestion,
      longQuestion,
      trueFalseQuestion,
      multiSelectQuestion,
    ])
  ).min(1, 'Add at least one question'),
});

/** TypeScript type inferred from the schema for use in components */
export type AddQuestionsForm = z.infer<typeof addQuestionsSchema>;