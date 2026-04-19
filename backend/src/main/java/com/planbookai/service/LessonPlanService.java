package com.planbookai.service;

import com.planbookai.dto.lessonplan.LessonPlanRequest;
import com.planbookai.dto.lessonplan.LessonPlanResponse;

import java.util.List;

public interface LessonPlanService {
    LessonPlanResponse create(LessonPlanRequest request);

    List<LessonPlanResponse> listMine();

    LessonPlanResponse getById(Long lessonPlanId);

    LessonPlanResponse update(Long lessonPlanId, LessonPlanRequest request);

    void delete(Long lessonPlanId);
}
