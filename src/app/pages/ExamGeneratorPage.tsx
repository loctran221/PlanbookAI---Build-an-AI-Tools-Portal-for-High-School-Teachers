import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Checkbox } from '../components/ui/checkbox';
import { ClipboardList, Download, Eye, Shuffle } from 'lucide-react';
import { chemistryTopics, mockQuestions } from '../data/mockData';
import { Question } from '../types';
import { QuestionCard } from '../components/QuestionCard';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../components/ui/dialog';
import { toast } from 'sonner';

export function ExamGeneratorPage() {
  const [examTitle, setExamTitle] = useState('');
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  const [questionsPerTopic, setQuestionsPerTopic] = useState(5);
  const [duration, setDuration] = useState(60);
  const [versions, setVersions] = useState(1);
  const [randomize, setRandomize] = useState(true);
  const [generatedExam, setGeneratedExam] = useState<Question[]>([]);
  const [showPreview, setShowPreview] = useState(false);

  const handleTopicToggle = (topic: string) => {
    setSelectedTopics(prev => 
      prev.includes(topic) 
        ? prev.filter(t => t !== topic)
        : [...prev, topic]
    );
  };

  const handleGenerateExam = () => {
    if (!examTitle.trim()) {
      toast.error('Please enter an exam title');
      return;
    }
    if (selectedTopics.length === 0) {
      toast.error('Please select at least one topic');
      return;
    }

    // Generate exam by selecting questions from selected topics
    let examQuestions: Question[] = [];
    
    selectedTopics.forEach(topic => {
      const topicQuestions = mockQuestions.filter(q => q.topic === topic);
      const selected = topicQuestions.slice(0, questionsPerTopic);
      examQuestions = [...examQuestions, ...selected];
    });

    if (randomize) {
      examQuestions = examQuestions.sort(() => Math.random() - 0.5);
    }

    setGeneratedExam(examQuestions);
    toast.success(`Exam generated with ${examQuestions.length} questions!`);
  };

  const handlePreview = () => {
    if (generatedExam.length === 0) {
      toast.error('Please generate an exam first');
      return;
    }
    setShowPreview(true);
  };

  const handleExport = () => {
    if (generatedExam.length === 0) {
      toast.error('Please generate an exam first');
      return;
    }
    toast.success(`Exam exported as PDF (${versions} version${versions > 1 ? 's' : ''})!`);
  };

  const totalPoints = generatedExam.reduce((sum, q) => sum + q.points, 0);

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-semibold mb-2">Exam Generator</h1>
        <p className="text-muted-foreground">Create comprehensive multiple-choice exams with multiple versions</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Configuration Panel */}
        <div className="lg:col-span-1 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Exam Configuration</CardTitle>
              <CardDescription>Set up your exam parameters</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="examTitle">Exam Title</Label>
                <Input
                  id="examTitle"
                  value={examTitle}
                  onChange={(e) => setExamTitle(e.target.value)}
                  placeholder="e.g., Mid-Term Chemistry Exam"
                />
              </div>

              <div className="space-y-2">
                <Label>Select Topics</Label>
                <div className="border rounded-lg p-3 max-h-64 overflow-y-auto space-y-2">
                  {chemistryTopics.map((topic) => (
                    <div key={topic} className="flex items-center space-x-2">
                      <Checkbox
                        id={topic}
                        checked={selectedTopics.includes(topic)}
                        onCheckedChange={() => handleTopicToggle(topic)}
                      />
                      <label
                        htmlFor={topic}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                      >
                        {topic}
                      </label>
                    </div>
                  ))}
                </div>
                {selectedTopics.length > 0 && (
                  <p className="text-xs text-muted-foreground">
                    {selectedTopics.length} topic{selectedTopics.length > 1 ? 's' : ''} selected
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="questionsPerTopic">Questions per Topic</Label>
                <Input
                  id="questionsPerTopic"
                  type="number"
                  min="1"
                  max="10"
                  value={questionsPerTopic}
                  onChange={(e) => setQuestionsPerTopic(parseInt(e.target.value) || 1)}
                />
                <p className="text-xs text-muted-foreground">
                  Total: ~{selectedTopics.length * questionsPerTopic} questions
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="duration">Duration (min)</Label>
                  <Input
                    id="duration"
                    type="number"
                    min="15"
                    max="180"
                    value={duration}
                    onChange={(e) => setDuration(parseInt(e.target.value) || 60)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="versions">Versions</Label>
                  <Input
                    id="versions"
                    type="number"
                    min="1"
                    max="5"
                    value={versions}
                    onChange={(e) => setVersions(parseInt(e.target.value) || 1)}
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2 pt-2">
                <Checkbox
                  id="randomize"
                  checked={randomize}
                  onCheckedChange={(checked) => setRandomize(checked as boolean)}
                />
                <label
                  htmlFor="randomize"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                >
                  Randomize question order
                </label>
              </div>
            </CardContent>
          </Card>

          <Button 
            onClick={handleGenerateExam}
            className="w-full bg-indigo-600 hover:bg-indigo-700"
          >
            <ClipboardList className="mr-2 h-4 w-4" />
            Generate Exam
          </Button>

          {generatedExam.length > 0 && (
            <div className="space-y-2">
              <Button variant="outline" onClick={handlePreview} className="w-full">
                <Eye className="mr-2 h-4 w-4" />
                Preview Exam
              </Button>
              <Button variant="outline" onClick={handleExport} className="w-full">
                <Download className="mr-2 h-4 w-4" />
                Export to PDF ({versions} version{versions > 1 ? 's' : ''})
              </Button>
            </div>
          )}
        </div>

        {/* Preview Panel */}
        <div className="lg:col-span-2">
          <Card className="mb-4">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>{examTitle || 'Untitled Exam'}</CardTitle>
                  <CardDescription>
                    {generatedExam.length > 0 
                      ? `${generatedExam.length} questions • ${duration} minutes • ${totalPoints} points`
                      : 'Configure your exam and click generate'}
                  </CardDescription>
                </div>
                {generatedExam.length > 0 && randomize && (
                  <Button variant="ghost" size="sm" onClick={handleGenerateExam}>
                    <Shuffle className="mr-2 h-4 w-4" />
                    Shuffle
                  </Button>
                )}
              </div>
            </CardHeader>
          </Card>

          {generatedExam.length === 0 ? (
            <Card className="border-dashed">
              <CardContent className="flex flex-col items-center justify-center py-12">
                <div className="w-16 h-16 bg-purple-50 rounded-full flex items-center justify-center mb-4">
                  <ClipboardList className="w-8 h-8 text-purple-600" />
                </div>
                <h3 className="font-semibold mb-2">No Exam Generated Yet</h3>
                <p className="text-sm text-muted-foreground text-center max-w-sm">
                  Configure your exam settings on the left and click "Generate Exam" to create your test.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {/* Exam Summary */}
              <div className="grid grid-cols-3 gap-4">
                <Card>
                  <CardContent className="p-4">
                    <p className="text-sm text-muted-foreground mb-1">Total Questions</p>
                    <p className="text-2xl font-semibold">{generatedExam.length}</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <p className="text-sm text-muted-foreground mb-1">Total Points</p>
                    <p className="text-2xl font-semibold">{totalPoints}</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <p className="text-sm text-muted-foreground mb-1">Duration</p>
                    <p className="text-2xl font-semibold">{duration}m</p>
                  </CardContent>
                </Card>
              </div>

              {/* Questions Preview */}
              <div className="space-y-3">
                {generatedExam.map((question, index) => (
                  <div key={question.id} className="relative">
                    <div className="absolute -left-4 top-6 w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center text-sm font-semibold text-purple-700">
                      {index + 1}
                    </div>
                    <QuestionCard question={question} showActions={false} />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Preview Dialog */}
      <Dialog open={showPreview} onOpenChange={setShowPreview}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{examTitle}</DialogTitle>
            <DialogDescription>
              Full exam preview • {generatedExam.length} questions • {duration} minutes
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {generatedExam.map((question, index) => (
              <div key={question.id} className="border-b pb-4 last:border-0">
                <p className="font-semibold mb-2">Question {index + 1} ({question.points} points)</p>
                <p className="mb-3">{question.question}</p>
                {question.options && (
                  <div className="space-y-1 ml-4">
                    {question.options.map((option, optIndex) => (
                      <p key={optIndex} className="text-sm">
                        {String.fromCharCode(65 + optIndex)}. {option}
                      </p>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
