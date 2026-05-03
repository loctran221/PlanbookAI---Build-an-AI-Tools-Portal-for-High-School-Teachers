package com.planbookai.controller;

import com.planbookai.entity.Topic;
import com.planbookai.repository.TopicRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/topics")
@RequiredArgsConstructor
public class TopicController {

    private final TopicRepository topicRepository;

    @GetMapping
    @PreAuthorize("isAuthenticated()")
    public List<java.util.Map<String, Object>> list() {
        return topicRepository.findAll().stream().map(t -> {
            java.util.Map<String, Object> map = new java.util.HashMap<>();
            map.put("topicId", t.getTopicId());
            map.put("name", t.getName());
            map.put("subjectId", t.getSubject() != null ? t.getSubject().getSubjectId() : null);
            return map;
        }).toList();
    }
}