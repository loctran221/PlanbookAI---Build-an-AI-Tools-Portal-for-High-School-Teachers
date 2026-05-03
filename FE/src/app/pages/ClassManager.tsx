import { useState, useEffect } from "react";
import { Users, Plus, BookOpen, GraduationCap, Edit, Trash2, MoreVertical, FileDown } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "../components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu";
import { api } from "../lib/auth";
import { toast } from "sonner";

export default function ClassManager() {
  const [classes, setClasses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedClass, setSelectedClass] = useState<any>(null);
  const [students, setStudents] = useState<any[]>([]);
  const [studentsLoading, setStudentsLoading] = useState(false);

  // Form states for Create/Edit Class
  const [isClassModalOpen, setIsClassModalOpen] = useState(false);
  const [editingClass, setEditingClass] = useState<any>(null);
  const [className, setClassName] = useState("");
  const [academicYear, setAcademicYear] = useState("2023-2024");

  // Form states for Create/Edit Student
  const [newStudentCode, setNewStudentCode] = useState("");
  const [newStudentName, setNewStudentName] = useState("");
  
  const [isEditStudentModalOpen, setIsEditStudentModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<any>(null);
  const [editStudentCode, setEditStudentCode] = useState("");
  const [editStudentName, setEditStudentName] = useState("");

  useEffect(() => {
    fetchClasses();
  }, []);

  const fetchClasses = async () => {
    try {
      setLoading(true);
      const res = await api.get("/api/classes");
      setClasses(res);
      if (res.length > 0 && !selectedClass) {
        handleSelectClass(res[0]);
      }
    } catch (err) {
      console.error(err);
      toast.error("Không thể tải danh sách lớp học");
    } finally {
      setLoading(false);
    }
  };

  const fetchStudents = async (classId: number) => {
    try {
      setStudentsLoading(true);
      const res = await api.get(`/api/classes/${classId}/students`);
      setStudents(res);
    } catch (err) {
      console.error(err);
      toast.error("Không thể tải danh sách học sinh");
    } finally {
      setStudentsLoading(false);
    }
  };

  const handleSelectClass = (c: any) => {
    setSelectedClass(c);
    fetchStudents(c.classId);
  };

  const handleOpenClassModal = (cls: any = null) => {
    if (cls) {
      setEditingClass(cls);
      setClassName(cls.name);
      setAcademicYear(cls.academicYear || "2023-2024");
    } else {
      setEditingClass(null);
      setClassName("");
      setAcademicYear("2023-2024");
    }
    setIsClassModalOpen(true);
  };

  const handleSaveClass = async () => {
    if (!className.trim()) {
      toast.error("Vui lòng nhập tên lớp (mã lớp)");
      return;
    }
    try {
      if (editingClass) {
        // Update
        const res = await api.put(`/api/classes/${editingClass.classId}`, { 
          name: className, 
          academicYear 
        });
        setClasses(classes.map(c => c.classId === editingClass.classId ? res : c));
        if (selectedClass?.classId === editingClass.classId) {
          setSelectedClass(res);
        }
        toast.success("Cập nhật thông tin lớp thành công");
      } else {
        // Create
        const res = await api.post("/api/classes", { 
          name: className, 
          academicYear 
        });
        setClasses([...classes, res]);
        toast.success("Thêm lớp học thành công");
        if (!selectedClass) {
          handleSelectClass(res);
        }
      }
      setIsClassModalOpen(false);
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Lỗi khi lưu lớp học");
    }
  };

  const handleAddStudent = async () => {
    if (!selectedClass || !newStudentCode.trim() || !newStudentName.trim()) {
      toast.error("Vui lòng nhập đủ SBD và Họ tên");
      return;
    }
    try {
      const res = await api.post(`/api/classes/${selectedClass.classId}/students`, {
        studentCode: newStudentCode,
        fullName: newStudentName
      });
      setStudents([...students, res]);
      setNewStudentCode("");
      setNewStudentName("");
      // Update class student count
      setClasses(classes.map(c => c.classId === selectedClass.classId ? { ...c, studentCount: (c.studentCount || 0) + 1 } : c));
      toast.success("Thêm học sinh thành công");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Lỗi khi thêm học sinh");
    }
  };

  const handleOpenEditStudentModal = (student: any) => {
    setEditingStudent(student);
    setEditStudentCode(student.studentCode);
    setEditStudentName(student.fullName);
    setIsEditStudentModalOpen(true);
  };

  const handleExportExcel = () => {
    if (!selectedClass || students.length === 0) {
      toast.error("Không có dữ liệu học sinh để xuất");
      return;
    }

    // Thêm BOM (Byte Order Mark) để Excel đọc đúng tiếng Việt có dấu (UTF-8)
    const BOM = "\uFEFF";
    const header = "Số báo danh/Mã HS,Họ và Tên\n";
    const rows = students.map(s => `"${s.studentCode}","${s.fullName}"`).join("\n");
    const csvContent = BOM + header + rows;

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `Danh_sach_hoc_sinh_Lop_${selectedClass.name}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast.success("Đã tải xuống danh sách học sinh thành công");
  };

  const handleUpdateStudent = async () => {
    if (!editStudentCode.trim() || !editStudentName.trim()) return;
    try {
      const res = await api.put(`/api/classes/students/${editingStudent.studentId}`, {
        studentCode: editStudentCode,
        fullName: editStudentName
      });
      setStudents(students.map(s => s.studentId === editingStudent.studentId ? res : s));
      setIsEditStudentModalOpen(false);
      toast.success("Cập nhật thông tin học sinh thành công");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Lỗi khi cập nhật học sinh");
    }
  };

  const handleDeleteStudent = async (student: any) => {
    if (!confirm(`Bạn có chắc chắn muốn xóa học sinh ${student.fullName}? Dữ liệu điểm thi (nếu có) sẽ bị ảnh hưởng.`)) return;
    try {
      await api.delete(`/api/classes/students/${student.studentId}`);
      setStudents(students.filter(s => s.studentId !== student.studentId));
      setClasses(classes.map(c => c.classId === selectedClass.classId ? { ...c, studentCount: Math.max(0, (c.studentCount || 1) - 1) } : c));
      toast.success("Xóa học sinh thành công");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Lỗi khi xóa học sinh");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Quản lý lớp học</h1>
          <p className="mt-1 text-gray-600">
            Quản lý danh sách lớp, học sinh và cập nhật hồ sơ
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Cột trái: Danh sách lớp */}
        <div className="md:col-span-1 space-y-4">
          <Card>
            <CardHeader className="pb-3 border-b">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Danh sách lớp</CardTitle>
                <Button onClick={() => handleOpenClassModal(null)} size="sm" className="h-8">
                  <Plus className="h-4 w-4 mr-1" /> Tạo lớp
                </Button>
              </div>
            </CardHeader>
            <CardContent className="pt-4">
              {loading ? (
                <div className="text-center py-4 text-gray-500">Đang tải...</div>
              ) : classes.length === 0 ? (
                <div className="text-center py-4 text-gray-500 text-sm">Chưa có lớp học nào</div>
              ) : (
                <div className="space-y-2">
                  {classes.map(c => (
                    <div 
                      key={c.classId} 
                      className={`p-3 rounded-lg border transition-colors flex items-center justify-between group ${selectedClass?.classId === c.classId ? 'bg-indigo-50 border-indigo-200' : 'hover:bg-gray-50'}`}
                    >
                      <div className="flex items-center gap-3 cursor-pointer flex-1" onClick={() => handleSelectClass(c)}>
                        <div className={`p-2 rounded-md ${selectedClass?.classId === c.classId ? 'bg-indigo-100 text-indigo-700' : 'bg-gray-100 text-gray-600'}`}>
                          <Users className="h-4 w-4" />
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">{c.name}</div>
                          <div className="text-xs text-gray-500">Năm học: {c.academicYear} • {c.studentCount} HS</div>
                        </div>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 text-gray-400 hover:text-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => handleOpenClassModal(c)}
                        title="Sửa thông tin lớp"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Cột phải: Danh sách học sinh */}
        <div className="md:col-span-2">
          <Card className="h-full">
            <CardHeader className="border-b pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg flex items-center gap-2">
                  <GraduationCap className="h-5 w-5 text-indigo-600" />
                  {selectedClass ? `Học sinh lớp ${selectedClass.name}` : 'Danh sách Học sinh'}
                </CardTitle>
                {selectedClass && (
                  <Button variant="outline" size="sm" className="h-8 text-gray-600" onClick={handleExportExcel}>
                    <FileDown className="h-4 w-4 mr-2" />
                    Export Excel
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              {!selectedClass ? (
                <div className="text-center py-12 text-gray-500 flex flex-col items-center">
                  <BookOpen className="h-12 w-12 text-gray-300 mb-3" />
                  <p>Chọn một lớp ở cột bên trái để xem và quản lý danh sách học sinh</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Quick Add Form */}
                  <div className="bg-gray-50 p-4 rounded-lg border flex gap-3 items-end">
                    <div className="w-1/3">
                      <Label className="text-xs mb-1 text-gray-600">Số báo danh / Mã HS</Label>
                      <Input 
                        placeholder="VD: HS001" 
                        value={newStudentCode}
                        onChange={e => setNewStudentCode(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && handleAddStudent()}
                      />
                    </div>
                    <div className="flex-1">
                      <Label className="text-xs mb-1 text-gray-600">Họ và Tên</Label>
                      <Input 
                        placeholder="Nhập họ tên học sinh..." 
                        value={newStudentName}
                        onChange={e => setNewStudentName(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && handleAddStudent()}
                      />
                    </div>
                    <Button onClick={handleAddStudent} className="bg-indigo-600 hover:bg-indigo-700">
                      <Plus className="h-4 w-4 mr-1" /> Thêm nhanh
                    </Button>
                  </div>

                  <div className="border rounded-lg overflow-hidden">
                    <Table>
                      <TableHeader className="bg-gray-50">
                        <TableRow>
                          <TableHead className="w-[150px]">SBD / Mã HS</TableHead>
                          <TableHead>Họ và Tên</TableHead>
                          <TableHead className="text-right w-[100px]">Thao tác</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {studentsLoading ? (
                          <TableRow>
                            <TableCell colSpan={3} className="text-center py-8 text-gray-500">Đang tải dữ liệu học sinh...</TableCell>
                          </TableRow>
                        ) : students.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={3} className="text-center py-8 text-gray-500">
                              Lớp chưa có học sinh nào. Hãy thêm học sinh mới.
                            </TableCell>
                          </TableRow>
                        ) : (
                          students.map(s => (
                            <TableRow key={s.studentId} className="group">
                              <TableCell className="font-medium text-gray-900">{s.studentCode}</TableCell>
                              <TableCell>{s.fullName}</TableCell>
                              <TableCell className="text-right">
                                <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                  <Button 
                                    variant="ghost" 
                                    size="icon" 
                                    className="h-8 w-8 text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50"
                                    onClick={() => handleOpenEditStudentModal(s)}
                                    title="Cập nhật thông tin"
                                  >
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                  <Button 
                                    variant="ghost" 
                                    size="icon" 
                                    className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50"
                                    onClick={() => handleDeleteStudent(s)}
                                    title="Xóa học sinh"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Class Modal (Create/Edit) */}
      <Dialog open={isClassModalOpen} onOpenChange={setIsClassModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingClass ? "Cập nhật thông tin Lớp" : "Tạo Lớp học mới"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Tên lớp / Mã lớp</Label>
              <Input 
                value={className} 
                onChange={(e) => setClassName(e.target.value)} 
                placeholder="VD: 10A1, 11B2..." 
              />
            </div>
            <div className="space-y-2">
              <Label>Năm học</Label>
              <Input 
                value={academicYear} 
                onChange={(e) => setAcademicYear(e.target.value)} 
                placeholder="VD: 2023-2024" 
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsClassModalOpen(false)}>Hủy</Button>
            <Button onClick={handleSaveClass}>Lưu Lớp học</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Student Modal */}
      <Dialog open={isEditStudentModalOpen} onOpenChange={setIsEditStudentModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cập nhật thông tin Học sinh</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Số báo danh / Mã HS</Label>
              <Input 
                value={editStudentCode} 
                onChange={(e) => setEditStudentCode(e.target.value)} 
                placeholder="VD: HS001" 
              />
            </div>
            <div className="space-y-2">
              <Label>Họ và Tên</Label>
              <Input 
                value={editStudentName} 
                onChange={(e) => setEditStudentName(e.target.value)} 
                placeholder="Nhập họ tên học sinh..." 
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditStudentModalOpen(false)}>Hủy</Button>
            <Button onClick={handleUpdateStudent}>Cập nhật Học sinh</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
