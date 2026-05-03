package com.planbookai.controller;

import com.planbookai.entity.WorkspaceMaterial;
import com.planbookai.service.WorkspaceMaterialService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/workspace")
@RequiredArgsConstructor
public class WorkspaceMaterialController {

    private final WorkspaceMaterialService materialService;

    @PostMapping("/upload")
    @PreAuthorize("hasRole('TEACHER')")
    public ResponseEntity<WorkspaceMaterial> uploadFile(@RequestParam("file") MultipartFile file) throws IOException {
        return ResponseEntity.ok(materialService.uploadFile(file));
    }

    @GetMapping
    @PreAuthorize("hasRole('TEACHER')")
    public ResponseEntity<List<WorkspaceMaterial>> getMyMaterials() {
        return ResponseEntity.ok(materialService.getMyMaterials());
    }
}
