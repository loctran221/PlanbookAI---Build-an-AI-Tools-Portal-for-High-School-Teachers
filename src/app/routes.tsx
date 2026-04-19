import { createBrowserRouter, Navigate } from 'react-router';
import { LoginPage } from './pages/LoginPage';
import { DashboardPage } from './pages/DashboardPage';
import { QuestionBankPage } from './pages/QuestionBankPage';
import { ExerciseGeneratorPage } from './pages/ExerciseGeneratorPage';
import { ExamGeneratorPage } from './pages/ExamGeneratorPage';
import { OCRGradingPage } from './pages/OCRGradingPage';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { AdminDashboard } from './pages/AdminDashboard';
import { ManagerDashboard } from './pages/ManagerDashboard';
import { StaffDashboard } from './pages/StaffDashboard';
import { NotFoundPage } from './pages/NotFoundPage';
import { AppLayout } from './layouts/AppLayout';

export const router = createBrowserRouter([
  {
    path: '/login',
    Component: LoginPage,
  },
  {
    path: '/',
    Component: AppLayout,
    children: [
      {
        index: true,
        element: <Navigate to="/login" replace />,
      },
      // Teacher routes (default user)
      {
        path: 'dashboard',
        Component: DashboardPage,
      },
      {
        path: 'questions',
        Component: QuestionBankPage,
      },
      {
        path: 'exercise-generator',
        Component: ExerciseGeneratorPage,
      },
      {
        path: 'exam-generator',
        Component: ExamGeneratorPage,
      },
      {
        path: 'ocr-grading',
        Component: OCRGradingPage,
      },
      {
        path: 'analytics',
        Component: AnalyticsPage,
      },
      // Admin routes
      {
        path: 'admin',
        Component: AdminDashboard,
      },
      {
        path: 'admin/users',
        element: <div className="p-8"><h1 className="text-2xl font-semibold">User Management (Coming Soon)</h1></div>,
      },
      {
        path: 'admin/settings',
        element: <div className="p-8"><h1 className="text-2xl font-semibold">System Settings (Coming Soon)</h1></div>,
      },
      {
        path: 'admin/revenue',
        element: <div className="p-8"><h1 className="text-2xl font-semibold">Revenue Management (Coming Soon)</h1></div>,
      },
      // Manager routes
      {
        path: 'manager',
        Component: ManagerDashboard,
      },
      {
        path: 'manager/subscriptions',
        element: <div className="p-8"><h1 className="text-2xl font-semibold">Subscription Management (Coming Soon)</h1></div>,
      },
      {
        path: 'manager/orders',
        element: <div className="p-8"><h1 className="text-2xl font-semibold">Order Management (Coming Soon)</h1></div>,
      },
      {
        path: 'manager/approvals',
        element: <div className="p-8"><h1 className="text-2xl font-semibold">Content Approvals (Coming Soon)</h1></div>,
      },
      // Staff routes
      {
        path: 'staff',
        Component: StaffDashboard,
      },
      {
        path: 'staff/lesson-plans',
        element: <div className="p-8"><h1 className="text-2xl font-semibold">Lesson Plans (Coming Soon)</h1></div>,
      },
      {
        path: 'staff/templates',
        element: <div className="p-8"><h1 className="text-2xl font-semibold">AI Templates (Coming Soon)</h1></div>,
      },
      // 404 catch-all
      {
        path: '*',
        Component: NotFoundPage,
      },
    ],
  },
]);