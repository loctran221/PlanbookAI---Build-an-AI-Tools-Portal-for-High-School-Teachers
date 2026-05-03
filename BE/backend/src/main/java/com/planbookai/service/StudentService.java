package com.planbookai.service;

import com.planbookai.dto.student.ClassGroupDTO;
import com.planbookai.dto.student.StudentDTO;
import com.planbookai.entity.ClassGroup;
import com.planbookai.entity.Student;
import com.planbookai.entity.User;
import com.planbookai.repository.ClassGroupRepository;
import com.planbookai.repository.StudentRepository;
import com.planbookai.security.CurrentUserService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class StudentService {

    private final ClassGroupRepository classGroupRepository;
    private final StudentRepository studentRepository;
    private final CurrentUserService currentUserService;
    private final com.planbookai.repository.UserRepository userRepository;

    @Transactional(readOnly = true)
    public List<ClassGroupDTO> getMyClasses() {
        Long teacherId = currentUserService.requireUserId();
        return classGroupRepository.findByTeacher_UserId(teacherId).stream()
                .map(cg -> ClassGroupDTO.builder()
                        .classId(cg.getClassId())
                        .name(cg.getName())
                        .academicYear(cg.getAcademicYear())
                        .studentCount(cg.getStudents() != null ? cg.getStudents().size() : 0)
                        .build())
                .collect(Collectors.toList());
    }

    @Transactional
    public ClassGroupDTO createClass(ClassGroupDTO request) {
        User teacher = userRepository.findById(currentUserService.requireUserId())
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy giáo viên"));

        ClassGroup cg = ClassGroup.builder()
                .name(request.getName())
                .academicYear(request.getAcademicYear())
                .teacher(teacher)
                .build();
        
        cg = classGroupRepository.save(cg);

        return ClassGroupDTO.builder()
                .classId(cg.getClassId())
                .name(cg.getName())
                .academicYear(cg.getAcademicYear())
                .studentCount(0)
                .build();
    }

    @Transactional(readOnly = true)
    public List<StudentDTO> getStudentsByClass(Long classId) {
        ClassGroup cg = classGroupRepository.findById(classId)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy lớp học"));

        if (!cg.getTeacher().getUserId().equals(currentUserService.requireUserId())) {
            throw new IllegalArgumentException("Bạn không có quyền truy cập lớp học này");
        }

        return studentRepository.findByClassGroup_ClassId(classId).stream()
                .map(s -> StudentDTO.builder()
                        .studentId(s.getStudentId())
                        .studentCode(s.getStudentCode())
                        .fullName(s.getFullName())
                        .classId(cg.getClassId())
                        .className(cg.getName())
                        .build())
                .collect(Collectors.toList());
    }

    @Transactional
    public StudentDTO addStudent(Long classId, StudentDTO request) {
        ClassGroup cg = classGroupRepository.findById(classId)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy lớp học"));

        if (!cg.getTeacher().getUserId().equals(currentUserService.requireUserId())) {
            throw new IllegalArgumentException("Bạn không có quyền chỉnh sửa lớp học này");
        }

        if (studentRepository.existsByStudentCode(request.getStudentCode())) {
            throw new IllegalArgumentException("Số báo danh " + request.getStudentCode() + " đã tồn tại trong hệ thống");
        }

        Student student = Student.builder()
                .studentCode(request.getStudentCode())
                .fullName(request.getFullName())
                .classGroup(cg)
                .build();

        student = studentRepository.save(student);

        return StudentDTO.builder()
                .studentId(student.getStudentId())
                .studentCode(student.getStudentCode())
                .fullName(student.getFullName())
                .classId(cg.getClassId())
                .className(cg.getName())
                .build();
    }

    @Transactional
    public ClassGroupDTO updateClass(Long classId, ClassGroupDTO request) {
        ClassGroup cg = classGroupRepository.findById(classId)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy lớp học"));

        if (!cg.getTeacher().getUserId().equals(currentUserService.requireUserId())) {
            throw new IllegalArgumentException("Bạn không có quyền chỉnh sửa lớp học này");
        }

        cg.setName(request.getName());
        cg.setAcademicYear(request.getAcademicYear());
        cg = classGroupRepository.save(cg);

        return ClassGroupDTO.builder()
                .classId(cg.getClassId())
                .name(cg.getName())
                .academicYear(cg.getAcademicYear())
                .studentCount(cg.getStudents() != null ? cg.getStudents().size() : 0)
                .build();
    }

    @Transactional
    public StudentDTO updateStudent(Long studentId, StudentDTO request) {
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy học sinh"));

        if (!student.getClassGroup().getTeacher().getUserId().equals(currentUserService.requireUserId())) {
            throw new IllegalArgumentException("Bạn không có quyền chỉnh sửa học sinh này");
        }

        if (!student.getStudentCode().equals(request.getStudentCode()) &&
                studentRepository.existsByStudentCode(request.getStudentCode())) {
            throw new IllegalArgumentException("Số báo danh " + request.getStudentCode() + " đã tồn tại trong hệ thống");
        }

        student.setStudentCode(request.getStudentCode());
        student.setFullName(request.getFullName());
        student = studentRepository.save(student);

        return StudentDTO.builder()
                .studentId(student.getStudentId())
                .studentCode(student.getStudentCode())
                .fullName(student.getFullName())
                .classId(student.getClassGroup().getClassId())
                .className(student.getClassGroup().getName())
                .build();
    }

    @Transactional
    public void deleteStudent(Long studentId) {
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy học sinh"));

        if (!student.getClassGroup().getTeacher().getUserId().equals(currentUserService.requireUserId())) {
            throw new IllegalArgumentException("Bạn không có quyền xóa học sinh này");
        }

        studentRepository.delete(student);
    }
}
