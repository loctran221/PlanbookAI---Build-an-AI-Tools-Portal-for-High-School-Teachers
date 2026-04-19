package com.planbookai.service;

import com.planbookai.dto.exam.ExamCreateRequest;
import com.planbookai.dto.exam.ExamResponse;

import java.util.List;

public interface ExamService {
    ExamResponse create(ExamCreateRequest request);

    List<ExamResponse> listMine();

    ExamResponse getById(Long examId);

    void delete(Long examId);
}
