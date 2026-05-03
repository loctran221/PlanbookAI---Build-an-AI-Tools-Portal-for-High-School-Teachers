import { useEffect, useState } from "react";
// Import biến 'api' vừa được export từ auth.ts
import { api } from "../lib/auth"; 

export default function GenericManager({ title, endpoint }: { title: string, endpoint: string }) {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    // Sử dụng api.get chuẩn, kết quả trả về là JSON trực tiếp
    api.get<any>(endpoint)
      .then((resJson) => {
        // Kiểm tra nếu dữ liệu là mảng thì lấy luôn, không thì bọc vào mảng
        const result = Array.isArray(resJson) ? resJson : [resJson];
        setData(result);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Lỗi API hệ thống:", err);
        setLoading(false);
      });
  }, [endpoint]);

  // Hiển thị màn hình chờ để tránh bị trắng trang
  if (loading) return <div className="p-8 text-blue-800 font-bold">Đang kết nối dữ liệu...</div>;

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4 text-blue-900 border-b pb-2">{title}</h1>
      <div className="bg-white p-6 shadow-xl rounded-xl border border-gray-100">
        <div className="mb-3 text-xs text-gray-400 font-mono">
          ENDPOINT: {endpoint}
        </div>
        <pre className="text-[11px] font-mono bg-gray-50 p-6 overflow-auto max-h-[600px] rounded-lg border shadow-inner text-gray-700">
          {data.length > 0 ? JSON.stringify(data, null, 2) : "Danh sách hiện đang trống."}
        </pre>
      </div>
    </div>
  );
}