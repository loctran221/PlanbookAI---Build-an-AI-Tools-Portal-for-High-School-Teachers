import { StatsCard } from '../components/StatsCard';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { Badge } from '../components/ui/badge';
import { Users, DollarSign, Package, TrendingUp, MoreVertical } from 'lucide-react';
import { adminDashboardStats, mockUsers } from '../data/mockData';

export function AdminDashboard() {
  const recentUsers = [
    { id: '5', name: 'Dr. Michael Brown', email: 'm.brown@school.edu', role: 'teacher', status: 'active', joinedDate: '2024-03-18' },
    { id: '6', name: 'Jessica Taylor', email: 'j.taylor@school.edu', role: 'teacher', status: 'active', joinedDate: '2024-03-17' },
    { id: '7', name: 'Robert Wilson', email: 'r.wilson@school.edu', role: 'staff', status: 'pending', joinedDate: '2024-03-16' },
    { id: '8', name: 'Lisa Anderson', email: 'l.anderson@school.edu', role: 'manager', status: 'active', joinedDate: '2024-03-15' },
  ];

  const systemActivity = [
    { action: 'New user registered', user: 'Dr. Michael Brown', timestamp: '2 hours ago', type: 'user' },
    { action: 'Subscription renewed', user: 'Lincoln High School', timestamp: '5 hours ago', type: 'subscription' },
    { action: 'Question bank updated', user: 'Staff User', timestamp: '1 day ago', type: 'content' },
    { action: 'System backup completed', user: 'System', timestamp: '1 day ago', type: 'system' },
  ];

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-semibold mb-2">Admin Dashboard</h1>
        <p className="text-muted-foreground">System overview and management</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatsCard
          title="Total Users"
          value={adminDashboardStats.totalUsers || 0}
          icon={Users}
          trend={{ value: 12, isPositive: true }}
        />
        <StatsCard
          title="Active Subscriptions"
          value={adminDashboardStats.activeSubscriptions || 0}
          icon={Package}
          trend={{ value: 8, isPositive: true }}
        />
        <StatsCard
          title="Monthly Revenue"
          value={`$${adminDashboardStats.totalRevenue?.toLocaleString() || 0}`}
          icon={DollarSign}
          trend={{ value: 15, isPositive: true }}
        />
        <StatsCard
          title="Total Questions"
          value={adminDashboardStats.totalQuestions}
          icon={TrendingUp}
          trend={{ value: 5, isPositive: true }}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Users */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Recent Users</CardTitle>
              <Button variant="outline" size="sm">View All</Button>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Joined</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">{user.name}</TableCell>
                      <TableCell className="text-muted-foreground">{user.email}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="capitalize">{user.role}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={user.status === 'active' ? 'default' : 'secondary'}>
                          {user.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground">{user.joinedDate}</TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>

        {/* System Activity */}
        <Card>
          <CardHeader>
            <CardTitle>System Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {systemActivity.map((activity, index) => (
                <div key={index} className="flex gap-3">
                  <div className={`w-2 h-2 rounded-full mt-2 ${
                    activity.type === 'user' ? 'bg-blue-500' :
                    activity.type === 'subscription' ? 'bg-green-500' :
                    activity.type === 'content' ? 'bg-purple-500' :
                    'bg-gray-500'
                  }`} />
                  <div className="flex-1">
                    <p className="text-sm font-medium">{activity.action}</p>
                    <p className="text-xs text-muted-foreground">{activity.user}</p>
                    <p className="text-xs text-muted-foreground">{activity.timestamp}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
