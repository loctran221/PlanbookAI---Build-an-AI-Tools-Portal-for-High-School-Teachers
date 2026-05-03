package com.planbookai.controller;

import com.planbookai.dto.student.ClassGroupDTO;
import com.planbookai.dto.student.StudentDTO;
import com.planbookai.service.StudentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/classes")
@RequiredArgsConstructor
public class ClassGroupController {

    private final StudentService studentService;

    @GetMapping
    @PreAuthorize("hasRole('TEACHER')")
    public ResponseEntity<List<ClassGroupDTO>> getMyClasses() {
        return ResponseEntity.ok(studentService.getMyClasses());
    }

    @PostMapping
    @PreAuthorize("hasRole('TEACHER')")
    public ResponseEntity<?> createClass(@RequestBody ClassGroupDTO request) {
        try {
            return ResponseEntity.status(HttpStatus.CREATED).body(studentService.createClass(request));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @GetMapping("/{classId}/students")
    @PreAuthorize("hasRole('TEACHER')")
    public ResponseEntity<?> getStudentsByClass(@PathVariable Long classId) {
        try {
            return ResponseEntity.ok(studentService.getStudentsByClass(classId));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @PostMapping("/{classId}/students")
    @PreAuthorize("hasRole('TEACHER')")
    public ResponseEntity<?> addStudent(@PathVariable Long classId, @RequestBody StudentDTO request) {
        try {
            return ResponseEntity.status(HttpStatus.CREATED).body(studentService.addStudent(classId, request));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @PutMapping("/{classId}")
    @PreAuthorize("hasRole('TEACHER')")
    public ResponseEntity<?> updateClass(@PathVariable Long classId, @RequestBody ClassGroupDTO request) {
        try {
            return ResponseEntity.ok(studentService.updateClass(classId, request));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @PutMapping("/students/{studentId}")
    @PreAuthorize("hasRole('TEACHER')")
    public ResponseEntity<?> updateStudent(@PathVariable Long studentId, @RequestBody StudentDTO request) {
        try {
            return ResponseEntity.ok(studentService.updateStudent(studentId, request));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @DeleteMapping("/students/{studentId}")
    @PreAuthorize("hasRole('TEACHER')")
    public ResponseEntity<?> deleteStudent(@PathVariable Long studentId) {
        try {
            studentService.deleteStudent(studentId);
            return ResponseEntity.ok(Map.of("message", "Đã xóa học sinh thành công"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }
}
