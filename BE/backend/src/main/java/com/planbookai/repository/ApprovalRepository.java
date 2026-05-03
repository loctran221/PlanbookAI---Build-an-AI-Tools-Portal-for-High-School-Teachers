package com.planbookai.repository;

import com.planbookai.entity.Approval;
import com.planbookai.entity.enums.ApprovalContentType;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ApprovalRepository extends JpaRepository<Approval, Long> {
    List<Approval> findByContentIdAndContentTypeOrderByCreatedAtDesc(Long contentId, ApprovalContentType contentType);
}
