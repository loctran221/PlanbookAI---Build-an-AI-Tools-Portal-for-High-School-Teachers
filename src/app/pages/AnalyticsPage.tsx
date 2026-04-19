import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { mockAnalyticsData, mockGradingResults } from '../data/mockData';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, TrendingDown, Minus, Users, Target, Award } from 'lucide-react';
import { Badge } from '../components/ui/badge';

export function AnalyticsPage() {
  const studentData = mockAnalyticsData.studentPerformance.map(s => ({
    name: s.studentName.split(' ').map(n => n[0]).join(''),
    score: s.averageScore,
  }));

  const topicData = mockAnalyticsData.topicPerformance.map(t => ({
    name: t.topic.split(' ').slice(0, 2).join(' '),
    performance: t.averageScore,
    questions: t.questionsCount,
  }));

  const scoreDistribution = [
    { range: '90-100', count: mockGradingResults.filter(r => r.percentage >= 90).length },
    { range: '80-89', count: mockGradingResults.filter(r => r.percentage >= 80 && r.percentage < 90).length },
    { range: '70-79', count: mockGradingResults.filter(r => r.percentage >= 70 && r.percentage < 80).length },
    { range: '60-69', count: mockGradingResults.filter(r => r.percentage >= 60 && r.percentage < 70).length },
    { range: 'Below 60', count: mockGradingResults.filter(r => r.percentage < 60).length },
  ];

  const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#6b7280'];

  const averageScore = mockGradingResults.reduce((sum, r) => sum + r.percentage, 0) / mockGradingResults.length;
  const highestScore = Math.max(...mockGradingResults.map(r => r.percentage));
  const lowestScore = Math.min(...mockGradingResults.map(r => r.percentage));

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-semibold mb-2">Analytics & Insights</h1>
          <p className="text-muted-foreground">Track student performance and identify areas for improvement</p>
        </div>
        <Select defaultValue="all">
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Time period" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Time</SelectItem>
            <SelectItem value="month">This Month</SelectItem>
            <SelectItem value="week">This Week</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Average Score</p>
                <h3 className="text-2xl font-semibold mb-1">{averageScore.toFixed(1)}%</h3>
                <div className="flex items-center text-xs text-green-600">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  <span>+5.2% from last period</span>
                </div>
              </div>
              <div className="p-3 bg-blue-50 rounded-lg">
                <Target className="w-5 h-5 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Total Students</p>
                <h3 className="text-2xl font-semibold mb-1">{mockAnalyticsData.studentPerformance.length}</h3>
                <div className="flex items-center text-xs text-green-600">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  <span>3 new this week</span>
                </div>
              </div>
              <div className="p-3 bg-indigo-50 rounded-lg">
                <Users className="w-5 h-5 text-indigo-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Highest Score</p>
                <h3 className="text-2xl font-semibold mb-1">{highestScore.toFixed(1)}%</h3>
                <p className="text-xs text-muted-foreground">Emily Davis</p>
              </div>
              <div className="p-3 bg-green-50 rounded-lg">
                <Award className="w-5 h-5 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Total Exams</p>
                <h3 className="text-2xl font-semibold mb-1">{mockGradingResults.length}</h3>
                <div className="flex items-center text-xs text-gray-600">
                  <Minus className="w-3 h-3 mr-1" />
                  <span>Stable</span>
                </div>
              </div>
              <div className="p-3 bg-purple-50 rounded-lg">
                <TrendingUp className="w-5 h-5 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <Tabs defaultValue="students" className="space-y-6">
        <TabsList>
          <TabsTrigger value="students">Student Performance</TabsTrigger>
          <TabsTrigger value="topics">Topic Analysis</TabsTrigger>
          <TabsTrigger value="distribution">Score Distribution</TabsTrigger>
        </TabsList>

        <TabsContent value="students" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Student Performance Overview</CardTitle>
                <CardDescription>Average scores across all students</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={studentData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis domain={[0, 100]} />
                    <Tooltip />
                    <Bar dataKey="score" fill="#6366f1" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Top Performers</CardTitle>
                <CardDescription>Students with highest scores</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockAnalyticsData.studentPerformance
                    .sort((a, b) => b.averageScore - a.averageScore)
                    .slice(0, 5)
                    .map((student, index) => (
                      <div key={student.studentId} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                            index === 0 ? 'bg-yellow-100 text-yellow-700' :
                            index === 1 ? 'bg-gray-100 text-gray-700' :
                            index === 2 ? 'bg-orange-100 text-orange-700' :
                            'bg-blue-100 text-blue-700'
                          }`}>
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
                            <TrendingUp className="w-4 h-4 text-green-600 ml-auto" />
                          )}
                          {student.trend === 'down' && (
                            <TrendingDown className="w-4 h-4 text-red-600 ml-auto" />
                          )}
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="topics" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Performance by Topic</CardTitle>
                <CardDescription>Average scores for each chemistry topic</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={350}>
                  <BarChart data={topicData} layout="horizontal">
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" domain={[0, 100]} />
                    <YAxis dataKey="name" type="category" width={100} />
                    <Tooltip />
                    <Bar dataKey="performance" fill="#10b981" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Topic Insights</CardTitle>
                <CardDescription>Areas needing attention</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockAnalyticsData.topicPerformance
                    .sort((a, b) => a.averageScore - b.averageScore)
                    .slice(0, 6)
                    .map((topic) => (
                      <div key={topic.topic}>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm font-medium">{topic.topic}</span>
                          <Badge 
                            variant={topic.averageScore >= 80 ? 'default' : topic.averageScore >= 70 ? 'secondary' : 'destructive'}
                            className="text-xs"
                          >
                            {topic.averageScore.toFixed(0)}%
                          </Badge>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full ${
                              topic.averageScore >= 80 ? 'bg-green-600' :
                              topic.averageScore >= 70 ? 'bg-yellow-600' :
                              'bg-red-600'
                            }`}
                            style={{ width: `${topic.averageScore}%` }}
                          />
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                          {topic.questionsCount} questions
                        </p>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="distribution" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Score Distribution</CardTitle>
                <CardDescription>How students are performing overall</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={scoreDistribution}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ range, count }) => `${range}: ${count}`}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="count"
                    >
                      {scoreDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Grade Breakdown</CardTitle>
                <CardDescription>Number of students in each grade range</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {scoreDistribution.map((item, index) => (
                    <div key={item.range} className="flex items-center gap-4">
                      <div 
                        className="w-4 h-4 rounded" 
                        style={{ backgroundColor: COLORS[index] }}
                      />
                      <div className="flex-1">
                        <div className="flex justify-between mb-1">
                          <span className="text-sm font-medium">{item.range}%</span>
                          <span className="text-sm text-muted-foreground">{item.count} students</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="h-2 rounded-full"
                            style={{ 
                              width: `${(item.count / mockGradingResults.length) * 100}%`,
                              backgroundColor: COLORS[index]
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
