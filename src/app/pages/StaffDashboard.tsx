import { StatsCard } from '../components/StatsCard';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { FileText, BookOpen, FileCode, Plus } from 'lucide-react';
import { staffDashboardStats } from '../data/mockData';

export function StaffDashboard() {
  const recentWork = [
    { id: '1', type: 'Lesson Plan', title: 'Introduction to Atomic Structure', status: 'approved', date: '2024-03-18' },
    { id: '2', type: 'Question Set', title: 'Chemical Bonding Quiz Questions', status: 'pending', date: '2024-03-17' },
    { id: '3', type: 'Template', title: 'Lab Report Template', status: 'approved', date: '2024-03-16' },
    { id: '4', type: 'Lesson Plan', title: 'Periodic Table Trends', status: 'draft', date: '2024-03-15' },
  ];

  const quickActions = [
    { title: 'Create Lesson Plan', description: 'Design a new lesson plan', icon: FileText, action: '/staff/lesson-plans', color: 'bg-blue-50 text-blue-600' },
    { title: 'Add Questions', description: 'Build question bank', icon: BookOpen, action: '/questions', color: 'bg-green-50 text-green-600' },
    { title: 'Create Template', description: 'Design AI prompt template', icon: FileCode, action: '/staff/templates', color: 'bg-purple-50 text-purple-600' },
  ];

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-semibold mb-2">Staff Dashboard</h1>
        <p className="text-muted-foreground">Create and manage educational content</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatsCard
          title="Lesson Plans Created"
          value={12}
          icon={FileText}
          trend={{ value: 3, isPositive: true }}
        />
        <StatsCard
          title="Questions Added"
          value={staffDashboardStats.totalQuestions}
          icon={BookOpen}
          trend={{ value: 8, isPositive: true }}
        />
        <StatsCard
          title="Templates"
          value={8}
          icon={FileCode}
        />
        <StatsCard
          title="Pending Approvals"
          value={4}
          icon={FileText}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Actions */}
        <div className="lg:col-span-2">
          <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            {quickActions.map((action) => (
              <Card key={action.title} className="hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="p-6">
                  <div className={`w-12 h-12 ${action.color} rounded-lg flex items-center justify-center mb-4`}>
                    <action.icon className="w-6 h-6" />
                  </div>
                  <h3 className="font-semibold mb-1">{action.title}</h3>
                  <p className="text-sm text-muted-foreground mb-3">{action.description}</p>
                  <Button size="sm" variant="outline" className="w-full">
                    <Plus className="mr-2 h-4 w-4" /> Create
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Recent Work */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Work</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentWork.map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-medium text-muted-foreground">{item.type}</span>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${
                          item.status === 'approved' ? 'bg-green-100 text-green-700' :
                          item.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-gray-100 text-gray-700'
                        }`}>
                          {item.status}
                        </span>
                      </div>
                      <h4 className="font-medium text-sm">{item.title}</h4>
                      <p className="text-xs text-muted-foreground mt-1">{item.date}</p>
                    </div>
                    <Button variant="ghost" size="sm">Edit</Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Guidelines */}
        <Card>
          <CardHeader>
            <CardTitle>Content Guidelines</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground space-y-3">
            <div>
              <h4 className="font-medium text-foreground mb-1">Lesson Plans</h4>
              <p>Follow curriculum standards and include learning objectives, activities, and assessments.</p>
            </div>
            <div>
              <h4 className="font-medium text-foreground mb-1">Questions</h4>
              <p>Ensure accuracy, provide explanations, and tag appropriately for easy discovery.</p>
            </div>
            <div>
              <h4 className="font-medium text-foreground mb-1">Templates</h4>
              <p>Create reusable AI prompts that are clear, specific, and aligned with teaching goals.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
