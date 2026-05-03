package com.planbookai.dto.approval;

import com.planbookai.entity.enums.ApprovalContentType;
import com.planbookai.entity.enums.ApprovalStatus;
import lombok.Data;

@Data
public class ApprovalRequest {
    private Long contentId;
    private ApprovalContentType contentType;
    private ApprovalStatus status;
    private String comment;
}
