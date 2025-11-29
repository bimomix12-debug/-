export enum QuestionType {
  MULTIPLE_CHOICE = 'MULTIPLE_CHOICE',
  TRANSLATE_EN_TO_AR = 'TRANSLATE_EN_TO_AR',
  TRANSLATE_AR_TO_EN = 'TRANSLATE_AR_TO_EN',
  FILL_IN_BLANK = 'FILL_IN_BLANK',
}

export interface Question {
  id: string;
  type: QuestionType;
  prompt: string;
  options?: string[]; // For multiple choice or word bank
  correctAnswer: string; // The canonical correct answer
  acceptableAnswers?: string[]; // Other valid variations
  explanation?: string; // Why this is the answer
}

export interface Lesson {
  id: string;
  topic: string; // e.g., "Greetings", "Travel", "Food"
  title: string;
  description: string;
  questions: Question[];
}

export interface UserState {
  hearts: number;
  xp: number;
  streak: number;
  completedLessons: string[];
}

export interface TopicConfig {
  id: string;
  name: string;
  icon: string;
  color: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
}