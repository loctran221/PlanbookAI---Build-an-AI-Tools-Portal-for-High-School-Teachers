package com.planbookai.service;

import com.planbookai.dto.packageorder.OrderCreateRequest;
import com.planbookai.dto.packageorder.OrderResponse;
import com.planbookai.dto.packageorder.OrderStatusUpdateRequest;

import java.util.List;

public interface OrderService {
    OrderResponse create(OrderCreateRequest request);

    List<OrderResponse> listByRole();

    OrderResponse updateStatus(Long orderId, OrderStatusUpdateRequest request);
}
