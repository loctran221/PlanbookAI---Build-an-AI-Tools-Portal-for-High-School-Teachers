import { createBrowserRouter, Outlet } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import ExerciseGenerator from "./pages/ExerciseGenerator";
import OCRGrading from "./pages/OCRGrading";
import DashboardLayout from "./components/DashboardLayout";
import GenericManager from "./pages/GenericManager";
import RouteErrorPage from "./pages/RouteErrorPage";

// Dashboards
import AdminDashboard from "./pages/AdminDashboard";
import ManagerDashboard from "./pages/ManagerDashboard";
import TeacherDashboard from "./pages/TeacherDashboard";
import StaffDashboard from "./pages/StaffDashboard";
import ClassManager from "./pages/ClassManager";
import ExamGenerator from "./pages/ExamGenerator";
import Workspace from "./pages/Workspace";
import QuestionBank from "./pages/QuestionBank";
import Analytics from "./pages/Analytics";

export const router = createBrowserRouter([
  {
    element: <Outlet />,
    errorElement: <RouteErrorPage />,
    children: [
      { index: true, element: <LoginPage /> },
      { path: "login", element: <LoginPage /> },
  {
    path: "/teacher",
    element: <DashboardLayout />,
    children: [
      { index: true, element: <TeacherDashboard /> },
      { path: "workspace", element: <Workspace /> },
      { path: "classes", element: <ClassManager /> },
      { path: "question-bank", element: <QuestionBank /> },
      { path: "exercise-generator", element: <ExerciseGenerator /> },
      { path: "exam-generator", element: <ExamGenerator /> },
      { path: "ocr-grading", element: <OCRGrading /> },
      { path: "analytics", element: <Analytics /> },
    ],
  },
  {
    path: "/admin",
    element: <DashboardLayout />,
    children: [
      { index: true, element: <AdminDashboard /> },
    ],
  },
  {
    path: "/manager",
    element: <DashboardLayout />,
    children: [
      { index: true, element: <ManagerDashboard /> },
    ],
  },
  {
    path: "/staff",
    element: <DashboardLayout />,
    children: [
      { index: true, element: <StaffDashboard /> },
      { path: "prompts", element: <GenericManager title="Quản lý Prompt Staff" endpoint="/prompt-staff" /> },
    ],
  },
      { path: "*", element: <LoginPage /> },
    ],
  },
]);