package com.planbookai.service;

import com.planbookai.dto.approval.ApprovalRequest;
import com.planbookai.dto.approval.ApprovalResponse;
import com.planbookai.entity.Approval;
import com.planbookai.entity.User;
import com.planbookai.entity.enums.ApprovalStatus;
import com.planbookai.entity.enums.QuestionStatus;
import com.planbookai.entity.enums.TemplateStatus;
import com.planbookai.repository.ApprovalRepository;
import com.planbookai.repository.UserRepository;
import com.planbookai.repository.QuestionRepository;
import com.planbookai.repository.LessonPlanTemplateRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class ApprovalService {

    private final ApprovalRepository approvalRepository;
    private final UserRepository userRepository;
    private final QuestionRepository questionRepository;
    private final LessonPlanTemplateRepository lessonPlanTemplateRepository;

    @Transactional
    public ApprovalResponse createApproval(ApprovalRequest request) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User approver = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Approval approval = new Approval();
        approval.setApprover(approver);
        approval.setContentId(request.getContentId());
        approval.setContentType(request.getContentType());
        approval.setStatus(request.getStatus());
        approval.setComment(request.getComment());
        approval.setCreatedAt(LocalDateTime.now());

        approval = approvalRepository.save(approval);

        // Update target entity status
        switch (request.getContentType()) {
            case QUESTION:
                questionRepository.findById(request.getContentId()).ifPresent(q -> {
                    q.setStatus(request.getStatus() == ApprovalStatus.APPROVED ? QuestionStatus.APPROVED : QuestionStatus.PENDING);
                    questionRepository.save(q);
                });
                break;
            case LESSON_PLAN:
                lessonPlanTemplateRepository.findById(request.getContentId()).ifPresent(t -> {
                    t.setStatus(request.getStatus() == ApprovalStatus.APPROVED ? TemplateStatus.APPROVED : TemplateStatus.PENDING);
                    lessonPlanTemplateRepository.save(t);
                });
                break;
            case PROMPT:
                // Prompt does not have a status field in the entity currently.
                break;
        }

        return mapToResponse(approval);
    }

    private ApprovalResponse mapToResponse(Approval approval) {
        ApprovalResponse response = new ApprovalResponse();
        response.setApprovalId(approval.getApprovalId());
        response.setApproverId(approval.getApprover().getUserId());
        response.setApproverName(approval.getApprover().getFullName());
        response.setContentId(approval.getContentId());
        response.setContentType(approval.getContentType());
        response.setStatus(approval.getStatus());
        response.setComment(approval.getComment());
        response.setCreatedAt(approval.getCreatedAt());
        return response;
    }
}
