import { Package, ShoppingCart, CheckCircle, Clock, DollarSign, TrendingUp } from "lucide-react";
import { StatCard } from "../components/StatCard";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";
import { Progress } from "../components/ui/progress";

// Mock data
const subscriptionPlans = [
  { name: "Basic", users: 45, revenue: 4500, growth: 12 },
  { name: "Pro", users: 78, revenue: 15600, growth: 24 },
  { name: "Enterprise", users: 33, revenue: 16500, growth: 8 },
];

const recentOrders = [
  {
    id: "ORD-1234",
    customer: "Lincoln High School",
    plan: "Enterprise",
    amount: 500,
    status: "Active",
    date: "2026-03-18",
  },
  {
    id: "ORD-1233",
    customer: "Madison Academy",
    plan: "Pro",
    amount: 200,
    status: "Pending",
    date: "2026-03-17",
  },
  {
    id: "ORD-1232",
    customer: "Washington College",
    plan: "Pro",
    amount: 200,
    status: "Active",
    date: "2026-03-15",
  },
  {
    id: "ORD-1231",
    customer: "Roosevelt Institute",
    plan: "Basic",
    amount: 100,
    status: "Active",
    date: "2026-03-14",
  },
  {
    id: "ORD-1230",
    customer: "Jefferson School",
    plan: "Enterprise",
    amount: 500,
    status: "Expired",
    date: "2026-03-12",
  },
];

const contentApproval = [
  {
    id: 1,
    title: "Organic Chemistry - Advanced Questions",
    submitter: "James Williams",
    type: "Question Bank",
    items: 45,
    status: "Pending",
    date: "2026-03-19",
  },
  {
    id: 2,
    title: "Thermodynamics Lesson Plans",
    submitter: "Sarah Johnson",
    type: "Lesson Plan",
    items: 12,
    status: "Pending",
    date: "2026-03-18",
  },
  {
    id: 3,
    title: "Chemical Bonding Templates",
    submitter: "Michael Chen",
    type: "Template",
    items: 8,
    status: "Approved",
    date: "2026-03-17",
  },
];

import { useState, useEffect } from "react";
import { api } from "../lib/auth";

export default function ManagerDashboard() {
  const [pendingContents, setPendingContents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPending();
  }, []);

  const fetchPending = async () => {
    try {
      const res: any = await api.get("/api/manager/pending-contents");
      const formatted: any[] = [];
      
      if (res.pendingQuestions) {
        res.pendingQuestions.forEach((q: any) => {
          formatted.push({
            id: q.questionId,
            title: "Question: " + (q.content ? q.content.substring(0, 50) + "..." : "Untitled"),
            submitter: q.createdBy?.fullName || q.createdBy?.email || "Unknown",
            type: "QUESTION",
            status: q.status || "PENDING",
            date: new Date(q.createdAt).toLocaleDateString(),
          });
        });
      }

      if (res.pendingTemplates) {
        res.pendingTemplates.forEach((t: any) => {
          formatted.push({
            id: t.lessonPlanTemplateId || t.templateId || t.id,
            title: t.title || "Lesson Plan Template",
            submitter: t.createdBy?.fullName || t.createdBy?.email || "Unknown",
            type: "LESSON_PLAN",
            status: t.status || "PENDING",
            date: new Date(t.createdAt).toLocaleDateString(),
          });
        });
      }
      
      setPendingContents(formatted);
    } catch (err) {
      console.error("Failed to fetch pending contents", err);
    } finally {
      setLoading(false);
    }
  };

  const handleApproveReject = async (id: number, type: string, isApprove: boolean) => {
    try {
      await api.post("/api/approvals", {
        contentId: id,
        contentType: type,
        status: isApprove ? "APPROVED" : "REJECTED",
        comment: isApprove ? "Approved by Manager" : "Rejected by Manager"
      });
      // Remove from list
      setPendingContents(prev => prev.filter(item => !(item.id === id && item.type === type)));
    } catch (err: any) {
      alert("Lỗi khi duyệt bài: " + err.message);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Manager Dashboard</h1>
        <p className="mt-1 text-gray-600">
          Manage subscriptions, orders, and content approval
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Revenue"
          value="$36.6K"
          icon={DollarSign}
          trend={{ value: "18%", isPositive: true }}
        />
        <StatCard
          title="Active Subscriptions"
          value="156"
          icon={Package}
          trend={{ value: "12", isPositive: true }}
        />
        <StatCard
          title="Pending Orders"
          value="3"
          icon={ShoppingCart}
          description="Require attention"
        />
        <StatCard
          title="Approval Queue"
          value={pendingContents.length.toString()}
          icon={Clock}
          description="Content pending review"
        />
      </div>

      {/* Content Approval Queue */}
      <Card>
        <CardHeader>
          <CardTitle>Content Approval Queue</CardTitle>
          <CardDescription>Items pending your review</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-gray-500 text-sm">Đang tải dữ liệu...</p>
          ) : pendingContents.length === 0 ? (
            <p className="text-gray-500 text-sm">Hiện tại không có bài nào cần duyệt.</p>
          ) : (
            <div className="space-y-4">
              {pendingContents.map((item, idx) => (
                <div
                  key={`${item.type}-${item.id}-${idx}`}
                  className="flex items-center justify-between p-4 rounded-lg border bg-white"
                >
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-1">{item.title}</h3>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <span>Bởi: {item.submitter}</span>
                      <Badge variant="outline">{item.type}</Badge>
                      <span>{item.date}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      onClick={() => handleApproveReject(item.id, item.type, false)}
                    >
                      Từ chối
                    </Button>
                    <Button 
                      size="sm" 
                      className="bg-green-600 hover:bg-green-700 text-white"
                      onClick={() => handleApproveReject(item.id, item.type, true)}
                    >
                      <CheckCircle className="mr-1 h-4 w-4" />
                      Duyệt
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Subscription Plans Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Subscription Plans Performance</CardTitle>
          <CardDescription>Active users and revenue by plan</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {subscriptionPlans.map((plan) => (
              <div
                key={plan.name}
                className="flex items-center justify-between p-4 rounded-lg border bg-white"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-semibold text-gray-900">{plan.name}</h3>
                    <Badge variant="outline" className="text-indigo-600 border-indigo-200">
                      {plan.users} users
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <Progress value={(plan.users / 156) * 100} className="h-2 flex-1" />
                    <span className="text-sm text-gray-600">
                      {Math.round((plan.users / 156) * 100)}%
                    </span>
                  </div>
                </div>
                <div className="text-right ml-6">
                  <p className="text-sm text-gray-600">Revenue</p>
                  <p className="text-2xl font-bold text-gray-900">
                    ${(plan.revenue / 1000).toFixed(1)}K
                  </p>
                  <p className="text-xs text-green-600">+{plan.growth}% growth</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Orders */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Recent Orders</CardTitle>
              <CardDescription>Latest subscription orders</CardDescription>
            </div>
            <Button variant="outline" size="sm">View All</Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Plan</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentOrders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">{order.id}</TableCell>
                  <TableCell>{order.customer}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="text-indigo-600 border-indigo-200">
                      {order.plan}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-semibold">${order.amount}</TableCell>
                  <TableCell>
                    {order.status === "Active" ? (
                      <Badge className="bg-green-50 text-green-700">
                        <CheckCircle className="mr-1 h-3 w-3" />
                        Active
                      </Badge>
                    ) : order.status === "Pending" ? (
                      <Badge className="bg-yellow-50 text-yellow-700">
                        <Clock className="mr-1 h-3 w-3" />
                        Pending
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="text-gray-600">
                        Expired
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-gray-600">{order.date}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="outline" size="sm">
                      Manage
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

    </div>
  );
}
