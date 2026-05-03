package com.planbookai.dto.student;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ClassGroupDTO {
    private Long classId;
    private String name;
    private String academicYear;
    private int studentCount;
}
