package com.planbookai.controller;

import com.planbookai.entity.LessonPlanTemplate;
import com.planbookai.entity.Question;
import com.planbookai.entity.enums.QuestionStatus;
import com.planbookai.entity.enums.TemplateStatus;
import com.planbookai.repository.LessonPlanTemplateRepository;
import com.planbookai.repository.QuestionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/manager")
@RequiredArgsConstructor
public class ManagerController {

    private final QuestionRepository questionRepository;
    private final LessonPlanTemplateRepository lessonPlanTemplateRepository;

    @GetMapping("/pending-contents")
    @PreAuthorize("hasRole('MANAGER') or hasRole('ADMIN')")
    public ResponseEntity<Map<String, Object>> getPendingContents() {
        // Find all pending questions
        List<Question> pendingQuestions = questionRepository.findByStatus(QuestionStatus.PENDING);
        
        // Find all pending templates
        List<LessonPlanTemplate> pendingTemplates = lessonPlanTemplateRepository.findByStatus(TemplateStatus.PENDING);

        Map<String, Object> response = new HashMap<>();
        response.put("pendingQuestions", pendingQuestions);
        response.put("pendingTemplates", pendingTemplates);
        return ResponseEntity.ok(response);
    }
}
