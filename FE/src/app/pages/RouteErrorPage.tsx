import { Link, useRouteError } from "react-router-dom";

export default function RouteErrorPage() {
  const error = useRouteError();

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 p-6">
      <div className="w-full max-w-xl rounded-3xl border border-slate-200 bg-white p-8 shadow-xl">
        <h1 className="text-3xl font-semibold text-slate-900">Đã xảy ra lỗi không mong muốn</h1>
        <p className="mt-4 text-slate-600">
          Ứng dụng đã gặp sự cố khi cố gắng tải trang này. Vui lòng thử lại hoặc quay lại trang chính.
        </p>
        <div className="mt-6 rounded-lg bg-slate-100 p-4 text-sm text-slate-800">
          <strong>Chi tiết lỗi:</strong>
          <pre className="mt-2 overflow-x-auto whitespace-pre-wrap break-words text-xs text-slate-700">
            {String(error ?? "Không có thông tin lỗi")}
          </pre>
        </div>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link to="/login" className="inline-flex items-center justify-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700">
            Về trang đăng nhập
          </Link>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="inline-flex items-center justify-center rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            Tải lại trang
          </button>
        </div>
      </div>
    </div>
  );
}
