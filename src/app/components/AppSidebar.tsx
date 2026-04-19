import { Link, useLocation } from 'react-router';
import { useAuth } from '../contexts/AuthContext';
import { 
  LayoutDashboard, 
  BookOpen, 
  FileText, 
  ClipboardList, 
  ScanLine, 
  BarChart3, 
  Users, 
  Settings,
  Package,
  ShoppingCart,
  FileCode,
  LogOut,
  GraduationCap
} from 'lucide-react';
import { Button } from './ui/button';
import { Separator } from './ui/separator';

const navigationByRole = {
  teacher: [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Question Bank', href: '/questions', icon: BookOpen },
    { name: 'Exercise Generator', href: '/exercise-generator', icon: FileText },
    { name: 'Exam Generator', href: '/exam-generator', icon: ClipboardList },
    { name: 'OCR Grading', href: '/ocr-grading', icon: ScanLine },
    { name: 'Analytics', href: '/analytics', icon: BarChart3 },
  ],
  admin: [
    { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { name: 'User Management', href: '/admin/users', icon: Users },
    { name: 'System Settings', href: '/admin/settings', icon: Settings },
    { name: 'Revenue', href: '/admin/revenue', icon: BarChart3 },
  ],
  manager: [
    { name: 'Dashboard', href: '/manager', icon: LayoutDashboard },
    { name: 'Subscriptions', href: '/manager/subscriptions', icon: Package },
    { name: 'Orders', href: '/manager/orders', icon: ShoppingCart },
    { name: 'Content Approval', href: '/manager/approvals', icon: FileCode },
  ],
  staff: [
    { name: 'Dashboard', href: '/staff', icon: LayoutDashboard },
    { name: 'Lesson Plans', href: '/staff/lesson-plans', icon: FileText },
    { name: 'Question Bank', href: '/questions', icon: BookOpen },
    { name: 'Templates', href: '/staff/templates', icon: FileCode },
  ],
};

export function AppSidebar() {
  const { user, logout } = useAuth();
  const location = useLocation();

  if (!user) return null;

  const navigation = navigationByRole[user.role] || navigationByRole.teacher;

  return (
    <aside className="w-64 border-r bg-white flex flex-col h-screen">
      {/* Logo */}
      <div className="p-6 border-b">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-indigo-600 to-cyan-500 rounded-lg flex items-center justify-center">
            <GraduationCap className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="font-semibold text-lg">PlanbookAI</h1>
            <p className="text-xs text-muted-foreground">Chemistry Edition</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 overflow-y-auto">
        <div className="space-y-1">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Link key={item.name} to={item.href}>
                <Button
                  variant={isActive ? 'secondary' : 'ghost'}
                  className={`w-full justify-start ${
                    isActive ? 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100' : ''
                  }`}
                >
                  <item.icon className="mr-3 h-4 w-4" />
                  {item.name}
                </Button>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* User Profile */}
      <div className="p-4 border-t">
        <div className="mb-3">
          <p className="text-sm font-medium">{user.name}</p>
          <p className="text-xs text-muted-foreground">{user.email}</p>
          <p className="text-xs text-indigo-600 mt-1 capitalize">{user.role}</p>
        </div>
        <Button
          variant="outline"
          className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
          onClick={logout}
        >
          <LogOut className="mr-2 h-4 w-4" />
          Logout
        </Button>
      </div>
    </aside>
  );
}
