import { useState, useEffect } from "react";
import { FileText, Plus, X, RefreshCw } from "lucide-react";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Label } from "../components/ui/label";
import { Input } from "../components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Switch } from "../components/ui/switch";
import { Badge } from "../components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../components/ui/dialog";
import { toast } from "sonner";
import apiClient from "../../api/apiClient";

interface Topic  { topicId: number; name: string; }
interface Exam   { examId: number; title: string; duration: number; totalQuestions: number; createdAt: string; versions?: any[]; }

export default function ExamGenerator() {
  const [topics,    setTopics]    = useState<Topic[]>([]);
  const [exams,     setExams]     = useState<Exam[]>([]);
  const [loading,   setLoading]   = useState(false);
  const [generating, setGenerating] = useState(false);
  const [preview,   setPreview]   = useState<Exam | null>(null);
  const [viewingVersion, setViewingVersion] = useState<any | null>(null);

  const handlePrintVersion = (exam: Exam, version: any) => {
    let parsedDetails: any[] = [];
    try { parsedDetails = JSON.parse(version.answerKeyJson).details || []; } catch(e) {}
    
    if (parsedDetails.length === 0) {
      toast.error("Không thể in mã đề cũ chưa có dữ liệu câu hỏi.");
      return;
    }

    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    let html = `
      <html>
        <head>
          <title>${exam.title} - Mã đề ${version.versionCode}</title>
          <style>
            body { font-family: 'Times New Roman', serif; padding: 40px; line-height: 1.5; color: #000; }
            .header { text-align: center; margin-bottom: 30px; border-bottom: 2px solid #000; padding-bottom: 20px; }
            .header h1 { margin: 0 0 10px 0; font-size: 24px; text-transform: uppercase; }
            .header p { margin: 5px 0; font-size: 16px; }
            .student-info { margin-bottom: 30px; display: flex; justify-content: space-between; }
            .question { margin-bottom: 20px; break-inside: avoid; }
            .q-content { font-weight: bold; margin-bottom: 10px; }
            .options { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
            .option { margin-bottom: 5px; }
            .blank { border-bottom: 1px dotted #000; display: inline-block; width: 200px; height: 20px; margin-left: 10px; }
            @media print {
              body { padding: 0; }
              @page { margin: 2cm; }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>${exam.title}</h1>
            <p>Mã đề: <strong>${version.versionCode}</strong> | Thời gian làm bài: <strong>${exam.duration} phút</strong></p>
          </div>
          <div class="student-info">
            <div>Họ và tên: ..............................................................</div>
            <div>Số báo danh: .............................</div>
          </div>
          <div class="content">
    `;

    parsedDetails.forEach((q, idx) => {
      html += `<div class="question"><div class="q-content">Câu ${idx + 1}: ${q.content}</div>`;
      if (q.type === 'MCQ' && q.options && q.options.length > 0) {
        html += `<div class="options">`;
        q.options.forEach((opt: string) => {
          html += `<div class="option">${opt}</div>`;
        });
        html += `</div>`;
      } else {
        html += `<div>Bài làm: <div class="blank"></div></div>`;
      }
      html += `</div>`;
    });

    html += `
          </div>
          <script>
            window.onload = function() { window.print(); }
          </script>
        </body>
      </html>
    `;

    printWindow.document.write(html);
    printWindow.document.close();
  };

  const [title,          setTitle]          = useState("");
  const [duration,       setDuration]       = useState(45);
  const [totalQuestions, setTotalQuestions] = useState(10);
  const [topicId,        setTopicId]        = useState<number | undefined>(undefined);
  const [questionType,   setQuestionType]   = useState("MCQ");
  const [randomize,      setRandomize]      = useState(true);

  useEffect(() => { fetchTopics(); fetchExams(); }, []);

  async function fetchTopics() {
    try {
      const res = await apiClient.get<Topic[]>("/api/v1/topics");
      setTopics(res.data);
    } catch { toast.error("Lỗi tải danh sách topic"); }
  }

  async function fetchExams() {
    setLoading(true);
    try {
      const res = await apiClient.get<Exam[]>("/api/v1/exams");
      setExams(res.data);
    } catch { toast.error("Lỗi tải danh sách đề thi"); }
    finally { setLoading(false); }
  }

  async function handleGenerate() {
    if (!title.trim()) { toast.error("Nhập tiêu đề đề thi"); return; }
    if (totalQuestions < 1) { toast.error("Số câu phải >= 1"); return; }
    setGenerating(true);
    try {
      const res = await apiClient.post<Exam>("/api/v1/exams", {
        title: title.trim(),
        duration,
        totalQuestions,
        topicId: topicId ?? null,
        questionType: questionType === "ALL" ? null : questionType,
      });
      toast.success(`Tạo đề thi "${res.data.title}" thành công!`);
      setExams(prev => [res.data, ...prev]);
      setPreview(res.data);
      setTitle("");
    } catch (e: any) {
      toast.error(e.response?.data?.message ?? "Lỗi tạo đề thi");
    } finally {
      setGenerating(false);
    }
  }

  async function handleDelete(id: number) {
    if (!confirm("Xóa đề thi này?")) return;
    try {
      await apiClient.delete(`/api/v1/exams/${id}`);
      setExams(prev => prev.filter(e => e.examId !== id));
      toast.success("Đã xóa đề thi");
    } catch (e: any) {
      toast.error(e.response?.data?.message ?? "Lỗi xóa đề thi");
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Exam Generator</h1>
        <p className="mt-1 text-gray-600">Tạo đề thi trắc nghiệm Hóa học từ ngân hàng câu hỏi</p>
      </div>  

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Config */}
        <div className="space-y-4">
          <Card>
            <CardHeader><CardTitle>Cài đặt đề thi</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Tiêu đề *</Label>
                <Input placeholder="Đề kiểm tra HK1 Hóa 10" value={title} onChange={e => setTitle(e.target.value)} />
              </div>
              <div>
                <Label>Thời gian (phút)</Label>
                <Input type="number" min={5} max={180} value={duration} onChange={e => setDuration(Number(e.target.value))} />
              </div>
              <div>
                <Label>Số câu hỏi</Label>
                <Input type="number" min={1} max={100} value={totalQuestions} onChange={e => setTotalQuestions(Number(e.target.value))} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Topic (tùy chọn)</Label>
                  <Select value={topicId ? String(topicId) : "all"} onValueChange={v => setTopicId(v === "all" ? undefined : Number(v))}>
                    <SelectTrigger><SelectValue placeholder="Tất cả topic" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tất cả topic</SelectItem>
                      {topics.map(t => <SelectItem key={t.topicId} value={String(t.topicId)}>{t.name}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Loại câu hỏi</Label>
                  <Select value={questionType} onValueChange={setQuestionType}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="MCQ">Trắc nghiệm</SelectItem>
                      <SelectItem value="FILL_BLANK">Điền vào chỗ trống</SelectItem>
                      <SelectItem value="SHORT_ANSWER">Trả lời ngắn</SelectItem>
                      <SelectItem value="ALL">Tất cả (Hỗn hợp)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <Label>Trộn câu hỏi</Label>
                <Switch checked={randomize} onCheckedChange={setRandomize} />
              </div>
              <Button
                className="w-full bg-indigo-600 hover:bg-indigo-700"
                onClick={handleGenerate}
                disabled={generating}
              >
                <FileText className="mr-2 h-4 w-4" />
                {generating ? "Đang tạo..." : "Tạo đề thi"}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Exam list */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Đề thi đã tạo ({exams.length})</h2>
            <Button variant="outline" size="sm" onClick={fetchExams} disabled={loading}>
              <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            </Button>
          </div>

          {loading ? (
            <div className="text-center py-8 text-gray-400">Đang tải...</div>
          ) : exams.length === 0 ? (
            <Card><CardContent className="py-10 text-center text-gray-400">Chưa có đề thi nào</CardContent></Card>
          ) : (
            exams.map(exam => (
              <Card key={exam.examId} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold text-gray-900">{exam.title}</h3>
                      <div className="flex gap-3 mt-1 text-sm text-gray-500">
                        <span>⏱ {exam.duration} phút</span>
                        <span>📝 {exam.totalQuestions} câu</span>
                        <span>📅 {new Date(exam.createdAt).toLocaleDateString("vi-VN")}</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={async () => {
                          try {
                            const vRes = await apiClient.get(`/api/v1/exams/${exam.examId}/versions`);
                            setPreview({ ...exam, versions: vRes.data });
                          } catch (e) {
                            setPreview({ ...exam, versions: [] });
                          }
                        }}
                      >
                        Xem
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => handleDelete(exam.examId)}>
                        <X className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>

      <Dialog open={!!preview} onOpenChange={open => !open && setPreview(null)}>
        {preview && (
          <DialogContent className="max-w-3xl">
            <DialogHeader><DialogTitle>{preview.title}</DialogTitle></DialogHeader>
            <div className="space-y-3 text-sm">
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-gray-50 rounded"><p className="text-gray-500">Thời gian</p><p className="font-bold">{preview.duration} phút</p></div>
                <div className="p-3 bg-gray-50 rounded"><p className="text-gray-500">Số câu</p><p className="font-bold">{preview.totalQuestions}</p></div>
              </div>
              <p className="text-gray-500 text-xs">ID: {preview.examId} | Tạo: {new Date(preview.createdAt).toLocaleString("vi-VN")}</p>
              
              <div className="mt-4 pt-4 border-t">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-semibold text-gray-900">Danh sách mã đề</h4>
                  
                  {(!preview.versions || preview.versions.length === 0) && (
                    <div className="flex items-center gap-2">
                      <Input type="number" min={1} max={10} defaultValue={4} id="versionCountInput" className="w-20 h-9" />
                      <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700" onClick={async () => {
                          const countInput = document.getElementById("versionCountInput") as HTMLInputElement;
                          const count = countInput ? parseInt(countInput.value) : 4;
                          if (count < 1 || count > 10) { toast.error("Số mã đề phải từ 1 đến 10"); return; }
                          try {
                            const res = await apiClient.post(`/api/v1/exams/${preview.examId}/versions/generate?count=${count}`);
                            toast.success(`Đã tạo ${count} mã đề mới!`);
                            const vRes = await apiClient.get(`/api/v1/exams/${preview.examId}/versions`);
                            setPreview({ ...preview, versions: vRes.data });
                          } catch (e: any) { toast.error("Lỗi khi tạo mã đề"); }
                      }}>
                        <Plus className="h-4 w-4 mr-1" /> Tạo mã đề
                      </Button>
                    </div>
                  )}
                </div>
                
                <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
                  {(!preview.versions || preview.versions.length === 0) ? (
                    <div className="text-center py-4 text-gray-500 text-sm bg-gray-50 rounded">Chưa có mã đề nào được tạo. Nhập số lượng và bấm tạo.</div>
                  ) : (
                    preview.versions.map((v: any) => (
                      <div key={v.versionId} className="flex items-center justify-between p-3 border rounded bg-white">
                        <Badge variant="outline" className="text-indigo-600 border-indigo-200 bg-indigo-50">
                          Mã đề: {v.versionCode}
                        </Badge>
                        <div className="flex gap-2">
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="text-xs"
                            onClick={() => setViewingVersion(v)}
                          >
                            Xem Đề thi
                          </Button>
                          <Button 
                            size="sm" 
                            className="bg-indigo-600 hover:bg-indigo-700 text-xs"
                            onClick={() => handlePrintVersion(preview, v)}
                          >
                            Tải PDF (In)
                          </Button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </DialogContent>
        )}
      </Dialog>

      {/* Sub-dialog for viewing single version */}
      <Dialog open={!!viewingVersion} onOpenChange={open => !open && setViewingVersion(null)}>
        {viewingVersion && (() => {
          let parsedDetails: any[] = [];
          try { parsedDetails = JSON.parse(viewingVersion.answerKeyJson).details || []; } catch(e) {}
          
          return (
            <DialogContent className="max-w-3xl h-[80vh] flex flex-col">
              <DialogHeader>
                <DialogTitle>Mã đề: {viewingVersion.versionCode}</DialogTitle>
              </DialogHeader>
              <div className="flex-1 overflow-y-auto pr-2">
                {parsedDetails.length > 0 ? (
                  <div className="space-y-6 mt-2">
                    {parsedDetails.map((q: any, idx: number) => (
                      <div key={idx} className="space-y-2">
                        <p className="font-semibold text-gray-900">Câu {idx + 1}: {q.content}</p>
                        
                        {q.type === 'MCQ' ? (
                          q.options && q.options.length > 0 && (
                            <div className="grid grid-cols-2 gap-2 mt-2">
                              {q.options.map((opt: string, i: number) => (
                                <div key={i} className="p-2 rounded border bg-white border-gray-200 text-gray-700 text-sm">
                                  {opt}
                                </div>
                              ))}
                            </div>
                          )
                        ) : (
                          <div className="mt-4 w-full border-b border-dashed border-gray-400 h-8"></div>
                        )}
                        
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-10 text-gray-500 italic">Mã đề này được tạo từ phiên bản cũ, không hỗ trợ xem chi tiết câu hỏi.</div>
                )}
              </div>
            </DialogContent>
          );
        })()}
      </Dialog>
    </div>
  );
}