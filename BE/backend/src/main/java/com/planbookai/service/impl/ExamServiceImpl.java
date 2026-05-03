package com.planbookai.service.impl;

import com.planbookai.dto.exam.ExamCreateRequest;
import com.planbookai.dto.exam.ExamResponse;
import com.planbookai.entity.*;
import com.planbookai.repository.ExamQuestionRepository;
import com.planbookai.repository.ExamRepository;
import com.planbookai.repository.QuestionRepository;
import com.planbookai.repository.UserRepository;
import com.planbookai.security.CurrentUserService;
import com.planbookai.service.ExamService;
import lombok.RequiredArgsConstructor;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;
import java.util.Objects;

@Service
@RequiredArgsConstructor
public class ExamServiceImpl implements ExamService {

    private final ExamRepository examRepository;
    private final ExamQuestionRepository examQuestionRepository;
    private final QuestionRepository questionRepository;
    private final UserRepository userRepository;
    private final CurrentUserService currentUserService;
    private final com.planbookai.repository.ExamVersionRepository examVersionRepository;
    private final com.fasterxml.jackson.databind.ObjectMapper objectMapper;

    @Override
    @Transactional
    public ExamResponse create(ExamCreateRequest request) {
        Long currentUserId = currentUserService.requireUserId();
        User teacher = userRepository.findById(currentUserId)
                .orElseThrow(() -> new IllegalArgumentException("User not found: " + currentUserId));

        List<Question> source = request.getTopicId() == null
                ? questionRepository.findAll()
                : questionRepository.findByTopic_TopicId(request.getTopicId());

        if (request.getQuestionType() != null && !request.getQuestionType().isEmpty()) {
            source = source.stream()
                    .filter(q -> q.getType() != null && q.getType().name().equalsIgnoreCase(request.getQuestionType()))
                    .toList();
        }

        if (source.size() < request.getTotalQuestions()) {
            throw new IllegalArgumentException("Not enough questions to generate exam. Found: " + source.size() + ", Required: " + request.getTotalQuestions());
        }
        
        // Convert to modifiable list before shuffling
        source = new java.util.ArrayList<>(source);
        Collections.shuffle(source);
        List<Question> selected = source.stream().limit(request.getTotalQuestions()).toList();

        Exam exam = new Exam();
        exam.setTeacher(teacher);
        exam.setTitle(request.getTitle());
        exam.setDuration(request.getDuration());
        exam.setTotalQuestions(request.getTotalQuestions());
        exam.setCreatedAt(LocalDateTime.now());
        Exam saved = examRepository.save(exam);

        int index = 1;
        for (Question question : selected) {
            ExamQuestion link = new ExamQuestion();
            link.setId(new ExamQuestionId(saved.getExamId(), question.getQuestionId()));
            link.setExam(saved);
            link.setQuestion(question);
            link.setOrderIndex(index++);
            examQuestionRepository.save(link);
        }
        return toResponse(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ExamResponse> listMine() {
        Long currentUserId = currentUserService.requireUserId();
        if (currentUserService.hasRole("ADMIN")) {
            return examRepository.findAll().stream().map(this::toResponse).toList();
        }
        return examRepository.findByTeacher_UserId(currentUserId).stream().map(this::toResponse).toList();
    }

    @Override
    @Transactional(readOnly = true)
    public ExamResponse getById(@NonNull Long examId) {
        Exam exam = getExam(examId);
        ensureOwnerOrAdmin(exam);
        return toResponse(exam);
    }

    @Override
    @Transactional
    public void delete(@NonNull Long examId) {
        Exam exam = getExam(examId);
        ensureOwnerOrAdmin(exam);
        examRepository.delete(exam);
    }

    private @NonNull Exam getExam(@NonNull Long examId) {
        return Objects.requireNonNull(
                examRepository.findById(examId)
                        .orElseThrow(() -> new IllegalArgumentException("Exam not found: " + examId))
        );
    }

    private void ensureOwnerOrAdmin(@NonNull Exam exam) {
        if (currentUserService.hasRole("ADMIN")) {
            return;
        }
        if (!currentUserService.requireUserId().equals(exam.getTeacher().getUserId())) {
            throw new IllegalArgumentException("You can only access your own exam");
        }
    }

    private ExamResponse toResponse(Exam exam) {
        List<Long> questionIds = examQuestionRepository.findByExam_ExamIdOrderByOrderIndexAsc(exam.getExamId())
                .stream()
                .map(link -> link.getQuestion().getQuestionId())
                .toList();
        return ExamResponse.builder()
                .examId(exam.getExamId())
                .title(exam.getTitle())
                .duration(exam.getDuration())
                .totalQuestions(exam.getTotalQuestions())
                .teacherId(exam.getTeacher().getUserId())
                .createdAt(exam.getCreatedAt())
                .questionIds(questionIds)
                .build();
    }

    @Override
    @Transactional
    public List<com.planbookai.dto.exam.ExamVersionDTO> generateVersions(Long examId, int count) {
        Exam exam = getExam(examId);
        ensureOwnerOrAdmin(exam);

        List<ExamQuestion> examQuestions = examQuestionRepository.findByExam_ExamIdOrderByOrderIndexAsc(examId);
        if (examQuestions.isEmpty()) {
            throw new IllegalArgumentException("Không có câu hỏi nào trong đề thi này");
        }

        List<com.planbookai.dto.exam.ExamVersionDTO> result = new java.util.ArrayList<>();
        
        for (int i = 1; i <= count; i++) {
            // Shuffle questions to create a new version
            java.util.List<ExamQuestion> shuffled = new java.util.ArrayList<>(examQuestions);
            java.util.Collections.shuffle(shuffled);
            
            java.util.List<String> part1Answers = new java.util.ArrayList<>();
            java.util.List<java.util.Map<String, Object>> details = new java.util.ArrayList<>();
            
            int qNum = 1;
            for (ExamQuestion eq : shuffled) {
                com.planbookai.entity.Question q = eq.getQuestion();
                
                // Shuffle choices if MCQ
                java.util.List<com.planbookai.entity.QuestionChoice> originalChoices = q.getChoices();
                java.util.List<com.planbookai.entity.QuestionChoice> shuffledChoices = new java.util.ArrayList<>();
                if (originalChoices != null) {
                    shuffledChoices.addAll(originalChoices);
                    java.util.Collections.shuffle(shuffledChoices);
                }
                
                String correctChoice = "A"; // default
                java.util.List<String> options = new java.util.ArrayList<>();
                for (int c = 0; c < shuffledChoices.size(); c++) {
                    String letter = String.valueOf((char) ('A' + c));
                    options.add(letter + ". " + shuffledChoices.get(c).getContent());
                    if (Boolean.TRUE.equals(shuffledChoices.get(c).getIsCorrect())) {
                        correctChoice = letter;
                    }
                }
                part1Answers.add(correctChoice);
                
                java.util.Map<String, Object> detail = new java.util.HashMap<>();
                detail.put("questionId", q.getQuestionId());
                detail.put("content", q.getContent());
                detail.put("type", q.getType() != null ? q.getType().name() : "MCQ");
                detail.put("options", options);
                detail.put("correctChoice", correctChoice);
                details.add(detail);
                
                qNum++;
            }

            java.util.Map<String, Object> rootJson = new java.util.HashMap<>();
            rootJson.put("part_1", part1Answers);
            rootJson.put("details", details);

            String answersJson = "{}";
            try {
                answersJson = objectMapper.writeValueAsString(rootJson);
            } catch (Exception e) {
                e.printStackTrace();
            }

            String code = String.valueOf(100 + i); // 101, 102, 103...
            ExamVersion version = ExamVersion.builder()
                    .exam(exam)
                    .versionCode(code)
                    .answerKeyJson(answersJson)
                    .build();
                    
            version = examVersionRepository.save(version);
            
            result.add(com.planbookai.dto.exam.ExamVersionDTO.builder()
                    .versionId(version.getVersionId())
                    .examId(exam.getExamId())
                    .versionCode(version.getVersionCode())
                    .answerKeyJson(version.getAnswerKeyJson())
                    .build());
        }
        
        return result;
    }

    @Override
    @Transactional(readOnly = true)
    public List<com.planbookai.dto.exam.ExamVersionDTO> getVersions(Long examId) {
        Exam exam = getExam(examId);
        ensureOwnerOrAdmin(exam);

        return examVersionRepository.findByExam_ExamId(examId).stream()
                .map(v -> com.planbookai.dto.exam.ExamVersionDTO.builder()
                        .versionId(v.getVersionId())
                        .examId(exam.getExamId())
                        .versionCode(v.getVersionCode())
                        .answerKeyJson(v.getAnswerKeyJson())
                        .build())
                .toList();
    }
}
