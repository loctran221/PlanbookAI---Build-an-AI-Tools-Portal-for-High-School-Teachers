package com.planbookai.entity;

import jakarta.persistence.*;
import lombok.*;

import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "class_group")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class ClassGroup {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "class_id")
    private Long classId;

    @Column(nullable = false, length = 100)
    private String name;

    @Column(name = "academic_year", length = 20)
    private String academicYear;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "teacher_id", nullable = false)
    private User teacher;

    @OneToMany(mappedBy = "classGroup", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private Set<Student> students = new HashSet<>();
}
