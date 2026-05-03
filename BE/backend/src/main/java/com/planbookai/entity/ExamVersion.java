package com.planbookai.entity;

import jakarta.persistence.*;
import lombok.*;

import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "exam_version")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class ExamVersion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "version_id")
    private Long versionId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "exam_id", nullable = false)
    private Exam exam;

    @Column(name = "version_code", nullable = false, length = 20)
    private String versionCode; // Mã đề (e.g., 101, 102)

    // JSON format mapping question numbers to correct answers (e.g., {"1": "A", "2": "B"})
    @Column(name = "answer_key_json", columnDefinition = "json")
    private String answerKeyJson;

    @OneToMany(mappedBy = "examVersion", fetch = FetchType.LAZY)
    @Builder.Default
    private Set<OcrResult> ocrResults = new HashSet<>();
}
