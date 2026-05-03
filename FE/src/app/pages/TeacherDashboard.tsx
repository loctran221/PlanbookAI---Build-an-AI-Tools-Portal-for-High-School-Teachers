import { Link } from "react-router-dom";
import {
  BookOpen,
  Wand2,
  FileText,
  ScanLine,
  TrendingUp,
  Clock,
  CheckCircle2,
  Users,
} from "lucide-react";
import { useState, useEffect } from "react";
import { StatCard } from "../components/StatCard";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts";
import apiClient from "../../api/apiClient";

export default function TeacherDashboard() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    apiClient.get("/api/v1/analytics/teacher").then(res => {
      setData(res.data);
    }).catch(console.error);
  }, []);

  if (!data) return <div className="p-8 text-center text-gray-500">Đang tải dữ liệu...</div>;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-1 text-gray-600">
          Welcome back! Here's what's happening with your classes.
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Questions"
          value={data.totalQuestions || 0}
          icon={BookOpen}
        />
        <StatCard
          title="Exams Created"
          value={data.examsCreated || 0}
          icon={FileText}
        />
        <StatCard
          title="Avg. Class Score"
          value={`${data.avgClassScore || 0}%`}
          icon={TrendingUp}
        />
        <StatCard
          title="Students Graded"
          value={data.totalStudents || 0}
          icon={Users}
        />
      </div>

      {/* Charts Row */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Performance Trend */}
        <Card>
          <CardHeader>
            <CardTitle>Class Performance Trend</CardTitle>
            <CardDescription>Average scores over the past 4 weeks</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={data.performanceData || []}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200" />
                <XAxis dataKey="week" className="text-xs" />
                <YAxis className="text-xs" />
                <Tooltip />
                <Line type="monotone" dataKey="score" stroke="#4f46e5" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Topic Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Questions by Topic</CardTitle>
            <CardDescription>Distribution of questions in your bank</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={data.topicDistribution || []}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200" />
                <XAxis dataKey="topic" className="text-xs" />
                <YAxis className="text-xs" />
                <Tooltip />
                <Bar dataKey="count" fill="#06b6d4" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Recent Exams */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Recent Exams</CardTitle>
              <CardDescription>Your latest exam activities</CardDescription>
            </div>
            <Link to="/teacher/analytics">
              <Button variant="outline" size="sm">View All</Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {(data.recentExams || []).length === 0 ? (
              <div className="text-center py-6 text-gray-500">Chưa có đề thi nào.</div>
            ) : (data.recentExams || []).map((exam: any) => (
              <div
                key={exam.id}
                className="flex items-center justify-between p-4 rounded-lg border bg-white hover:bg-gray-50 transition-colors"
              >
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900">{exam.title}</h4>
                  <div className="flex items-center gap-4 mt-1 text-sm text-gray-600">
                    <span className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {exam.date}
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      {exam.students} students
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <p className="text-sm text-gray-600">Graded</p>
                    <p className="font-semibold text-gray-900">
                      {exam.graded}/{exam.students}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600">Avg. Score</p>
                    <p className="text-2xl font-bold text-indigo-600">{exam.avgScore}%</p>
                  </div>
                  {exam.graded > 0 && exam.graded >= exam.students ? (
                    <Badge className="bg-green-50 text-green-700 hover:bg-green-50">
                      <CheckCircle2 className="mr-1 h-3 w-3" />
                      Complete
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="text-orange-600 border-orange-200">
                      Pending
                    </Badge>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
