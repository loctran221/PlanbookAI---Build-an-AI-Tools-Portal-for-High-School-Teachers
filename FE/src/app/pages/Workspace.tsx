import { useState, useEffect, useRef } from "react";
import { Upload, FileText, Trash2, Download, Search } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { api } from "../lib/auth";

export default function Workspace() {
  const [materials, setMaterials] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchMaterials();
  }, []);

  const fetchMaterials = async () => {
    try {
      setLoading(true);
      const res = await api.get("/api/workspace");
      setMaterials(res);
    } catch (error) {
      console.error("Failed to fetch materials", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      setUploading(true);
      await api.post("/api/workspace/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      // Refresh the list after successful upload
      fetchMaterials();
    } catch (error) {
      console.error("Upload failed", error);
      alert("Tải file lên thất bại. Vui lòng thử lại.");
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Workspace</h1>
          <p className="mt-1 text-gray-600">
            Không gian lưu trữ tài liệu, giáo án và đề thi cá nhân
          </p>
        </div>
        <div>
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            onChange={handleFileUpload}
          />
          <Button 
            className="bg-indigo-600 hover:bg-indigo-700" 
            onClick={triggerFileInput}
            disabled={uploading}
          >
            <Upload className="mr-2 h-4 w-4" />
            {uploading ? "Đang tải lên..." : "Tải tài liệu lên"}
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Tài liệu của tôi</CardTitle>
          <CardDescription>Quản lý các tệp đã tải lên để sử dụng làm ngữ cảnh cho AI</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8 text-gray-500">Đang tải tài liệu...</div>
          ) : materials.length === 0 ? (
            <div className="text-center py-12 border-2 border-dashed border-gray-200 rounded-lg">
              <FileText className="mx-auto h-12 w-12 text-gray-400 mb-3" />
              <h3 className="text-lg font-medium text-gray-900">Chưa có tài liệu nào</h3>
              <p className="mt-1 text-gray-500">
                Hãy tải lên giáo án, đề thi mẫu hoặc tài liệu tham khảo để bắt đầu
              </p>
              <Button variant="outline" className="mt-4" onClick={triggerFileInput}>
                Tải file đầu tiên
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {materials.map((file: any) => (
                <div key={file.materialId} className="flex items-start p-4 border rounded-lg hover:border-indigo-300 transition-colors bg-white">
                  <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg mr-4">
                    <FileText className="h-6 w-6" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate" title={file.fileName}>
                      {file.fileName}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {(file.fileSize / 1024 / 1024).toFixed(2)} MB • {file.fileType}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
