package com.planbookai.dto.exam;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ExamVersionDTO {
    private Long versionId;
    private Long examId;
    private String versionCode;
    private String answerKeyJson;
}
