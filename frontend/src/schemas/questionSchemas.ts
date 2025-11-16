import { z } from 'zod';

export const questionTypes = ['multiple-choice', 'fill-blank', 'short', 'long', 'true-false', 'multi-select'] as const;
export type QuestionType = typeof questionTypes[number];

const baseQuestion = z.object({
  type: z.enum(questionTypes),
  text: z.string().min(5, 'Question must be at least 5 characters'),
});

const mcQuestion = baseQuestion.extend({
  type: z.literal('multiple-choice'),
  options: z.array(z.string().min(1, 'Option cannot be empty'))
    .length(4, 'Provide exactly 4 options'),
  correctIndex: z.number().int().min(0).max(3, 'Pick the correct option'),
});

const fillBlankQuestion = baseQuestion.extend({
  type: z.literal('fill-blank'),
  answer: z.string().min(1, 'Answer required'),
});

const shortQuestion = baseQuestion.extend({
  type: z.literal('short'),
  answer: z.string().min(1, 'Answer required'),
});

const longQuestion = baseQuestion.extend({
  type: z.literal('long'),
  answer: z.string().min(1, 'Answer required'),
});

const trueFalseQuestion = baseQuestion.extend({
  type: z.literal('true-false'),
  correctBool: z.boolean(),
});

const multiSelectQuestion = baseQuestion.extend({
  type: z.literal('multi-select'),
  options: z.array(z.string().min(1)).length(4, 'Provide exactly 4 options'),
  correctIndexes: z.array(z.number().int().min(0).max(3)).min(1, 'Pick at least one correct option'),
});

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

export type AddQuestionsForm = z.infer<typeof addQuestionsSchema>;