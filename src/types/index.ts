export interface WordData {
  word: string;
  turkishMeaning: string;
  englishMeaning: string;
  partOfSpeech: string;
  article: string | null;
  pluralForm: string | null;
  exampleSentences: ExampleSentence[];
}

export interface ExampleSentence {
  german: string;
  turkish: string;
  english: string;
}

export interface Question {
  id: number;
  type: 'multiple_choice' | 'fill_blank' | 'meaning_selection' | 'sentence_completion';
  question: string;
  options?: string[];
  correctAnswer: number | string;
  hint?: string;
}

export interface PracticeResult {
  date: string;
  word: string;
  score: number;
  totalQuestions: number;
}

export interface UserProfile {
  totalPractices: number;
  averageScore: number;
  practiceHistory: PracticeResult[];
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface ChatUsage {
  date: string;
  count: number;
}
