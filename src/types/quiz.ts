export interface QuizAnswer {
  questionId: string;
  value: number;
  pillar: 'process' | 'customer' | 'revenue';
}

export interface QuizData {
  industry: string;
  companySize: string;
  answers: QuizAnswer[];
}

export interface Question {
  id: string;
  type: 'select' | 'scale';
  question: string;
  options?: string[];
  pillar: 'process' | 'customer' | 'revenue' | null;
}