// User Roles
export type UserRole = 'admin' | 'manager' | 'staff' | 'teacher';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  department?: string;
}

// Question Bank
export type QuestionDifficulty = 'easy' | 'medium' | 'hard';
export type QuestionType = 'multiple-choice' | 'true-false' | 'short-answer' | 'essay';

export interface Question {
  id: string;
  subject: string;
  topic: string;
  difficulty: QuestionDifficulty;
  type: QuestionType;
  question: string;
  options?: string[];
  correctAnswer: string;
  explanation?: string;
  points: number;
  createdBy: string;
  createdAt: string;
  tags: string[];
}

// Exercise & Exam
export interface Exercise {
  id: string;
  title: string;
  subject: string;
  topic: string;
  difficulty: QuestionDifficulty;
  questions: Question[];
  totalPoints: number;
  createdBy: string;
  createdAt: string;
}

export interface Exam {
  id: string;
  title: string;
  subject: string;
  questions: Question[];
  totalPoints: number;
  duration: number; // minutes
  versions: number;
  createdBy: string;
  createdAt: string;
}

// OCR Grading
export interface GradingResult {
  id: string;
  studentName: string;
  studentId: string;
  examId: string;
  examTitle: string;
  score: number;
  totalPoints: number;
  percentage: number;
  answers: {
    questionId: string;
    studentAnswer: string;
    correctAnswer: string;
    isCorrect: boolean;
    points: number;
  }[];
  gradedAt: string;
  gradedBy: string;
}

// Analytics
export interface AnalyticsData {
  studentPerformance: {
    studentId: string;
    studentName: string;
    averageScore: number;
    totalExams: number;
    trend: 'up' | 'down' | 'stable';
  }[];
  topicPerformance: {
    topic: string;
    averageScore: number;
    questionsCount: number;
  }[];
  recentActivity: {
    id: string;
    type: 'exam' | 'exercise' | 'grading';
    title: string;
    timestamp: string;
  }[];
}

// Dashboard Stats
export interface DashboardStats {
  totalQuestions: number;
  totalExercises: number;
  totalExams: number;
  totalGradings: number;
  activeStudents?: number;
  averageScore?: number;
  // Admin specific
  totalUsers?: number;
  totalRevenue?: number;
  activeSubscriptions?: number;
  // Manager specific
  pendingApprovals?: number;
  activeOrders?: number;
}
