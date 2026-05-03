package com.planbookai.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name = "workspace_material")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class WorkspaceMaterial {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long materialId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "teacher_id", nullable = false)
    private User teacher;

    @Column(nullable = false)
    private String fileName;

    @Column(nullable = false)
    private String filePath;

    @Column(length = 50)
    private String fileType;

    private Long fileSize;

    @Column(name = "uploaded_at")
    private LocalDateTime uploadedAt;
}
