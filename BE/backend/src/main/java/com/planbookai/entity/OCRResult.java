package com.planbookai.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "ocr_result")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class OcrResult {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ocr_result_id")
    private Long ocrResultId;

    /** Lưu trực tiếp exam_id để tránh lazy-load khi OcrController set nhanh */
    @Column(name = "exam_id", nullable = false)
    private Long examId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "student_id")
    private Student student;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "version_id")
    private ExamVersion examVersion;

    @Column(name = "student_code", length = 20)
    private String studentCode; // Raw SBD extracted from OCR

    @Column(name = "version_code", length = 20)
    private String versionCode; // Raw Exam Version code extracted from OCR

    private Double score;

    @Column(name = "result_json", columnDefinition = "json")
    private String resultJson;

    @Builder.Default
    @Column(name = "requires_review")
    private Boolean requiresReview = false;

    @Column(name = "graded_at")
    private LocalDateTime gradedAt;
}