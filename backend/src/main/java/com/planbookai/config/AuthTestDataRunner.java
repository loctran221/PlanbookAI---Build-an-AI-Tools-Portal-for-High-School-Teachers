package com.planbookai.config;

import com.planbookai.entity.Role;
import com.planbookai.entity.User;
import com.planbookai.repository.RoleRepository;
import com.planbookai.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

/**
 * Seeds a fixed test account for local auth testing (idempotent).
 */
@Component
@RequiredArgsConstructor
public class AuthTestDataRunner implements ApplicationRunner {

    private static final String TEST_EMAIL = "teacher@test.com";
    private static final String TEST_PASSWORD = "123456";
    private static final String TEACHER_ROLE_NAME = "TEACHER";

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    @Transactional
    public void run(ApplicationArguments args) {
        Role teacherRole = roleRepository.findByName(TEACHER_ROLE_NAME)
                .orElseGet(() -> roleRepository.save(createRole(TEACHER_ROLE_NAME)));

        User user = userRepository.findByEmail(TEST_EMAIL).orElseGet(User::new);
        boolean isNew = user.getUserId() == null;

        if (isNew) {
            user.setEmail(TEST_EMAIL);
            user.setCreatedAt(LocalDateTime.now());
        }
        user.setPasswordHash(passwordEncoder.encode(TEST_PASSWORD));
        user.setFullName("Test Teacher");
        user.setStatus("active");
        user.setUpdatedAt(LocalDateTime.now());
        user.getRoles().add(teacherRole);

        userRepository.save(user);
    }

    private static Role createRole(String name) {
        Role role = new Role();
        role.setName(name);
        return role;
    }
}
