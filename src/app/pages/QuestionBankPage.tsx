import { useState } from 'react';
import { QuestionCard } from '../components/QuestionCard';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../components/ui/dialog';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Plus, Search, Filter } from 'lucide-react';
import { mockQuestions, chemistryTopics } from '../data/mockData';
import { Question, QuestionDifficulty, QuestionType } from '../types';
import { Badge } from '../components/ui/badge';

export function QuestionBankPage() {
  const [questions, setQuestions] = useState(mockQuestions);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterTopic, setFilterTopic] = useState<string>('all');
  const [filterDifficulty, setFilterDifficulty] = useState<string>('all');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    question: '',
    topic: '',
    difficulty: 'medium' as QuestionDifficulty,
    type: 'multiple-choice' as QuestionType,
    options: ['', '', '', ''],
    correctAnswer: '',
    points: 2,
    explanation: '',
    tags: '',
  });

  // Filter questions
  const filteredQuestions = questions.filter((q) => {
    const matchesSearch = q.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         q.topic.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTopic = filterTopic === 'all' || q.topic === filterTopic;
    const matchesDifficulty = filterDifficulty === 'all' || q.difficulty === filterDifficulty;
    return matchesSearch && matchesTopic && matchesDifficulty;
  });

  const handleCreateQuestion = () => {
    setEditingQuestion(null);
    setFormData({
      question: '',
      topic: '',
      difficulty: 'medium',
      type: 'multiple-choice',
      options: ['', '', '', ''],
      correctAnswer: '',
      points: 2,
      explanation: '',
      tags: '',
    });
    setIsDialogOpen(true);
  };

  const handleEditQuestion = (question: Question) => {
    setEditingQuestion(question);
    setFormData({
      question: question.question,
      topic: question.topic,
      difficulty: question.difficulty,
      type: question.type,
      options: question.options || ['', '', '', ''],
      correctAnswer: question.correctAnswer,
      points: question.points,
      explanation: question.explanation || '',
      tags: question.tags.join(', '),
    });
    setIsDialogOpen(true);
  };

  const handleSaveQuestion = () => {
    const newQuestion: Question = {
      id: editingQuestion?.id || `q${Date.now()}`,
      subject: 'Chemistry',
      topic: formData.topic,
      difficulty: formData.difficulty,
      type: formData.type,
      question: formData.question,
      options: formData.type === 'multiple-choice' ? formData.options.filter(o => o.trim()) : undefined,
      correctAnswer: formData.correctAnswer,
      explanation: formData.explanation,
      points: formData.points,
      createdBy: 'Dr. Sarah Johnson',
      createdAt: new Date().toISOString(),
      tags: formData.tags.split(',').map(t => t.trim()).filter(t => t),
    };

    if (editingQuestion) {
      setQuestions(questions.map(q => q.id === editingQuestion.id ? newQuestion : q));
    } else {
      setQuestions([newQuestion, ...questions]);
    }
    setIsDialogOpen(false);
  };

  const handleDeleteQuestion = (id: string) => {
    if (confirm('Are you sure you want to delete this question?')) {
      setQuestions(questions.filter(q => q.id !== id));
    }
  };

  const handleDuplicateQuestion = (question: Question) => {
    const duplicated: Question = {
      ...question,
      id: `q${Date.now()}`,
      question: `${question.question} (Copy)`,
      createdAt: new Date().toISOString(),
    };
    setQuestions([duplicated, ...questions]);
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-semibold mb-2">Question Bank</h1>
          <p className="text-muted-foreground">Manage and organize your chemistry questions</p>
        </div>
        <Button onClick={handleCreateQuestion} className="bg-indigo-600 hover:bg-indigo-700">
          <Plus className="mr-2 h-4 w-4" /> Create Question
        </Button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg border p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="md:col-span-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search questions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <Select value={filterTopic} onValueChange={setFilterTopic}>
            <SelectTrigger>
              <SelectValue placeholder="All Topics" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Topics</SelectItem>
              {chemistryTopics.map((topic) => (
                <SelectItem key={topic} value={topic}>{topic}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={filterDifficulty} onValueChange={setFilterDifficulty}>
            <SelectTrigger>
              <SelectValue placeholder="All Difficulties" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Difficulties</SelectItem>
              <SelectItem value="easy">Easy</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="hard">Hard</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg border p-4">
          <p className="text-sm text-muted-foreground mb-1">Total Questions</p>
          <p className="text-2xl font-semibold">{questions.length}</p>
        </div>
        <div className="bg-white rounded-lg border p-4">
          <p className="text-sm text-muted-foreground mb-1">Topics Covered</p>
          <p className="text-2xl font-semibold">{new Set(questions.map(q => q.topic)).size}</p>
        </div>
        <div className="bg-white rounded-lg border p-4">
          <p className="text-sm text-muted-foreground mb-1">Easy</p>
          <p className="text-2xl font-semibold text-green-600">
            {questions.filter(q => q.difficulty === 'easy').length}
          </p>
        </div>
        <div className="bg-white rounded-lg border p-4">
          <p className="text-sm text-muted-foreground mb-1">Hard</p>
          <p className="text-2xl font-semibold text-red-600">
            {questions.filter(q => q.difficulty === 'hard').length}
          </p>
        </div>
      </div>

      {/* Questions List */}
      <div className="space-y-4">
        {filteredQuestions.length === 0 ? (
          <div className="bg-white rounded-lg border p-12 text-center">
            <p className="text-muted-foreground">No questions found. Try adjusting your filters.</p>
          </div>
        ) : (
          filteredQuestions.map((question) => (
            <QuestionCard
              key={question.id}
              question={question}
              onEdit={handleEditQuestion}
              onDelete={handleDeleteQuestion}
              onDuplicate={handleDuplicateQuestion}
            />
          ))
        )}
      </div>

      {/* Create/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingQuestion ? 'Edit Question' : 'Create New Question'}</DialogTitle>
            <DialogDescription>
              Fill in the details below to {editingQuestion ? 'update' : 'create'} a question.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="question">Question</Label>
              <Textarea
                id="question"
                value={formData.question}
                onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                placeholder="Enter your question here..."
                rows={3}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="topic">Topic</Label>
                <Select value={formData.topic} onValueChange={(value) => setFormData({ ...formData, topic: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select topic" />
                  </SelectTrigger>
                  <SelectContent>
                    {chemistryTopics.map((topic) => (
                      <SelectItem key={topic} value={topic}>{topic}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="difficulty">Difficulty</Label>
                <Select value={formData.difficulty} onValueChange={(value: QuestionDifficulty) => setFormData({ ...formData, difficulty: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="easy">Easy</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="hard">Hard</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="type">Question Type</Label>
                <Select value={formData.type} onValueChange={(value: QuestionType) => setFormData({ ...formData, type: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="multiple-choice">Multiple Choice</SelectItem>
                    <SelectItem value="true-false">True/False</SelectItem>
                    <SelectItem value="short-answer">Short Answer</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="points">Points</Label>
                <Input
                  id="points"
                  type="number"
                  value={formData.points}
                  onChange={(e) => setFormData({ ...formData, points: parseInt(e.target.value) || 0 })}
                  min="1"
                />
              </div>
            </div>
            {formData.type === 'multiple-choice' && (
              <div className="space-y-2">
                <Label>Answer Options</Label>
                {formData.options.map((option, index) => (
                  <Input
                    key={index}
                    value={option}
                    onChange={(e) => {
                      const newOptions = [...formData.options];
                      newOptions[index] = e.target.value;
                      setFormData({ ...formData, options: newOptions });
                    }}
                    placeholder={`Option ${String.fromCharCode(65 + index)}`}
                  />
                ))}
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="correctAnswer">Correct Answer</Label>
              {formData.type === 'multiple-choice' ? (
                <Select value={formData.correctAnswer} onValueChange={(value) => setFormData({ ...formData, correctAnswer: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select correct answer" />
                  </SelectTrigger>
                  <SelectContent>
                    {formData.options.filter(o => o.trim()).map((option, index) => (
                      <SelectItem key={index} value={option}>{option}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                <Input
                  id="correctAnswer"
                  value={formData.correctAnswer}
                  onChange={(e) => setFormData({ ...formData, correctAnswer: e.target.value })}
                  placeholder="Enter correct answer"
                />
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="explanation">Explanation (Optional)</Label>
              <Textarea
                id="explanation"
                value={formData.explanation}
                onChange={(e) => setFormData({ ...formData, explanation: e.target.value })}
                placeholder="Explain the correct answer..."
                rows={2}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="tags">Tags (comma-separated)</Label>
              <Input
                id="tags"
                value={formData.tags}
                onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                placeholder="e.g., atoms, periodic-table, fundamentals"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSaveQuestion} className="bg-indigo-600 hover:bg-indigo-700">
              {editingQuestion ? 'Update' : 'Create'} Question
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
