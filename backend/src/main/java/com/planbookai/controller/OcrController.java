package com.planbookai.controller;

import com.planbookai.dto.ocr.OcrResultResponse;
import com.planbookai.dto.ocr.OcrSimulateRequest;
import com.planbookai.service.OcrService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.lang.NonNull;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/ocr")
@RequiredArgsConstructor
@PreAuthorize("hasAnyRole('TEACHER','ADMIN')")
public class OcrController {

    private final OcrService ocrService;

    @PostMapping("/simulate")
    public ResponseEntity<OcrResultResponse> simulate(@Valid @RequestBody OcrSimulateRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(ocrService.simulateAndSave(request));
    }

    @GetMapping("/exam/{examId}")
    public List<OcrResultResponse> byExam(@PathVariable @NonNull Long examId) {
        return ocrService.findByExam(examId);
    }
}
