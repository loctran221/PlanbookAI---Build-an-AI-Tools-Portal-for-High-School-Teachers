import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Label } from '../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Input } from '../components/ui/input';
import { Upload, ScanLine, CheckCircle2, XCircle, Download } from 'lucide-react';
import { mockExams, mockGradingResults } from '../data/mockData';
import { GradingResult } from '../types';
import { Progress } from '../components/ui/progress';
import { Badge } from '../components/ui/badge';
import { toast } from 'sonner';

export function OCRGradingPage() {
  const [selectedExam, setSelectedExam] = useState('');
  const [studentName, setStudentName] = useState('');
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [processing, setProcessing] = useState(false);
  const [gradingResult, setGradingResult] = useState<GradingResult | null>(null);
  const [recentGradings, setRecentGradings] = useState(mockGradingResults);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedFile(file);
      toast.success('Answer sheet uploaded successfully');
    }
  };

  const handleGrade = async () => {
    if (!selectedExam) {
      toast.error('Please select an exam');
      return;
    }
    if (!studentName.trim()) {
      toast.error('Please enter student name');
      return;
    }
    if (!uploadedFile) {
      toast.error('Please upload an answer sheet');
      return;
    }

    setProcessing(true);
    
    // Simulate OCR processing
    await new Promise(resolve => setTimeout(resolve, 3000));

    // Mock grading result
    const exam = mockExams.find(e => e.id === selectedExam);
    const result: GradingResult = {
      id: `gr_${Date.now()}`,
      studentName: studentName,
      studentId: `S${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
      examId: selectedExam,
      examTitle: exam?.title || 'Exam',
      score: Math.floor(Math.random() * (exam?.totalPoints || 10)) + 1,
      totalPoints: exam?.totalPoints || 10,
      percentage: 0,
      answers: exam?.questions.map(q => ({
        questionId: q.id,
        studentAnswer: Math.random() > 0.3 ? q.correctAnswer : 'Wrong Answer',
        correctAnswer: q.correctAnswer,
        isCorrect: Math.random() > 0.3,
        points: Math.random() > 0.3 ? q.points : 0,
      })) || [],
      gradedAt: new Date().toISOString(),
      gradedBy: 'Dr. Sarah Johnson',
    };
    result.score = result.answers.reduce((sum, a) => sum + a.points, 0);
    result.percentage = (result.score / result.totalPoints) * 100;

    setGradingResult(result);
    setRecentGradings([result, ...recentGradings]);
    setProcessing(false);
    toast.success('Grading completed!');
  };

  const handleExportResult = () => {
    if (!gradingResult) return;
    toast.success('Grading result exported as PDF!');
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-semibold mb-2">OCR Grading System</h1>
        <p className="text-muted-foreground">Automatically grade scanned answer sheets using OCR technology</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Upload & Grade Panel */}
        <div className="lg:col-span-1 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ScanLine className="w-5 h-5 text-green-600" />
                Upload Answer Sheet
              </CardTitle>
              <CardDescription>Select exam and upload scanned answer sheet</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="exam">Select Exam</Label>
                <Select value={selectedExam} onValueChange={setSelectedExam}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose an exam" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockExams.map((exam) => (
                      <SelectItem key={exam.id} value={exam.id}>
                        {exam.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="studentName">Student Name</Label>
                <Input
                  id="studentName"
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  placeholder="Enter student name"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="file">Answer Sheet (PDF/Image)</Label>
                <div className="border-2 border-dashed rounded-lg p-6 text-center hover:border-indigo-400 transition-colors cursor-pointer">
                  <input
                    id="file"
                    type="file"
                    accept="image/*,.pdf"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  <label htmlFor="file" className="cursor-pointer">
                    <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                    <p className="text-sm font-medium mb-1">
                      {uploadedFile ? uploadedFile.name : 'Click to upload'}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      PDF, JPG, PNG up to 10MB
                    </p>
                  </label>
                </div>
              </div>

              <Button 
                onClick={handleGrade}
                disabled={processing}
                className="w-full bg-green-600 hover:bg-green-700"
              >
                {processing ? (
                  <>
                    <ScanLine className="mr-2 h-4 w-4 animate-pulse" />
                    Processing OCR...
                  </>
                ) : (
                  <>
                    <ScanLine className="mr-2 h-4 w-4" />
                    Grade Answer Sheet
                  </>
                )}
              </Button>

              {gradingResult && (
                <Button 
                  variant="outline" 
                  onClick={handleExportResult}
                  className="w-full"
                >
                  <Download className="mr-2 h-4 w-4" />
                  Export Result
                </Button>
              )}
            </CardContent>
          </Card>

          {/* How it works */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">How OCR Grading Works</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground space-y-2">
              <p>1. Upload a scanned answer sheet (PDF or image)</p>
              <p>2. OCR extracts student answers automatically</p>
              <p>3. AI compares with correct answers</p>
              <p>4. Get instant scoring and detailed results</p>
              <p>5. Export or save results to database</p>
            </CardContent>
          </Card>
        </div>

        {/* Results Panel */}
        <div className="lg:col-span-2 space-y-6">
          {gradingResult ? (
            <>
              {/* Score Summary */}
              <Card className="border-2 border-indigo-200 bg-indigo-50/30">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-2xl">{gradingResult.studentName}</CardTitle>
                      <CardDescription className="text-base mt-1">
                        {gradingResult.examTitle} • Student ID: {gradingResult.studentId}
                      </CardDescription>
                    </div>
                    <div className="text-right">
                      <div className="text-4xl font-bold text-indigo-600">
                        {gradingResult.percentage.toFixed(1)}%
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        {gradingResult.score} / {gradingResult.totalPoints} points
                      </p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Score Progress</span>
                      <span className="font-medium">{gradingResult.score} / {gradingResult.totalPoints}</span>
                    </div>
                    <Progress value={gradingResult.percentage} className="h-3" />
                  </div>
                  <div className="grid grid-cols-3 gap-4 mt-6">
                    <div className="text-center">
                      <p className="text-2xl font-semibold text-green-600">
                        {gradingResult.answers.filter(a => a.isCorrect).length}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">Correct</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-semibold text-red-600">
                        {gradingResult.answers.filter(a => !a.isCorrect).length}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">Incorrect</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-semibold">
                        {gradingResult.answers.length}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">Total</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Detailed Results */}
              <Card>
                <CardHeader>
                  <CardTitle>Detailed Answer Review</CardTitle>
                  <CardDescription>Review each question and answer</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {gradingResult.answers.map((answer, index) => (
                      <div 
                        key={answer.questionId} 
                        className={`p-4 rounded-lg border-2 ${
                          answer.isCorrect 
                            ? 'bg-green-50 border-green-200' 
                            : 'bg-red-50 border-red-200'
                        }`}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold">Question {index + 1}</span>
                            <Badge variant={answer.isCorrect ? 'default' : 'destructive'} className="text-xs">
                              {answer.points} / {answer.points || 2} pts
                            </Badge>
                          </div>
                          {answer.isCorrect ? (
                            <CheckCircle2 className="w-5 h-5 text-green-600" />
                          ) : (
                            <XCircle className="w-5 h-5 text-red-600" />
                          )}
                        </div>
                        <div className="space-y-2 text-sm">
                          <div>
                            <span className="font-medium">Student Answer: </span>
                            <span className={answer.isCorrect ? 'text-green-700' : 'text-red-700'}>
                              {answer.studentAnswer}
                            </span>
                          </div>
                          {!answer.isCorrect && (
                            <div>
                              <span className="font-medium">Correct Answer: </span>
                              <span className="text-green-700">{answer.correctAnswer}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </>
          ) : (
            <Card className="border-dashed">
              <CardContent className="flex flex-col items-center justify-center py-16">
                <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mb-4">
                  <ScanLine className="w-10 h-10 text-green-600" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Ready to Grade</h3>
                <p className="text-sm text-muted-foreground text-center max-w-md mb-6">
                  Upload a scanned answer sheet and our OCR system will automatically extract 
                  and grade the answers for you.
                </p>
                <div className="w-full max-w-md bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-medium text-sm mb-2">Recent Gradings</h4>
                  <div className="space-y-2">
                    {recentGradings.slice(0, 3).map((result) => (
                      <div key={result.id} className="flex items-center justify-between text-sm bg-white rounded p-2">
                        <div>
                          <p className="font-medium">{result.studentName}</p>
                          <p className="text-xs text-muted-foreground">{result.examTitle}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">{result.percentage.toFixed(0)}%</p>
                          <p className="text-xs text-muted-foreground">{result.score}/{result.totalPoints}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
