export enum Difficulty {
  EASY = 'Easy',
  MODERATE = 'Moderate',
  DIFFICULT = 'Difficult'
}

export enum Subject {
  QUANT = 'Quantitative Aptitude',
  REASONING = 'Reasoning Ability',
  ENGLISH = 'English Language',
  GA = 'General Awareness',
  COMPUTER = 'Computer Knowledge'
}

export interface ChartData {
  type: 'bar' | 'pie';
  title: string;
  data: { name: string; value: number }[];
}

export interface Question {
  id?: string;
  questionText: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
  topic: string;
  difficulty: string;
  chartData?: ChartData; // Optional field for DI
}

export interface MockQuestion extends Question {
  section: 'Reasoning' | 'Quantitative Aptitude';
  status: 'not_visited' | 'not_answered' | 'answered' | 'marked' | 'marked_answered';
  userAnswer?: number;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  timestamp: number;
}

export interface PatternDataPoint {
  topic: string;
  weightage: number; // Percentage or number of questions
  trend: 'UP' | 'DOWN' | 'STABLE';
}

export interface PatternAnalysis {
  examYear: string;
  examType: 'PO' | 'Clerk';
  summary: string;
  subjectData: PatternDataPoint[];
}

export interface Note {
  id: string;
  title: string;
  content: string;
  date: number;
  tags: string[];
}