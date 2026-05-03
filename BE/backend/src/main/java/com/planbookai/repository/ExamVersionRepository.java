package com.planbookai.repository;

import com.planbookai.entity.ExamVersion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface ExamVersionRepository extends JpaRepository<ExamVersion, Long> {
    List<ExamVersion> findByExam_ExamId(Long examId);

    Optional<ExamVersion> findByVersionCode(String versionCode);

    @Query("select v from ExamVersion v join fetch v.exam where v.versionCode = :versionCode")
    Optional<ExamVersion> findByVersionCodeWithExam(@Param("versionCode") String versionCode);
}
