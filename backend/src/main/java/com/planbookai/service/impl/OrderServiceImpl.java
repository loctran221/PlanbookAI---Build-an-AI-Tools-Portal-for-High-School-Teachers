package com.planbookai.service.impl;

import com.planbookai.dto.packageorder.OrderCreateRequest;
import com.planbookai.dto.packageorder.OrderResponse;
import com.planbookai.dto.packageorder.OrderStatusUpdateRequest;
import com.planbookai.entity.SubscriptionPackage;
import com.planbookai.entity.User;
import com.planbookai.entity.UserOrder;
import com.planbookai.entity.enums.OrderStatus;
import com.planbookai.repository.SubscriptionPackageRepository;
import com.planbookai.repository.UserOrderRepository;
import com.planbookai.repository.UserRepository;
import com.planbookai.security.CurrentUserService;
import com.planbookai.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class OrderServiceImpl implements OrderService {

    private final UserOrderRepository orderRepository;
    private final SubscriptionPackageRepository packageRepository;
    private final UserRepository userRepository;
    private final CurrentUserService currentUserService;

    @Override
    @Transactional
    public OrderResponse create(OrderCreateRequest request) {
        Long currentUserId = currentUserService.requireUserId();
        User user = userRepository.findById(currentUserId)
                .orElseThrow(() -> new IllegalArgumentException("User not found: " + currentUserId));
        SubscriptionPackage pack = packageRepository.findById(request.getPackageId())
                .orElseThrow(() -> new IllegalArgumentException("Package not found: " + request.getPackageId()));

        UserOrder order = new UserOrder();
        order.setUser(user);
        order.setSubscriptionPackage(pack);
        order.setStatus(OrderStatus.PENDING);
        order.setStartDate(LocalDate.now());
        order.setEndDate(LocalDate.now().plusDays(pack.getDurationDays()));
        order.setCreatedAt(LocalDateTime.now());
        return toResponse(orderRepository.save(order));
    }

    @Override
    @Transactional(readOnly = true)
    public List<OrderResponse> listByRole() {
        if (currentUserService.hasRole("ADMIN") || currentUserService.hasRole("MANAGER")) {
            return orderRepository.findAll().stream().map(this::toResponse).toList();
        }
        return orderRepository.findByUser_UserId(currentUserService.requireUserId()).stream().map(this::toResponse).toList();
    }

    @Override
    @Transactional
    public OrderResponse updateStatus(Long orderId, OrderStatusUpdateRequest request) {
        UserOrder order = orderRepository.findById(orderId)
                .orElseThrow(() -> new IllegalArgumentException("Order not found: " + orderId));
        order.setStatus(request.getStatus());
        return toResponse(orderRepository.save(order));
    }

    private OrderResponse toResponse(UserOrder order) {
        return OrderResponse.builder()
                .orderId(order.getOrderId())
                .userId(order.getUser().getUserId())
                .packageId(order.getSubscriptionPackage().getPackageId())
                .status(order.getStatus())
                .startDate(order.getStartDate())
                .endDate(order.getEndDate())
                .createdAt(order.getCreatedAt())
                .build();
    }
}
