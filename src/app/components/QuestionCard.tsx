import { Question } from '../types';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Edit, Trash2, Copy } from 'lucide-react';

interface QuestionCardProps {
  question: Question;
  onEdit?: (question: Question) => void;
  onDelete?: (id: string) => void;
  onDuplicate?: (question: Question) => void;
  showActions?: boolean;
}

export function QuestionCard({ 
  question, 
  onEdit, 
  onDelete, 
  onDuplicate,
  showActions = true 
}: QuestionCardProps) {
  const difficultyColor = {
    easy: 'bg-green-100 text-green-800',
    medium: 'bg-yellow-100 text-yellow-800',
    hard: 'bg-red-100 text-red-800',
  };

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-start justify-between gap-4 mb-3">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="outline" className="text-xs">{question.subject}</Badge>
              <Badge variant="outline" className="text-xs">{question.topic}</Badge>
              <Badge className={`text-xs ${difficultyColor[question.difficulty]}`}>
                {question.difficulty}
              </Badge>
            </div>
            <h4 className="font-medium mb-2">{question.question}</h4>
            {question.options && (
              <div className="space-y-1 mb-3">
                {question.options.map((option, index) => (
                  <div 
                    key={index}
                    className={`text-sm pl-3 py-1 rounded ${
                      option === question.correctAnswer 
                        ? 'bg-green-50 text-green-700 font-medium' 
                        : 'text-gray-600'
                    }`}
                  >
                    {String.fromCharCode(65 + index)}. {option}
                  </div>
                ))}
              </div>
            )}
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <span>Points: {question.points}</span>
              <span>•</span>
              <span>{question.type}</span>
              {question.tags && question.tags.length > 0 && (
                <>
                  <span>•</span>
                  <span>Tags: {question.tags.join(', ')}</span>
                </>
              )}
            </div>
          </div>
          {showActions && (
            <div className="flex gap-2">
              {onEdit && (
                <Button variant="ghost" size="sm" onClick={() => onEdit(question)}>
                  <Edit className="w-4 h-4" />
                </Button>
              )}
              {onDuplicate && (
                <Button variant="ghost" size="sm" onClick={() => onDuplicate(question)}>
                  <Copy className="w-4 h-4" />
                </Button>
              )}
              {onDelete && (
                <Button variant="ghost" size="sm" onClick={() => onDelete(question.id)}>
                  <Trash2 className="w-4 h-4 text-red-500" />
                </Button>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
