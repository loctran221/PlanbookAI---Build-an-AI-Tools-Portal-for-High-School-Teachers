import { useState, useEffect } from "react";
import { Upload, CheckCircle, AlertCircle, RefreshCw, Key } from "lucide-react";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Badge } from "../components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "../components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Textarea } from "../components/ui/textarea";
import { toast } from "sonner";
import apiClient from "../../api/apiClient";
import { getAuthToken } from "../lib/auth";

interface OcrResult {
  ocrResultId: number;
  examId: number;
  studentName: string;
  score: number;
  resultJson: string;
  requiresReview: boolean;
  gradedAt: string;
}

interface Exam { examId: number; title: string; totalQuestions: number; }

const BASE_URL = (import.meta as any).env?.VITE_API_URL ?? "http://localhost:8080";

export default function OCRGrading() {
  const [files,      setFiles]      = useState<File[]>([]);
  const [examCode,   setExamCode]   = useState("");
  const [loading,    setLoading]    = useState(false);
  const [results,    setResults]    = useState<OcrResult[]>([]);
  const [exams,      setExams]      = useState<Exam[]>([]);
  const [selectedExam, setSelectedExam] = useState<number | null>(null);
  const [historyLoading, setHistoryLoading] = useState(false);

  // Dialog tạo đáp án
  const [answerDialog, setAnswerDialog]   = useState(false);
  const [akExamId,     setAkExamId]       = useState("");
  const [akExamCode,   setAkExamCode]     = useState("");
  const [akAnswers,    setAkAnswers]      = useState("");
  const [akSaving,     setAkSaving]       = useState(false);

  useEffect(() => { fetchExams(); }, []);

  async function fetchExams() {
    try {
      const res = await apiClient.get<Exam[]>("/exams");
      setExams(res.data);
    } catch { /* ignore */ }
  }

  async function fetchHistory(examId: number) {
    setHistoryLoading(true);
    try {
      const res = await apiClient.get<OcrResult[]>(`/ocr/exam/${examId}`);
      setResults(res.data);
    } catch (e: any) {
      toast.error(e.response?.data?.message ?? "Lỗi tải lịch sử");
    } finally {
      setHistoryLoading(false);
    }
  }

  async function handleUpload() {
    if (files.length === 0)   { toast.error("Chọn ít nhất 1 ảnh bài làm"); return; }
    if (!examCode.trim())     { toast.error("Nhập mã đề thi (VD: EXAM001)"); return; }

    setLoading(true);
    setResults([]);

    try {
      const formData = new FormData();
      files.forEach(f => formData.append("files", f));
      formData.append("examCode", examCode.trim().toUpperCase());

      const token = getAuthToken();
      const res = await fetch(`${BASE_URL}/api/v1/ocr/upload-batch`, {
        method: "POST",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        body: formData,
      });

      const text = await res.text();
      let data: any = null;
      try {
        data = text ? JSON.parse(text) : null;
      } catch {
        data = null;
      }

      if (!res.ok) {
        const errorMessage = data?.message || data?.error || data?.status || text || "Lỗi chấm bài";
        toast.error(errorMessage);
        return;
      }

      setResults(data ?? []);
      toast.success(`Đã chấm xong ${data.length} bài!`);
    } catch (e: any) {
      toast.error("Lỗi kết nối backend: " + e.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleCreateAnswerKey() {
    if (!akExamId || !akExamCode.trim() || !akAnswers.trim()) {
      toast.error("Điền đầy đủ thông tin đáp án"); return;
    }
    // Validate JSON
    try { JSON.parse(akAnswers); } catch {
      toast.error('Đáp án phải là JSON hợp lệ. VD: {"part_1":["A","B","C"]}');
      return;
    }
    setAkSaving(true);
    try {
      await apiClient.post("/ocr/answer-key", {
        examId: Number(akExamId),
        examCode: akExamCode.trim().toUpperCase(),
        answersJson: akAnswers.trim(),
      });
      toast.success(`Đã lưu đáp án cho mã đề ${akExamCode.toUpperCase()}`);
      setAnswerDialog(false);
      setAkExamId(""); setAkExamCode(""); setAkAnswers("");
    } catch (e: any) {
      toast.error(e.response?.data?.message ?? "Lỗi lưu đáp án");
    } finally {
      setAkSaving(false);
    }
  }

  const avg = results.length > 0
    ? (results.reduce((s, r) => s + r.score, 0) / results.length).toFixed(1)
    : null;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">OCR Grading</h1>
          <p className="mt-1 text-gray-600">Chấm bài thi tự động bằng AI (Gemini Vision)</p>
        </div>
        <Button variant="outline" onClick={() => setAnswerDialog(true)}>
          <Key className="mr-2 h-4 w-4" /> Tạo đáp án chuẩn
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Upload panel */}
        <Card>
          <CardHeader><CardTitle>Chấm bài hàng loạt</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Mã đề thi *</Label>
              <Input
                placeholder="EXAM001"
                value={examCode}
                onChange={e => setExamCode(e.target.value)}
                className="uppercase"
              />
              <p className="text-xs text-gray-400 mt-1">
                Mã đề phải khớp với đáp án chuẩn đã tạo. Xem mã đề trong trang Exam Generator.
              </p>
            </div>

            <div>
              <Label>Ảnh bài làm học sinh *</Label>
              <div
                className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-indigo-400 transition-colors"
                onClick={() => document.getElementById("ocr-file-input")?.click()}
              >
                <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-500">
                  {files.length > 0
                    ? `Đã chọn ${files.length} file: ${files.map(f => f.name).join(", ")}`
                    : "Click hoặc kéo thả ảnh bài làm vào đây"}
                </p>
                <p className="text-xs text-gray-400 mt-1">JPG, PNG, WEBP — tối đa 10MB/file</p>
              </div>
              <input
                id="ocr-file-input"
                type="file"
                multiple
                accept="image/*"
                className="hidden"
                onChange={e => setFiles(Array.from(e.target.files ?? []))}
              />
            </div>

            <Button
              className="w-full bg-indigo-600 hover:bg-indigo-700"
              onClick={handleUpload}
              disabled={loading}
            >
              {loading ? (
                <><RefreshCw className="mr-2 h-4 w-4 animate-spin" /> Đang chấm bài AI...</>
              ) : (
                <><Upload className="mr-2 h-4 w-4" /> Bắt đầu chấm bài</>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* History panel */}
        <Card>
          <CardHeader>
            <CardTitle>Lịch sử chấm theo đề thi</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Select
              value={selectedExam ? String(selectedExam) : ""}
              onValueChange={v => { setSelectedExam(Number(v)); fetchHistory(Number(v)); }}
            >
              <SelectTrigger><SelectValue placeholder="Chọn đề thi để xem lịch sử" /></SelectTrigger>
              <SelectContent>
                {exams.map(e => (
                  <SelectItem key={e.examId} value={String(e.examId)}>
                    {e.title} ({e.totalQuestions} câu)
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {historyLoading ? (
              <div className="text-center py-4 text-gray-400">Đang tải...</div>
            ) : selectedExam && results.length === 0 ? (
              <div className="text-center py-4 text-gray-400 text-sm">Chưa có kết quả chấm</div>
            ) : null}
          </CardContent>
        </Card>
      </div>

      {/* Results */}
      {results.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Kết quả chấm — {results.length} bài</h2>
            {avg && (
              <Badge className="bg-indigo-600 text-white px-3 py-1 text-sm">
                Điểm TB: {avg}
              </Badge>
            )}
          </div>

          {/* Summary stats */}
          <div className="grid grid-cols-4 gap-3">
            {[
              { label: "Giỏi (8-10)",   value: results.filter(r => r.score >= 8).length,            color: "text-green-600" },
              { label: "Khá (6.5-8)",   value: results.filter(r => r.score >= 6.5 && r.score < 8).length, color: "text-blue-600" },
              { label: "TB (5-6.5)",    value: results.filter(r => r.score >= 5   && r.score < 6.5).length, color: "text-yellow-600" },
              { label: "Yếu (<5)",      value: results.filter(r => r.score < 5).length,             color: "text-red-600" },
            ].map(s => (
              <Card key={s.label}><CardContent className="p-3 text-center">
                <p className="text-xs text-gray-500">{s.label}</p>
                <p className={`text-xl font-bold ${s.color}`}>{s.value}</p>
              </CardContent></Card>
            ))}
          </div>

          {/* Result rows */}
          <div className="space-y-2">
            {results.map((r, i) => (
              <Card key={r.ocrResultId ?? i} className={r.requiresReview ? "border-yellow-300" : ""}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-gray-900">{r.studentName}</p>
                      <p className="text-xs text-gray-400">
                        Chấm lúc: {new Date(r.gradedAt).toLocaleString("vi-VN")}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      {r.requiresReview && (
                        <Badge className="bg-yellow-500"><AlertCircle className="h-3 w-3 mr-1" />Cần kiểm tra</Badge>
                      )}
                      <div className={`text-3xl font-black ${
                        r.score >= 8 ? "text-green-600" :
                        r.score >= 6.5 ? "text-blue-600" :
                        r.score >= 5 ? "text-yellow-600" : "text-red-600"
                      }`}>
                        {r.score.toFixed(1)}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Answer Key Dialog */}
      <Dialog open={answerDialog} onOpenChange={setAnswerDialog}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle>Tạo đáp án chuẩn cho mã đề</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Chọn đề thi *</Label>
              <Select value={akExamId} onValueChange={v => {
                setAkExamId(v);
                setAkExamCode(`EXAM${v.padStart(3, "0")}`);
              }}>
                <SelectTrigger><SelectValue placeholder="Chọn đề thi" /></SelectTrigger>
                <SelectContent>
                  {exams.map(e => (
                    <SelectItem key={e.examId} value={String(e.examId)}>
                      {e.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Mã đề (exam code) *</Label>
              <Input
                value={akExamCode}
                onChange={e => setAkExamCode(e.target.value)}
                placeholder="EXAM001"
                className="uppercase"
              />
            </div>
            <div>
              <Label>Đáp án chuẩn (JSON) *</Label>
              <Textarea
                rows={4}
                value={akAnswers}
                onChange={e => setAkAnswers(e.target.value)}
                placeholder={'{"part_1":["A","C","B","D","A"]}'}
                className="font-mono text-sm"
              />
              <p className="text-xs text-gray-400 mt-1">
                part_1: mảng đáp án theo thứ tự câu (chỉ A/B/C/D)
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAnswerDialog(false)}>Hủy</Button>
            <Button onClick={handleCreateAnswerKey} disabled={akSaving} className="bg-indigo-600 hover:bg-indigo-700">
              {akSaving ? "Đang lưu..." : "Lưu đáp án"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}