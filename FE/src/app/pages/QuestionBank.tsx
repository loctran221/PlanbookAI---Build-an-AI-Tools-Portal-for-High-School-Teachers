import { useState, useEffect } from "react";
import { Plus, Search, Filter, Trash2, RefreshCw } from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Badge } from "../components/ui/badge";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../components/ui/dialog";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import { toast } from "sonner";
import apiClient from "../../api/apiClient";

interface QuestionChoice {
  questionChoiceId: number;
  content: string;
  correct: boolean;
}

interface Question {
  questionId: number;
  content: string;
  type: string;
  difficulty: string;
  topicId: number;
  topicName?: string;
  status: string;
  choices: QuestionChoice[];
  createdAt: string;
}

interface Topic { topicId: number; name: string; subjectId: number; }
interface Subject { subjectId: number; name: string; }

const DIFFICULTY_COLORS: Record<string, string> = {
  easy:   "bg-green-50 text-green-700 border-green-200",
  medium: "bg-yellow-50 text-yellow-700 border-yellow-200",
  hard:   "bg-red-50 text-red-700 border-red-200",
};

const DEFAULT_NEW = {
  content: "", type: "MCQ" as const, difficulty: "EASY" as const, topicId: 0,
  choices: [
    { content: "", correct: true  },
    { content: "", correct: false },
    { content: "", correct: false },
    { content: "", correct: false },
  ],
};

export default function QuestionBank() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [topics, setTopics]       = useState<Topic[]>([]);
  const [subjects, setSubjects]   = useState<Subject[]>([]);
  const [loading, setLoading]     = useState(true);
  const [saving,  setSaving]      = useState(false);

  const [search,       setSearch]       = useState("");
  const [filterTopic,  setFilterTopic]  = useState("all");
  const [filterDiff,   setFilterDiff]   = useState("all");

  const [dialogOpen, setDialogOpen] = useState(false);
  const [newQ, setNewQ] = useState({ ...DEFAULT_NEW, choices: DEFAULT_NEW.choices.map(c => ({ ...c })) });

  // Load data
  useEffect(() => { fetchAll(); }, []);

  async function fetchAll() {
    setLoading(true);
    try {
      const [qRes, tRes, sRes] = await Promise.all([
        apiClient.get<Question[]>("/api/v1/questions"),
        apiClient.get<Topic[]>("/api/v1/topics"),
        apiClient.get<Subject[]>("/api/v1/subjects"),
      ]);
      setQuestions(qRes.data);
      setTopics(tRes.data);
      setSubjects(sRes.data);
    } catch (e: any) {
      toast.error("Lỗi tải dữ liệu: " + (e.response?.data?.message ?? e.message));
    } finally {
      setLoading(false);
    }
  }

  const filtered = questions.filter((q) => {
    const matchSearch = q.content.toLowerCase().includes(search.toLowerCase());
    const matchTopic  = filterTopic === "all" || String(q.topicId) === filterTopic;
    const matchDiff   = filterDiff  === "all" || q.difficulty.toLowerCase() === filterDiff;
    return matchSearch && matchTopic && matchDiff;
  });

  async function handleCreate() {
    if (!newQ.content.trim()) { toast.error("Nhập nội dung câu hỏi"); return; }
    if (!newQ.topicId)        { toast.error("Chọn topic");              return; }
    const hasCorrect = newQ.choices.some(c => c.correct && c.content.trim());
    if (!hasCorrect) { toast.error("Cần ít nhất 1 đáp án đúng có nội dung"); return; }

    setSaving(true);
    try {
      await apiClient.post("/api/v1/questions", {
        content:    newQ.content,
        type:       newQ.type,
        difficulty: newQ.difficulty,
        topicId:    newQ.topicId,
        choices:    newQ.choices.filter(c => c.content.trim()),
      });
      toast.success("Tạo câu hỏi thành công!");
      setDialogOpen(false);
      setNewQ({ ...DEFAULT_NEW, choices: DEFAULT_NEW.choices.map(c => ({ ...c })) });
      fetchAll();
    } catch (e: any) {
      toast.error(e.response?.data?.message ?? "Lỗi tạo câu hỏi");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: number) {
    if (!confirm("Xóa câu hỏi này?")) return;
    try {
      await apiClient.delete(`/api/v1/questions/${id}`);
      setQuestions(qs => qs.filter(q => q.questionId !== id));
      toast.success("Đã xóa câu hỏi");
    } catch (e: any) {
      toast.error(e.response?.data?.message ?? "Lỗi xóa câu hỏi");
    }
  }

  function updateChoice(idx: number, field: "content" | "correct", value: string | boolean) {
    setNewQ(prev => {
      const choices = prev.choices.map((c, i) => {
        if (i !== idx) return field === "correct" && value === true ? { ...c, correct: false } : c;
        return { ...c, [field]: value };
      });
      return { ...prev, choices };
    });
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Question Bank</h1>
          <p className="mt-1 text-gray-600">Manage Chemistry question bank</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={fetchAll} disabled={loading}>
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          </Button>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-indigo-600 hover:bg-indigo-700">
                <Plus className="mr-2 h-4 w-4" /> Add Question
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Add New Question</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-3">
                  <div className="col-span-1">
                    <Label>Topic *</Label>
                    <Select value={String(newQ.topicId || "")} onValueChange={v => setNewQ(p => ({ ...p, topicId: Number(v) }))}>
                      <SelectTrigger><SelectValue placeholder="Select topic" /></SelectTrigger>
                      <SelectContent>
                        {topics.map(t => <SelectItem key={t.topicId} value={String(t.topicId)}>{t.name}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Type</Label>
                    <Select value={newQ.type} onValueChange={v => setNewQ(p => ({ ...p, type: v as any }))}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="MCQ">Multiple Choice</SelectItem>
                        <SelectItem value="FILL_BLANK">Fill in the Blank</SelectItem>
                        <SelectItem value="SHORT_ANSWER">Short Answer</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Difficulty</Label>
                    <Select value={newQ.difficulty} onValueChange={v => setNewQ(p => ({ ...p, difficulty: v as any }))}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="EASY">Easy</SelectItem>
                        <SelectItem value="MEDIUM">Medium</SelectItem>
                        <SelectItem value="HARD">Hard</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label>Question Content *</Label>
                  <Textarea
                    placeholder="Enter question content..."
                    rows={3}
                    value={newQ.content}
                    onChange={e => setNewQ(p => ({ ...p, content: e.target.value }))}
                  />
                </div>

                {newQ.type === "MCQ" ? (
                  <div>
                    <Label>Options (click radio to mark correct answer)</Label>
                    <div className="space-y-2 mt-2">
                      {newQ.choices.map((c, i) => (
                        <div key={i} className="flex items-center gap-2">
                          <input
                            type="radio"
                            name="correct"
                            checked={c.correct}
                            onChange={() => updateChoice(i, "correct", true)}
                            className="accent-indigo-600"
                          />
                          <span className="w-6 font-bold text-gray-500">{String.fromCharCode(65 + i)}.</span>
                          <Input
                            value={c.content}
                            onChange={e => updateChoice(i, "content", e.target.value)}
                            placeholder={`Option ${String.fromCharCode(65 + i)}`}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div>
                    <Label>Correct Answer (Answer Key)</Label>
                    <div className="mt-2">
                      <Input
                        value={newQ.choices[0].content}
                        onChange={e => updateChoice(0, "content", e.target.value)}
                        placeholder="Enter the correct answer..."
                      />
                    </div>
                  </div>
                )}
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
                <Button onClick={handleCreate} disabled={saving} className="bg-indigo-600 hover:bg-indigo-700">
                  {saving ? "Saving..." : "Save Question"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        {[
          { label: "Tổng", value: questions.length, color: "text-gray-900" },
          { label: "Dễ",   value: questions.filter(q => q.difficulty.toLowerCase() === "easy").length,   color: "text-green-600" },
          { label: "TB",   value: questions.filter(q => q.difficulty.toLowerCase() === "medium").length, color: "text-yellow-600" },
          { label: "Khó",  value: questions.filter(q => q.difficulty.toLowerCase() === "hard").length,   color: "text-red-600" },
        ].map(s => (
          <Card key={s.label}><CardContent className="p-4">
            <p className="text-sm text-gray-600">{s.label}</p>
            <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
          </CardContent></Card>
        ))}
      </div>

      {/* Filters */}
      <Card><CardContent className="p-4">
        <div className="grid gap-3 md:grid-cols-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input placeholder="Tìm câu hỏi..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
          </div>
          <Select value={filterTopic} onValueChange={setFilterTopic}>
            <SelectTrigger><div className="flex items-center gap-2"><Filter className="h-4 w-4" /><SelectValue placeholder="Tất cả Topic" /></div></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả Topic</SelectItem>
              {topics.map(t => <SelectItem key={t.topicId} value={String(t.topicId)}>{t.name}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={filterDiff} onValueChange={setFilterDiff}>
            <SelectTrigger><SelectValue placeholder="Tất cả độ khó" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả</SelectItem>
              <SelectItem value="easy">Dễ</SelectItem>
              <SelectItem value="medium">Trung bình</SelectItem>
              <SelectItem value="hard">Khó</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardContent></Card>

      {/* List */}
      {loading ? (
        <div className="text-center py-10 text-gray-500">Đang tải...</div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-10 text-gray-400">Không có câu hỏi nào</div>
      ) : (
        <div className="space-y-3">
          {filtered.map(q => (
            <Card key={q.questionId} className="hover:shadow-md transition-shadow">
              <CardContent className="p-5">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <Badge variant="outline" className="text-indigo-600 border-indigo-200">
                        {topics.find(t => t.topicId === q.topicId)?.name ?? `Topic ${q.topicId}`}
                      </Badge>
                      <Badge variant="outline" className={DIFFICULTY_COLORS[q.difficulty.toLowerCase()] ?? ""}>
                        {q.difficulty}
                      </Badge>
                      <Badge variant="outline">{q.type}</Badge>
                      {q.status === "approved" && <Badge className="bg-green-600">Approved</Badge>}
                    </div>
                    <p className="font-medium text-gray-900">{q.content}</p>
                    {q.choices?.length > 0 && (
                      <div className="grid grid-cols-2 gap-1 mt-2">
                        {q.choices.map((c, i) => (
                          <div key={c.questionChoiceId} className={`text-sm rounded px-2 py-1 border ${c.correct ? "border-green-500 bg-green-50 text-green-800" : "border-gray-200 bg-gray-50 text-gray-600"}`}>
                            {String.fromCharCode(65 + i)}. {c.content}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => handleDelete(q.questionId)}>
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}