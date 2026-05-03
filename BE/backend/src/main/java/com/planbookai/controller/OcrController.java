package com.planbookai.controller;

import com.planbookai.dto.ocr.OcrResultResponse;
import com.planbookai.dto.ocr.OcrSimulateRequest;
import com.planbookai.entity.AnswerKey;
import com.planbookai.entity.OcrResult;
import com.planbookai.repository.AnswerKeyRepository;
import com.planbookai.repository.OcrResultRepository;
import com.planbookai.service.OcrService;
import com.planbookai.service.ocr.GeminiAiService;
import com.planbookai.service.ocr.GradingService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.lang.NonNull;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.nio.file.Files;
import java.nio.file.Path;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Objects;

@RestController
@RequestMapping("/api/v1/ocr")
@RequiredArgsConstructor
public class OcrController {

    private final OcrService ocrService;
    private final GeminiAiService geminiAiService;
    private final GradingService gradingService;
    private final OcrResultRepository ocrResultRepository;
    private final AnswerKeyRepository answerKeyRepository;
    private final com.planbookai.repository.ExamVersionRepository examVersionRepository;

    // ==========================================
    // 1. Simulate OCR (không cần ảnh thật - dùng để test)
    // ==========================================
    @PostMapping("/simulate")
    @PreAuthorize("hasAnyRole('TEACHER','ADMIN')")
    public ResponseEntity<OcrResultResponse> simulate(@Valid @RequestBody OcrSimulateRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(ocrService.simulateAndSave(request));
    }

    @GetMapping("/exam/{examId}")
    @PreAuthorize("hasAnyRole('TEACHER','ADMIN')")
    public List<OcrResultResponse> byExam(@PathVariable @NonNull Long examId) {
        return ocrService.findByExam(examId);
    }

    // ==========================================
    // 2. Upload batch ảnh bài thi → Gemini AI chấm điểm thật
    // POST /api/v1/ocr/upload-batch
    // FormData: files[] = ảnh bài làm, examCode = "EXAM001"
    // ==========================================
    @PostMapping("/upload-batch")
    @PreAuthorize("hasAnyRole('TEACHER','ADMIN')")
    @SuppressWarnings("null")
    @Transactional
    public ResponseEntity<?> uploadBatch(
            @RequestParam("files") MultipartFile[] files,
            @RequestParam("examCode") String versionCode) {

        String normalizedCode = versionCode.trim().toUpperCase();

        com.planbookai.entity.ExamVersion version = examVersionRepository
                .findByVersionCodeWithExam(normalizedCode)
                .orElse(null);

        AnswerKey answerKey = null;
        if (version == null) {
            answerKey = answerKeyRepository.findByExamCode(normalizedCode).orElse(null);
        }

        if (version == null && answerKey == null) {
            return ResponseEntity.badRequest()
                    .body(Map.of("message", "Không tìm thấy đáp án chuẩn cho mã đề: " + normalizedCode
                            + ". Hãy tạo đáp án chuẩn trước."));
        }

        String answerKeyJson;
        Long examId;
        if (version != null) {
            answerKeyJson = version.getAnswerKeyJson();
            examId = version.getExam().getExamId();
        } else {
            answerKeyJson = Objects.requireNonNull(answerKey).getAnswersJson();
            examId = Objects.requireNonNull(answerKey).getExam().getExamId();
        }

        List<OcrResultResponse> results = new ArrayList<>();

        for (MultipartFile file : files) {
            Path tempFile = null;
            try {
                // 2. Lưu file tạm
                String originalName = file.getOriginalFilename() != null
                        ? file.getOriginalFilename() : "upload.jpg";
                tempFile = Files.createTempFile("pba_ocr_", "_" + originalName);
                java.io.File savedFile = Objects.requireNonNull(tempFile).toFile();
                file.transferTo(savedFile);

                // 3. Gọi Gemini AI phân tích ảnh
                String geminiJson = geminiAiService.analyzeImageWithGemini(tempFile);

                // 4. Tính điểm (Sử dụng đáp án của Mã đề)
                double score = gradingService.calculateNewCurriculumScore(
                        geminiJson, answerKeyJson);

                // 5. Lấy mã số học sinh (SBD) thay vì tên
                String studentCode = gradingService.extractStudentName(
                        geminiJson, "HS: " + originalName);

                // 6. Lưu kết quả
                OcrResult res = OcrResult.builder()
                        .examId(examId)
                        .examVersion(version)
                        .versionCode(normalizedCode)
                        .studentCode(studentCode)
                        .score(score)
                        .resultJson(geminiJson)
                        .requiresReview(false)
                        .gradedAt(LocalDateTime.now())
                        .build();

                OcrResult savedResult = Objects.requireNonNull(ocrResultRepository.save(res));
                results.add(toResponse(savedResult));

            } catch (Exception e) {
                e.printStackTrace();
                // Lưu lỗi vào kết quả để FE biết bài nào bị lỗi
                OcrResult errResult = OcrResult.builder()
                        .examId(examId)
                        .examVersion(version)
                        .versionCode(normalizedCode)
                        .studentCode("Lỗi: " + file.getOriginalFilename())
                        .score(0.0)
                        .resultJson(toJsonError(e.getMessage()))
                        .requiresReview(true)
                        .gradedAt(LocalDateTime.now())
                        .build();
                OcrResult savedErrResult = Objects.requireNonNull(ocrResultRepository.save(errResult));
                results.add(toResponse(savedErrResult));
            } finally {
                // 7. Xóa file tạm
                if (tempFile != null) {
                    try { Files.deleteIfExists(tempFile); } catch (Exception ignored) {}
                }
            }
        }

        return ResponseEntity.ok(results);
    }

    private OcrResultResponse toResponse(OcrResult entity) {
        String displayName = entity.getStudent() != null ? entity.getStudent().getFullName() : entity.getStudentCode();
        return OcrResultResponse.builder()
                .ocrResultId(entity.getOcrResultId())
                .examId(entity.getExamId())
                .studentName(displayName)
                .score(entity.getScore())
                .resultJson(entity.getResultJson())
                .gradedAt(entity.getGradedAt())
                .requiresReview(entity.getRequiresReview())
                .build();
    }

    // ==========================================
    // 3. Tạo/cập nhật đáp án chuẩn cho mã đề
    // POST /api/v1/ocr/answer-key
    // Body: { "examId": 1, "examCode": "EXAM001", "answersJson": "{\"part_1\":[\"A\",\"B\"]}" }
    // ==========================================
    @PostMapping("/answer-key")
    @PreAuthorize("hasAnyRole('TEACHER','ADMIN')")
    @SuppressWarnings("null")
    public ResponseEntity<?> createAnswerKey(@RequestBody Map<String, Object> body) {
        try {
            Long examId = Long.parseLong(body.get("examId").toString());
            String examCode = body.get("examCode").toString().trim().toUpperCase();
            String answersJson = body.get("answersJson").toString();

            // Kiểm tra nếu đã tồn tại
            AnswerKey existing = answerKeyRepository.findByExamCode(examCode).orElse(null);
            if (existing != null) {
                existing.setAnswersJson(answersJson);
                answerKeyRepository.save(existing);
                return ResponseEntity.ok(Map.of("message", "Đã cập nhật đáp án cho mã đề " + examCode));
            }

            // Tạo mới
            com.planbookai.entity.Exam exam = new com.planbookai.entity.Exam();
            exam.setExamId(examId);

            AnswerKey ak = AnswerKey.builder()
                    .exam(exam)
                    .examCode(examCode)
                    .answersJson(answersJson)
                    .build();
            Objects.requireNonNull(answerKeyRepository.save(ak));

            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(Map.of("message", "Tạo đáp án thành công cho mã đề " + examCode));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("message", "Lỗi tạo đáp án: " + e.getMessage()));
        }
    }

    // ==========================================
    // 4. Lấy danh sách đáp án chuẩn
    // ==========================================
    @GetMapping("/answer-keys")
    @PreAuthorize("hasAnyRole('TEACHER','ADMIN')")
    public ResponseEntity<?> listAnswerKeys() {
        return ResponseEntity.ok(answerKeyRepository.findAll());
    }

    private String toJsonError(String message) {
        if (message == null) {
            message = "Unknown error";
        }
        message = message
                .replace("\\", "\\\\")
                .replace("\"", "\\\"")
                .replace("\n", "\\n")
                .replace("\r", "\\r");
        return "{\"error\":\"" + message + "\"}";
    }
}