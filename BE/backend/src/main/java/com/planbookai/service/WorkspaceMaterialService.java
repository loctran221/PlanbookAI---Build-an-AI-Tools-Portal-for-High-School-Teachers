package com.planbookai.service;

import com.planbookai.entity.User;
import com.planbookai.entity.WorkspaceMaterial;
import com.planbookai.repository.UserRepository;
import com.planbookai.repository.WorkspaceMaterialRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class WorkspaceMaterialService {

    private final WorkspaceMaterialRepository materialRepository;
    private final UserRepository userRepository;

    @Value("${file.upload-dir:uploads/workspace}")
    private String uploadDir;

    public WorkspaceMaterial uploadFile(MultipartFile file) throws IOException {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User teacher = userRepository.findByEmail(email).orElseThrow();

        // 1. Tạo thư mục lưu trữ nếu chưa có
        Path uploadPath = Paths.get(uploadDir);
        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }

        // 2. Tạo tên file ngẫu nhiên để tránh trùng lặp
        String originalFileName = StringUtils.cleanPath(file.getOriginalFilename());
        String uniqueFileName = UUID.randomUUID().toString() + "_" + originalFileName;
        Path filePath = uploadPath.resolve(uniqueFileName);

        // 3. Copy file từ request vào ổ cứng Local
        Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

        // 4. Lưu thông tin file vào Database
        WorkspaceMaterial material = new WorkspaceMaterial();
        material.setTeacher(teacher);
        material.setFileName(originalFileName);
        material.setFilePath(filePath.toString());
        material.setFileType(file.getContentType());
        material.setFileSize(file.getSize());
        material.setUploadedAt(LocalDateTime.now());

        return materialRepository.save(material);
    }

    public List<WorkspaceMaterial> getMyMaterials() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User teacher = userRepository.findByEmail(email).orElseThrow();
        return materialRepository.findByTeacher_UserIdOrderByUploadedAtDesc(teacher.getUserId());
    }
}
