package com.planbookai.service;

import com.planbookai.dto.exercise.ExerciseCreateRequest;
import com.planbookai.dto.exercise.ExerciseResponse;

import java.util.List;

public interface ExerciseService {
    ExerciseResponse create(ExerciseCreateRequest request);

    List<ExerciseResponse> listMine();

    ExerciseResponse getById(Long exerciseId);

    void delete(Long exerciseId);
}
