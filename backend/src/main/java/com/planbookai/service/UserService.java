package com.planbookai.service;

import com.planbookai.dto.user.UserCreateRequest;
import com.planbookai.dto.user.UserResponse;
import com.planbookai.dto.user.UserUpdateRequest;

import java.util.List;

public interface UserService {
    List<UserResponse> findAll();

    UserResponse findById(Long userId);

    UserResponse create(UserCreateRequest request);

    UserResponse update(Long userId, UserUpdateRequest request);

    void delete(Long userId);
}
