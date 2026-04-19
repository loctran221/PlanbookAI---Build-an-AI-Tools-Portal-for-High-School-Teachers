import { StatsCard } from '../components/StatsCard';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { Badge } from '../components/ui/badge';
import { Package, ShoppingCart, FileCheck, Clock } from 'lucide-react';
import { managerDashboardStats } from '../data/mockData';

export function ManagerDashboard() {
  const pendingOrders = [
    { id: 'ORD-001', customer: 'Lincoln High School', package: 'Enterprise', amount: 2499, status: 'pending' },
    { id: 'ORD-002', customer: 'Washington Academy', package: 'Professional', amount: 999, status: 'pending' },
    { id: 'ORD-003', customer: 'Jefferson School', package: 'Basic', amount: 299, status: 'processing' },
  ];

  const pendingApprovals = [
    { id: '1', type: 'Question Bank', title: 'Organic Chemistry Questions Set', submittedBy: 'Staff User', date: '2024-03-18' },
    { id: '2', type: 'Lesson Plan', title: 'Chemical Reactions Module', submittedBy: 'Staff User', date: '2024-03-17' },
    { id: '3', type: 'Exercise', title: 'Stoichiometry Practice Set', submittedBy: 'Dr. Sarah Johnson', date: '2024-03-16' },
  ];

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-semibold mb-2">Manager Dashboard</h1>
        <p className="text-muted-foreground">Manage subscriptions, orders, and content approvals</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatsCard
          title="Pending Approvals"
          value={managerDashboardStats.pendingApprovals || 0}
          icon={FileCheck}
          className="border-orange-200 bg-orange-50"
        />
        <StatsCard
          title="Active Orders"
          value={managerDashboardStats.activeOrders || 0}
          icon={ShoppingCart}
          trend={{ value: 20, isPositive: true }}
        />
        <StatsCard
          title="Total Subscriptions"
          value={42}
          icon={Package}
          trend={{ value: 15, isPositive: true }}
        />
        <StatsCard
          title="Pending Tasks"
          value={19}
          icon={Clock}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pending Orders */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Pending Orders</CardTitle>
            <Button variant="outline" size="sm">View All</Button>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order ID</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Package</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pendingOrders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-medium">{order.id}</TableCell>
                    <TableCell>{order.customer}</TableCell>
                    <TableCell>{order.package}</TableCell>
                    <TableCell>${order.amount}</TableCell>
                    <TableCell>
                      <Badge variant={order.status === 'pending' ? 'secondary' : 'default'}>
                        {order.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <div className="mt-4">
              <Button className="w-full bg-indigo-600 hover:bg-indigo-700">
                Process All Orders
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Content Approvals */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Pending Approvals</CardTitle>
            <Badge variant="destructive">{pendingApprovals.length}</Badge>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {pendingApprovals.map((item) => (
                <div key={item.id} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <Badge variant="outline" className="mb-2">{item.type}</Badge>
                      <h4 className="font-medium">{item.title}</h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        By {item.submittedBy} • {item.date}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2 mt-3">
                    <Button size="sm" className="flex-1 bg-green-600 hover:bg-green-700">
                      Approve
                    </Button>
                    <Button size="sm" variant="outline" className="flex-1">
                      Review
                    </Button>
                    <Button size="sm" variant="destructive" className="flex-1">
                      Reject
                    </Button>
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
