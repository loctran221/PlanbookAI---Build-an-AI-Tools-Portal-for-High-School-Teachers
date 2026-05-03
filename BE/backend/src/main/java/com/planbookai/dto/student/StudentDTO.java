package com.planbookai.dto.student;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class StudentDTO {
    private Long studentId;
    private String studentCode;
    private String fullName;
    private Long classId;
    private String className;
}
