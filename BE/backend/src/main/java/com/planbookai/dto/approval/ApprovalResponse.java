package com.planbookai.dto.approval;

import com.planbookai.entity.enums.ApprovalContentType;
import com.planbookai.entity.enums.ApprovalStatus;
import lombok.Data;
import java.time.LocalDateTime;

@Data
public class ApprovalResponse {
    private Long approvalId;
    private Long approverId;
    private String approverName;
    private Long contentId;
    private ApprovalContentType contentType;
    private ApprovalStatus status;
    private String comment;
    private LocalDateTime createdAt;
}
