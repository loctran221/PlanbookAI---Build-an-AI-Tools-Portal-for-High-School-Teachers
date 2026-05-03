package com.planbookai.controller;

import com.planbookai.dto.approval.ApprovalRequest;
import com.planbookai.dto.approval.ApprovalResponse;
import com.planbookai.service.ApprovalService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/approvals")
@RequiredArgsConstructor
public class ApprovalController {

    private final ApprovalService approvalService;

    @PostMapping
    @PreAuthorize("hasRole('MANAGER') or hasRole('ADMIN')")
    public ResponseEntity<ApprovalResponse> approveOrReject(@RequestBody ApprovalRequest request) {
        ApprovalResponse response = approvalService.createApproval(request);
        return ResponseEntity.ok(response);
    }
}
