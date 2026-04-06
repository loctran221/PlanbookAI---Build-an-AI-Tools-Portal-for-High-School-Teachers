package com.planbookai.service;

import com.planbookai.dto.question.QuestionCreateRequest;
import com.planbookai.dto.question.QuestionResponse;

import java.util.List;
import java.util.Optional;

public interface QuestionService {

    List<QuestionResponse> findAll();

    Optional<QuestionResponse> findById(Long questionId);

    QuestionResponse create(QuestionCreateRequest request);
}
