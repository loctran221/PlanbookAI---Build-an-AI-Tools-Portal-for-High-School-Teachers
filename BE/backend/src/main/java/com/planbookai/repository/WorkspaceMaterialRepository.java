package com.planbookai.repository;

import com.planbookai.entity.WorkspaceMaterial;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface WorkspaceMaterialRepository extends JpaRepository<WorkspaceMaterial, Long> {
    List<WorkspaceMaterial> findByTeacher_UserIdOrderByUploadedAtDesc(Long teacherId);
}
