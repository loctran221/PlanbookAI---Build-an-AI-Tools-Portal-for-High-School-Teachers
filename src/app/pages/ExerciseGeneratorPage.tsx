import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Textarea } from '../components/ui/textarea';
import { Wand2, Download, Save, Sparkles } from 'lucide-react';
import { chemistryTopics, mockQuestions } from '../data/mockData';
import { QuestionDifficulty, Question } from '../types';
import { QuestionCard } from '../components/QuestionCard';
import { toast } from 'sonner';

export function ExerciseGeneratorPage() {
  const [generating, setGenerating] = useState(false);
  const [generatedQuestions, setGeneratedQuestions] = useState<Question[]>([]);
  const [formData, setFormData] = useState({
    topic: '',
    difficulty: 'medium' as QuestionDifficulty,
    numberOfQuestions: 5,
    additionalInstructions: '',
  });

  const handleGenerate = async () => {
    if (!formData.topic) {
      toast.error('Please select a topic');
      return;
    }

    setGenerating(true);
    
    // Simulate AI generation with a delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Mock: Generate questions by filtering from existing bank
    const filtered = mockQuestions.filter(
      q => q.topic === formData.topic && q.difficulty === formData.difficulty
    );
    
    // If not enough, add some from other difficulties
    let generated = [...filtered];
    if (generated.length < formData.numberOfQuestions) {
      const additional = mockQuestions
        .filter(q => q.topic === formData.topic && !filtered.includes(q))
        .slice(0, formData.numberOfQuestions - generated.length);
      generated = [...generated, ...additional];
    }
    
    // Take only the requested number
    generated = generated.slice(0, formData.numberOfQuestions);
    
    // If still not enough, create AI-like variations
    if (generated.length < formData.numberOfQuestions) {
      const needed = formData.numberOfQuestions - generated.length;
      for (let i = 0; i < needed; i++) {
        const base = mockQuestions[i % mockQuestions.length];
        generated.push({
          ...base,
          id: `gen_${Date.now()}_${i}`,
          topic: formData.topic,
          difficulty: formData.difficulty,
          question: `${base.question} (AI Generated Variation ${i + 1})`,
          createdAt: new Date().toISOString(),
        });
      }
    }
    
    setGeneratedQuestions(generated);
    setGenerating(false);
    toast.success(`Generated ${generated.length} questions successfully!`);
  };

  const handleSaveToBank = () => {
    toast.success('All questions saved to Question Bank!');
    // In a real app, this would save to the database
  };

  const handleDownloadPDF = () => {
    toast.success('Exercise downloaded as PDF!');
    // In a real app, this would generate and download a PDF
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-semibold mb-2">Exercise Generator</h1>
        <p className="text-muted-foreground">Use AI to create custom chemistry exercises instantly</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Generator Form */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-indigo-600" />
                AI Settings
              </CardTitle>
              <CardDescription>Configure your exercise parameters</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="topic">Topic</Label>
                <Select value={formData.topic} onValueChange={(value) => setFormData({ ...formData, topic: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a topic" />
                  </SelectTrigger>
                  <SelectContent>
                    {chemistryTopics.map((topic) => (
                      <SelectItem key={topic} value={topic}>{topic}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="difficulty">Difficulty Level</Label>
                <Select 
                  value={formData.difficulty} 
                  onValueChange={(value: QuestionDifficulty) => setFormData({ ...formData, difficulty: value })}
                >
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

              <div className="space-y-2">
                <Label htmlFor="numberOfQuestions">Number of Questions</Label>
                <Input
                  id="numberOfQuestions"
                  type="number"
                  min="1"
                  max="20"
                  value={formData.numberOfQuestions}
                  onChange={(e) => setFormData({ ...formData, numberOfQuestions: parseInt(e.target.value) || 1 })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="instructions">Additional Instructions (Optional)</Label>
                <Textarea
                  id="instructions"
                  value={formData.additionalInstructions}
                  onChange={(e) => setFormData({ ...formData, additionalInstructions: e.target.value })}
                  placeholder="E.g., Focus on calculations, include diagrams, etc."
                  rows={3}
                />
              </div>

              <Button 
                onClick={handleGenerate} 
                disabled={generating}
                className="w-full bg-indigo-600 hover:bg-indigo-700"
              >
                {generating ? (
                  <>
                    <Wand2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Wand2 className="mr-2 h-4 w-4" />
                    Generate Exercise
                  </>
                )}
              </Button>

              {generatedQuestions.length > 0 && (
                <div className="pt-4 space-y-2">
                  <Button variant="outline" onClick={handleSaveToBank} className="w-full">
                    <Save className="mr-2 h-4 w-4" />
                    Save to Question Bank
                  </Button>
                  <Button variant="outline" onClick={handleDownloadPDF} className="w-full">
                    <Download className="mr-2 h-4 w-4" />
                    Download as PDF
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Info Card */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="text-base">How it works</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground space-y-2">
              <p>1. Select your desired topic and difficulty</p>
              <p>2. Choose the number of questions you need</p>
              <p>3. Add any specific requirements</p>
              <p>4. Click generate and review the questions</p>
              <p>5. Save to your question bank or export</p>
            </CardContent>
          </Card>
        </div>

        {/* Generated Questions Preview */}
        <div className="lg:col-span-2">
          <Card className="mb-4">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Generated Exercise</CardTitle>
                  <CardDescription>
                    {generatedQuestions.length > 0 
                      ? `${generatedQuestions.length} questions generated` 
                      : 'Your generated questions will appear here'}
                  </CardDescription>
                </div>
                {generatedQuestions.length > 0 && (
                  <div className="text-sm text-muted-foreground">
                    Total Points: {generatedQuestions.reduce((sum, q) => sum + q.points, 0)}
                  </div>
                )}
              </div>
            </CardHeader>
          </Card>

          {generatedQuestions.length === 0 ? (
            <Card className="border-dashed">
              <CardContent className="flex flex-col items-center justify-center py-12">
                <div className="w-16 h-16 bg-indigo-50 rounded-full flex items-center justify-center mb-4">
                  <Wand2 className="w-8 h-8 text-indigo-600" />
                </div>
                <h3 className="font-semibold mb-2">Ready to Generate</h3>
                <p className="text-sm text-muted-foreground text-center max-w-sm">
                  Configure your settings on the left and click "Generate Exercise" to create 
                  AI-powered questions tailored to your needs.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {generatedQuestions.map((question, index) => (
                <div key={question.id} className="relative">
                  <div className="absolute -left-4 top-6 w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center text-sm font-semibold text-indigo-700">
                    {index + 1}
                  </div>
                  <QuestionCard question={question} showActions={false} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
