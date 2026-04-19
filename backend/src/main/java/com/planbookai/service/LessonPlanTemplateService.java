package com.planbookai.service;

import com.planbookai.dto.lessonplan.LessonPlanTemplateRequest;
import com.planbookai.dto.lessonplan.LessonPlanTemplateResponse;

import java.util.List;

public interface LessonPlanTemplateService {
    LessonPlanTemplateResponse create(LessonPlanTemplateRequest request);

    List<LessonPlanTemplateResponse> findAll();

    LessonPlanTemplateResponse update(Long id, LessonPlanTemplateRequest request);

    void delete(Long id);
}
