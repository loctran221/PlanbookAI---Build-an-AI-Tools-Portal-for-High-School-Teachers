import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { GraduationCap } from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { loginWithCredentials } from "../lib/auth";
import { toast } from "sonner";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";

export default function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Vui lòng nhập email và mật khẩu");
      return;
    }
    setLoading(true);
    try {
      const user = await loginWithCredentials(email, password);
      toast.success(`Chào mừng, ${user.name}!`);
      navigate(`/${user.role}`);
    } catch (err: any) {
      toast.error(err.message ?? "Email hoặc mật khẩu không đúng");
    } finally {
      setLoading(false);
    }
  };

  const fillDemo = (demoEmail: string) => {
    setEmail(demoEmail);
    setPassword("Password123!");
  };

  return (
    <div className="flex min-h-screen">
      {/* Left side */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gradient-to-br from-indigo-600 via-indigo-700 to-cyan-600">
        <ImageWithFallback
          src="https://images.unsplash.com/photo-1758685848084-fc51214f3cd0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080"
          alt="Chemistry classroom"
          className="absolute inset-0 h-full w-full object-cover opacity-20"
        />
        <div className="relative z-10 flex flex-col justify-center px-16 text-white">
          <div className="flex items-center gap-3 mb-8">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-sm">
              <GraduationCap className="h-10 w-10" />
            </div>
            <div>
              <h1 className="text-4xl font-bold">PlanbookAI</h1>
              <p className="text-indigo-200">AI-Powered Teaching Platform</p>
            </div>
          </div>
          <h2 className="text-3xl font-bold mb-4">Transform Your Teaching Experience</h2>
          <p className="text-xl text-indigo-100 mb-8">
            Tự động lập kế hoạch bài dạy, tạo đề thi và chấm bài bằng AI dành cho giáo viên Hóa học.
          </p>
          <div className="space-y-3">
            {["AI-powered exercise & exam generation", "Automated OCR grading system", "Comprehensive question bank management"].map((f) => (
              <div key={f} className="flex items-center gap-3">
                <div className="h-2 w-2 rounded-full bg-cyan-400" />
                <p className="text-indigo-100">{f}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right side */}
      <div className="flex flex-1 items-center justify-center p-8 bg-gray-50">
        <div className="w-full max-w-md">
          <div className="flex lg:hidden items-center justify-center gap-2 mb-8">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-600 to-cyan-500">
              <GraduationCap className="h-7 w-7 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">PlanbookAI</h1>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Đăng nhập</CardTitle>
              <CardDescription>Nhập thông tin tài khoản để tiếp tục</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="email@planbookai.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    autoComplete="email"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Mật khẩu</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    autoComplete="current-password"
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full bg-indigo-600 hover:bg-indigo-700"
                  disabled={loading}
                >
                  {loading ? "Đang đăng nhập..." : "Đăng nhập"}
                </Button>
              </form>

              <div className="mt-6 border-t pt-6">
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {[
                    { label: "Teacher",  email: "teacher@planbookai.com" },
                    { label: "Admin",    email: "admin@planbookai.com"   },
                    { label: "Manager",  email: "manager@planbookai.com" },
                    { label: "Staff",    email: "staff@planbookai.com"   },
                  ].map(({ label, email: demoEmail }) => (
                    <Button
                      key={label}
                      variant="outline"
                      size="sm"
                      type="button"
                      onClick={() => fillDemo(demoEmail)}
                    >
                      {label}
                    </Button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}