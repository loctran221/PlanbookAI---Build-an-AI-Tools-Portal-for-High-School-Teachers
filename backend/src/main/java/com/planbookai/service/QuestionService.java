package com.planbookai.service;

import com.planbookai.dto.question.QuestionCreateRequest;
import com.planbookai.dto.question.QuestionResponse;
import com.planbookai.dto.question.QuestionUpdateRequest;

import java.util.List;
import java.util.Optional;

public interface QuestionService {

    List<QuestionResponse> findAll();

    Optional<QuestionResponse> findById(Long questionId);

    QuestionResponse create(QuestionCreateRequest request);

    QuestionResponse update(Long questionId, QuestionUpdateRequest request);

    void delete(Long questionId);

    List<QuestionResponse> filter(Long topicId, Long subjectId);
}
