package com.planbookai.repository;

import com.planbookai.entity.ClassGroup;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ClassGroupRepository extends JpaRepository<ClassGroup, Long> {
    List<ClassGroup> findByTeacher_UserId(Long teacherId);
}
