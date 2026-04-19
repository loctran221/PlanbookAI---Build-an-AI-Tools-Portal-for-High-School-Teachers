import { Question, Exercise, Exam, GradingResult, User, DashboardStats, AnalyticsData } from '../types';

// Mock Users
export const mockUsers: User[] = [
  {
    id: '1',
    name: 'Dr. Sarah Johnson',
    email: 'sarah.johnson@school.edu',
    role: 'teacher',
    department: 'Chemistry',
  },
  {
    id: '2',
    name: 'Admin User',
    email: 'admin@planbookai.com',
    role: 'admin',
  },
  {
    id: '3',
    name: 'Manager User',
    email: 'manager@planbookai.com',
    role: 'manager',
  },
  {
    id: '4',
    name: 'Staff User',
    email: 'staff@planbookai.com',
    role: 'staff',
  },
];

// Mock Questions
export const mockQuestions: Question[] = [
  {
    id: 'q1',
    subject: 'Chemistry',
    topic: 'Atomic Structure',
    difficulty: 'easy',
    type: 'multiple-choice',
    question: 'What is the atomic number of Carbon?',
    options: ['4', '6', '12', '14'],
    correctAnswer: '6',
    explanation: 'Carbon has 6 protons, which defines its atomic number.',
    points: 2,
    createdBy: 'Dr. Sarah Johnson',
    createdAt: '2024-03-15T10:00:00Z',
    tags: ['atoms', 'periodic-table', 'fundamentals'],
  },
  {
    id: 'q2',
    subject: 'Chemistry',
    topic: 'Chemical Bonding',
    difficulty: 'medium',
    type: 'multiple-choice',
    question: 'Which type of bond is formed when electrons are shared between atoms?',
    options: ['Ionic bond', 'Covalent bond', 'Metallic bond', 'Hydrogen bond'],
    correctAnswer: 'Covalent bond',
    explanation: 'Covalent bonds form when atoms share electrons to achieve stability.',
    points: 3,
    createdBy: 'Dr. Sarah Johnson',
    createdAt: '2024-03-14T14:30:00Z',
    tags: ['bonding', 'electrons', 'molecules'],
  },
  {
    id: 'q3',
    subject: 'Chemistry',
    topic: 'Periodic Table',
    difficulty: 'hard',
    type: 'multiple-choice',
    question: 'Which element has the highest electronegativity?',
    options: ['Oxygen', 'Fluorine', 'Chlorine', 'Nitrogen'],
    correctAnswer: 'Fluorine',
    explanation: 'Fluorine is the most electronegative element with a value of 4.0 on the Pauling scale.',
    points: 4,
    createdBy: 'Dr. Sarah Johnson',
    createdAt: '2024-03-13T09:15:00Z',
    tags: ['periodic-table', 'properties', 'advanced'],
  },
  {
    id: 'q4',
    subject: 'Chemistry',
    topic: 'Acids and Bases',
    difficulty: 'easy',
    type: 'multiple-choice',
    question: 'What is the pH of a neutral solution?',
    options: ['0', '7', '14', '1'],
    correctAnswer: '7',
    explanation: 'A neutral solution has equal concentrations of H+ and OH- ions, resulting in pH 7.',
    points: 2,
    createdBy: 'Dr. Sarah Johnson',
    createdAt: '2024-03-12T11:20:00Z',
    tags: ['acids', 'bases', 'pH'],
  },
  {
    id: 'q5',
    subject: 'Chemistry',
    topic: 'Stoichiometry',
    difficulty: 'medium',
    type: 'multiple-choice',
    question: 'How many moles are in 44g of CO2? (Molar mass CO2 = 44 g/mol)',
    options: ['0.5 mol', '1 mol', '2 mol', '44 mol'],
    correctAnswer: '1 mol',
    explanation: 'Number of moles = mass / molar mass = 44g / 44g/mol = 1 mol',
    points: 3,
    createdBy: 'Dr. Sarah Johnson',
    createdAt: '2024-03-11T16:45:00Z',
    tags: ['stoichiometry', 'moles', 'calculations'],
  },
  {
    id: 'q6',
    subject: 'Chemistry',
    topic: 'Organic Chemistry',
    difficulty: 'hard',
    type: 'multiple-choice',
    question: 'What is the general formula for alkanes?',
    options: ['CnH2n', 'CnH2n+2', 'CnH2n-2', 'CnHn'],
    correctAnswer: 'CnH2n+2',
    explanation: 'Alkanes are saturated hydrocarbons with single bonds, following the formula CnH2n+2.',
    points: 4,
    createdBy: 'Dr. Sarah Johnson',
    createdAt: '2024-03-10T13:00:00Z',
    tags: ['organic', 'hydrocarbons', 'formulas'],
  },
];

// Mock Exercises
export const mockExercises: Exercise[] = [
  {
    id: 'ex1',
    title: 'Atomic Structure Practice',
    subject: 'Chemistry',
    topic: 'Atomic Structure',
    difficulty: 'easy',
    questions: [mockQuestions[0], mockQuestions[3]],
    totalPoints: 4,
    createdBy: 'Dr. Sarah Johnson',
    createdAt: '2024-03-15T10:00:00Z',
  },
  {
    id: 'ex2',
    title: 'Chemical Bonding Quiz',
    subject: 'Chemistry',
    topic: 'Chemical Bonding',
    difficulty: 'medium',
    questions: [mockQuestions[1], mockQuestions[4]],
    totalPoints: 6,
    createdBy: 'Dr. Sarah Johnson',
    createdAt: '2024-03-14T14:30:00Z',
  },
];

// Mock Exams
export const mockExams: Exam[] = [
  {
    id: 'exam1',
    title: 'Mid-Term Chemistry Exam',
    subject: 'Chemistry',
    questions: [mockQuestions[0], mockQuestions[1], mockQuestions[2], mockQuestions[3]],
    totalPoints: 11,
    duration: 60,
    versions: 2,
    createdBy: 'Dr. Sarah Johnson',
    createdAt: '2024-03-15T10:00:00Z',
  },
];

// Mock Grading Results
export const mockGradingResults: GradingResult[] = [
  {
    id: 'gr1',
    studentName: 'John Smith',
    studentId: 'S001',
    examId: 'exam1',
    examTitle: 'Mid-Term Chemistry Exam',
    score: 9,
    totalPoints: 11,
    percentage: 81.8,
    answers: [
      {
        questionId: 'q1',
        studentAnswer: '6',
        correctAnswer: '6',
        isCorrect: true,
        points: 2,
      },
      {
        questionId: 'q2',
        studentAnswer: 'Covalent bond',
        correctAnswer: 'Covalent bond',
        isCorrect: true,
        points: 3,
      },
      {
        questionId: 'q3',
        studentAnswer: 'Oxygen',
        correctAnswer: 'Fluorine',
        isCorrect: false,
        points: 0,
      },
      {
        questionId: 'q4',
        studentAnswer: '7',
        correctAnswer: '7',
        isCorrect: true,
        points: 2,
      },
    ],
    gradedAt: '2024-03-16T15:30:00Z',
    gradedBy: 'Dr. Sarah Johnson',
  },
  {
    id: 'gr2',
    studentName: 'Emily Davis',
    studentId: 'S002',
    examId: 'exam1',
    examTitle: 'Mid-Term Chemistry Exam',
    score: 11,
    totalPoints: 11,
    percentage: 100,
    answers: [
      {
        questionId: 'q1',
        studentAnswer: '6',
        correctAnswer: '6',
        isCorrect: true,
        points: 2,
      },
      {
        questionId: 'q2',
        studentAnswer: 'Covalent bond',
        correctAnswer: 'Covalent bond',
        isCorrect: true,
        points: 3,
      },
      {
        questionId: 'q3',
        studentAnswer: 'Fluorine',
        correctAnswer: 'Fluorine',
        isCorrect: true,
        points: 4,
      },
      {
        questionId: 'q4',
        studentAnswer: '7',
        correctAnswer: '7',
        isCorrect: true,
        points: 2,
      },
    ],
    gradedAt: '2024-03-16T15:45:00Z',
    gradedBy: 'Dr. Sarah Johnson',
  },
  {
    id: 'gr3',
    studentName: 'Michael Chen',
    studentId: 'S003',
    examId: 'exam1',
    examTitle: 'Mid-Term Chemistry Exam',
    score: 7,
    totalPoints: 11,
    percentage: 63.6,
    answers: [
      {
        questionId: 'q1',
        studentAnswer: '6',
        correctAnswer: '6',
        isCorrect: true,
        points: 2,
      },
      {
        questionId: 'q2',
        studentAnswer: 'Ionic bond',
        correctAnswer: 'Covalent bond',
        isCorrect: false,
        points: 0,
      },
      {
        questionId: 'q3',
        studentAnswer: 'Oxygen',
        correctAnswer: 'Fluorine',
        isCorrect: false,
        points: 0,
      },
      {
        questionId: 'q4',
        studentAnswer: '7',
        correctAnswer: '7',
        isCorrect: true,
        points: 2,
      },
    ],
    gradedAt: '2024-03-16T16:00:00Z',
    gradedBy: 'Dr. Sarah Johnson',
  },
];

// Dashboard Stats by Role
export const teacherDashboardStats: DashboardStats = {
  totalQuestions: 24,
  totalExercises: 8,
  totalExams: 3,
  totalGradings: 15,
  activeStudents: 28,
  averageScore: 78.5,
};

export const adminDashboardStats: DashboardStats = {
  totalQuestions: 156,
  totalExercises: 45,
  totalExams: 12,
  totalGradings: 89,
  totalUsers: 47,
  totalRevenue: 12450,
  activeSubscriptions: 42,
};

export const managerDashboardStats: DashboardStats = {
  totalQuestions: 156,
  totalExercises: 45,
  totalExams: 12,
  totalGradings: 89,
  pendingApprovals: 7,
  activeOrders: 12,
};

export const staffDashboardStats: DashboardStats = {
  totalQuestions: 156,
  totalExercises: 45,
  totalExams: 12,
  totalGradings: 89,
};

// Analytics Data
export const mockAnalyticsData: AnalyticsData = {
  studentPerformance: [
    { studentId: 'S001', studentName: 'John Smith', averageScore: 81.8, totalExams: 5, trend: 'up' },
    { studentId: 'S002', studentName: 'Emily Davis', averageScore: 95.2, totalExams: 5, trend: 'up' },
    { studentId: 'S003', studentName: 'Michael Chen', averageScore: 72.4, totalExams: 5, trend: 'stable' },
    { studentId: 'S004', studentName: 'Sarah Wilson', averageScore: 88.6, totalExams: 4, trend: 'up' },
    { studentId: 'S005', studentName: 'David Lee', averageScore: 76.3, totalExams: 5, trend: 'down' },
  ],
  topicPerformance: [
    { topic: 'Atomic Structure', averageScore: 85.2, questionsCount: 12 },
    { topic: 'Chemical Bonding', averageScore: 78.5, questionsCount: 15 },
    { topic: 'Periodic Table', averageScore: 72.3, questionsCount: 10 },
    { topic: 'Acids and Bases', averageScore: 88.7, questionsCount: 14 },
    { topic: 'Stoichiometry', averageScore: 75.1, questionsCount: 13 },
    { topic: 'Organic Chemistry', averageScore: 68.9, questionsCount: 11 },
  ],
  recentActivity: [
    { id: '1', type: 'grading', title: 'Graded Mid-Term Exam for John Smith', timestamp: '2024-03-16T15:30:00Z' },
    { id: '2', type: 'exam', title: 'Created Final Exam - Organic Chemistry', timestamp: '2024-03-16T14:15:00Z' },
    { id: '3', type: 'exercise', title: 'Generated Exercise - Stoichiometry Practice', timestamp: '2024-03-16T10:20:00Z' },
    { id: '4', type: 'grading', title: 'Graded Quiz for Emily Davis', timestamp: '2024-03-15T16:45:00Z' },
    { id: '5', type: 'exam', title: 'Created Mid-Term Chemistry Exam', timestamp: '2024-03-15T10:00:00Z' },
  ],
};

// Topics for Chemistry
export const chemistryTopics = [
  'Atomic Structure',
  'Periodic Table',
  'Chemical Bonding',
  'Acids and Bases',
  'Stoichiometry',
  'Organic Chemistry',
  'Thermodynamics',
  'Electrochemistry',
  'Chemical Equilibrium',
  'Reaction Kinetics',
];
