package com.planbookai.service.impl;

import com.planbookai.dto.question.QuestionChoiceCreateRequest;
import com.planbookai.dto.question.QuestionChoiceResponse;
import com.planbookai.dto.question.QuestionCreateRequest;
import com.planbookai.dto.question.QuestionResponse;
import com.planbookai.entity.Question;
import com.planbookai.entity.QuestionChoice;
import com.planbookai.entity.Topic;
import com.planbookai.entity.User;
import com.planbookai.entity.enums.QuestionStatus;
import com.planbookai.entity.enums.QuestionType;
import com.planbookai.repository.QuestionRepository;
import com.planbookai.repository.TopicRepository;
import com.planbookai.repository.UserRepository;
import com.planbookai.service.QuestionService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class QuestionServiceImpl implements QuestionService {

    private final QuestionRepository questionRepository;
    private final TopicRepository topicRepository;
    private final UserRepository userRepository;

    @Override
    @Transactional(readOnly = true)
    public List<QuestionResponse> findAll() {
        return questionRepository.findAll().stream().map(this::toResponse).toList();
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<QuestionResponse> findById(Long questionId) {
        return questionRepository.findById(questionId).map(this::toResponse);
    }

    @Override
    @Transactional
    public QuestionResponse create(QuestionCreateRequest request) {
        Topic topic = topicRepository.findById(request.getTopicId())
                .orElseThrow(() -> new IllegalArgumentException("Topic not found: " + request.getTopicId()));
        User author = userRepository.findById(request.getCreatedByUserId())
                .orElseThrow(() -> new IllegalArgumentException("User not found: " + request.getCreatedByUserId()));

        validateChoicesForType(request.getType(), request.getChoices());

        Question entity = new Question();
        entity.setTopic(topic);
        entity.setCreatedBy(author);
        entity.setContent(request.getContent());
        entity.setType(request.getType());
        entity.setDifficulty(request.getDifficulty());
        entity.setStatus(QuestionStatus.PENDING);
        entity.setCreatedAt(LocalDateTime.now());

        for (QuestionChoiceCreateRequest c : request.getChoices()) {
            QuestionChoice choice = new QuestionChoice();
            choice.setQuestion(entity);
            choice.setContent(c.getContent());
            choice.setIsCorrect(c.getCorrect());
            entity.getChoices().add(choice);
        }

        Question saved = questionRepository.save(entity);
        return toResponse(saved);
    }

    private void validateChoicesForType(QuestionType type, List<QuestionChoiceCreateRequest> choices) {
        if (type == QuestionType.MCQ) {
            if (choices == null || choices.isEmpty()) {
                throw new IllegalArgumentException("MCQ questions require at least one choice");
            }
            long correct = choices.stream().filter(c -> Boolean.TRUE.equals(c.getCorrect())).count();
            if (correct != 1) {
                throw new IllegalArgumentException("MCQ must have exactly one correct choice");
            }
        } else if (choices != null && !choices.isEmpty()) {
            throw new IllegalArgumentException("Choices are only allowed for MCQ type");
        }
    }

    private QuestionResponse toResponse(Question q) {
        List<QuestionChoiceResponse> choiceDtos = q.getChoices().stream()
                .map(ch -> QuestionChoiceResponse.builder()
                        .questionChoiceId(ch.getQuestionChoiceId())
                        .content(ch.getContent())
                        .correct(Boolean.TRUE.equals(ch.getIsCorrect()))
                        .build())
                .toList();

        return QuestionResponse.builder()
                .questionId(q.getQuestionId())
                .topicId(q.getTopic().getTopicId())
                .topicName(q.getTopic().getName())
                .createdByUserId(q.getCreatedBy().getUserId())
                .content(q.getContent())
                .type(q.getType())
                .difficulty(q.getDifficulty())
                .status(q.getStatus())
                .createdAt(q.getCreatedAt())
                .choices(choiceDtos)
                .build();
    }
}
