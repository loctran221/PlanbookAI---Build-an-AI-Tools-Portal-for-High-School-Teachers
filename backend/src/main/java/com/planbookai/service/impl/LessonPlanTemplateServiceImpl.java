package com.planbookai.service.impl;

import com.planbookai.dto.lessonplan.LessonPlanTemplateRequest;
import com.planbookai.dto.lessonplan.LessonPlanTemplateResponse;
import com.planbookai.entity.LessonPlanTemplate;
import com.planbookai.entity.User;
import com.planbookai.repository.LessonPlanTemplateRepository;
import com.planbookai.repository.UserRepository;
import com.planbookai.security.CurrentUserService;
import com.planbookai.service.LessonPlanTemplateService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class LessonPlanTemplateServiceImpl implements LessonPlanTemplateService {

    private final LessonPlanTemplateRepository templateRepository;
    private final UserRepository userRepository;
    private final CurrentUserService currentUserService;

    @Override
    @Transactional
    public LessonPlanTemplateResponse create(LessonPlanTemplateRequest request) {
        Long currentUserId = currentUserService.requireUserId();
        User user = userRepository.findById(currentUserId)
                .orElseThrow(() -> new IllegalArgumentException("User not found: " + currentUserId));
        LessonPlanTemplate template = new LessonPlanTemplate();
        template.setCreatedBy(user);
        template.setTitle(request.getTitle());
        template.setStructureJson(request.getStructureJson());
        template.setStatus(request.getStatus());
        template.setCreatedAt(LocalDateTime.now());
        return toResponse(templateRepository.save(template));
    }

    @Override
    @Transactional(readOnly = true)
    public List<LessonPlanTemplateResponse> findAll() {
        return templateRepository.findAll().stream().map(this::toResponse).toList();
    }

    @Override
    @Transactional
    public LessonPlanTemplateResponse update(Long id, LessonPlanTemplateRequest request) {
        LessonPlanTemplate template = templateRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Template not found: " + id));
        template.setTitle(request.getTitle());
        template.setStructureJson(request.getStructureJson());
        template.setStatus(request.getStatus());
        return toResponse(templateRepository.save(template));
    }

    @Override
    @Transactional
    public void delete(Long id) {
        LessonPlanTemplate template = templateRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Template not found: " + id));
        templateRepository.delete(template);
    }

    private LessonPlanTemplateResponse toResponse(LessonPlanTemplate template) {
        return LessonPlanTemplateResponse.builder()
                .lessonPlanTemplateId(template.getLessonPlanTemplateId())
                .title(template.getTitle())
                .structureJson(template.getStructureJson())
                .status(template.getStatus())
                .createdByUserId(template.getCreatedBy().getUserId())
                .createdAt(template.getCreatedAt())
                .build();
    }
}
