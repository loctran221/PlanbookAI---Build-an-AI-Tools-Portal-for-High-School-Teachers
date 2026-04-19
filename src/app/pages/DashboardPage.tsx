import { Link } from 'react-router';
import { useAuth } from '../contexts/AuthContext';
import { StatsCard } from '../components/StatsCard';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { 
  BookOpen, 
  FileText, 
  ClipboardList, 
  ScanLine, 
  Users, 
  TrendingUp,
  Plus,
  ArrowRight,
  Clock
} from 'lucide-react';
import { teacherDashboardStats, mockAnalyticsData } from '../data/mockData';
import { formatDistanceToNow } from 'date-fns';

export function DashboardPage() {
  const { user } = useAuth();

  const quickActions = [
    {
      title: 'Generate Exercise',
      description: 'Create AI-powered exercises instantly',
      icon: FileText,
      href: '/exercise-generator',
      color: 'bg-blue-50 text-blue-600',
    },
    {
      title: 'Create Exam',
      description: 'Build multiple choice exams',
      icon: ClipboardList,
      href: '/exam-generator',
      color: 'bg-purple-50 text-purple-600',
    },
    {
      title: 'Grade Papers',
      description: 'Use OCR for automatic grading',
      icon: ScanLine,
      href: '/ocr-grading',
      color: 'bg-green-50 text-green-600',
    },
    {
      title: 'Question Bank',
      description: 'Manage your questions',
      icon: BookOpen,
      href: '/questions',
      color: 'bg-orange-50 text-orange-600',
    },
  ];

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-semibold mb-2">Welcome back, {user?.name?.split(' ')[0]}!</h1>
        <p className="text-muted-foreground">Here's what's happening with your chemistry classes today.</p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatsCard
          title="Total Questions"
          value={teacherDashboardStats.totalQuestions}
          icon={BookOpen}
          trend={{ value: 12, isPositive: true }}
        />
        <StatsCard
          title="Active Students"
          value={teacherDashboardStats.activeStudents || 0}
          icon={Users}
          trend={{ value: 8, isPositive: true }}
        />
        <StatsCard
          title="Exams Created"
          value={teacherDashboardStats.totalExams}
          icon={ClipboardList}
          trend={{ value: 5, isPositive: true }}
        />
        <StatsCard
          title="Average Score"
          value={`${teacherDashboardStats.averageScore}%`}
          icon={TrendingUp}
          trend={{ value: 3.2, isPositive: true }}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Actions */}
        <div className="lg:col-span-2">
          <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            {quickActions.map((action) => (
              <Link key={action.title} to={action.href}>
                <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
                  <CardContent className="p-6">
                    <div className={`w-12 h-12 ${action.color} rounded-lg flex items-center justify-center mb-4`}>
                      <action.icon className="w-6 h-6" />
                    </div>
                    <h3 className="font-semibold mb-1">{action.title}</h3>
                    <p className="text-sm text-muted-foreground mb-3">{action.description}</p>
                    <div className="flex items-center text-sm text-indigo-600">
                      Get started <ArrowRight className="ml-1 w-4 h-4" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockAnalyticsData.recentActivity.slice(0, 5).map((activity) => {
                  const icons = {
                    exam: ClipboardList,
                    exercise: FileText,
                    grading: ScanLine,
                  };
                  const colors = {
                    exam: 'text-purple-600 bg-purple-50',
                    exercise: 'text-blue-600 bg-blue-50',
                    grading: 'text-green-600 bg-green-50',
                  };
                  const Icon = icons[activity.type];
                  
                  return (
                    <div key={activity.id} className="flex items-start gap-3">
                      <div className={`p-2 rounded-lg ${colors[activity.type]}`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">{activity.title}</p>
                        <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                          <Clock className="w-3 h-3" />
                          {formatDistanceToNow(new Date(activity.timestamp), { addSuffix: true })}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Top Performing Students */}
          <Card>
            <CardHeader>
              <CardTitle>Top Students</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {mockAnalyticsData.studentPerformance.slice(0, 5).map((student, index) => (
                  <div key={student.studentId} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center text-sm font-medium text-indigo-700">
                        {index + 1}
                      </div>
                      <div>
                        <p className="text-sm font-medium">{student.studentName}</p>
                        <p className="text-xs text-muted-foreground">{student.totalExams} exams</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold">{student.averageScore.toFixed(1)}%</p>
                      {student.trend === 'up' && (
                        <p className="text-xs text-green-600">↑ Trending</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              <Link to="/analytics">
                <Button variant="ghost" className="w-full mt-4" size="sm">
                  View All Analytics <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Topics Overview */}
          <Card>
            <CardHeader>
              <CardTitle>Topic Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {mockAnalyticsData.topicPerformance.slice(0, 4).map((topic) => (
                  <div key={topic.topic}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="font-medium">{topic.topic}</span>
                      <span className="text-muted-foreground">{topic.averageScore.toFixed(0)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-indigo-600 h-2 rounded-full"
                        style={{ width: `${topic.averageScore}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
