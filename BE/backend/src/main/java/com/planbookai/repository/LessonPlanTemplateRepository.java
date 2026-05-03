package com.planbookai.repository;

import com.planbookai.entity.LessonPlanTemplate;
import org.springframework.data.jpa.repository.JpaRepository;

import com.planbookai.entity.enums.TemplateStatus;
import java.util.List;

public interface LessonPlanTemplateRepository extends JpaRepository<LessonPlanTemplate, Long> {
    List<LessonPlanTemplate> findByStatus(TemplateStatus status);
}
