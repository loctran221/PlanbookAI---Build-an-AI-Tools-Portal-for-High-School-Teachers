package com.planbookai.service;

import com.planbookai.dto.admin.AdminDashboardResponse;
import com.planbookai.entity.User;
import com.planbookai.entity.UserOrder;
import com.planbookai.entity.enums.OrderStatus;
import com.planbookai.repository.UserOrderRepository;
import com.planbookai.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AdminService {

    private final UserRepository userRepository;
    private final UserOrderRepository orderRepository;

    @org.springframework.transaction.annotation.Transactional(readOnly = true)
    public AdminDashboardResponse getDashboardData() {
        AdminDashboardResponse response = new AdminDashboardResponse();
        
        List<User> allUsers = userRepository.findAll();
        List<UserOrder> allOrders = orderRepository.findAll();

        // 1. Stats
        response.setTotalUsers(allUsers.size());
        
        long activeTeachers = allUsers.stream()
            .filter(u -> u.getRoles() != null && u.getRoles().stream().anyMatch(r -> r.getName().equalsIgnoreCase("ROLE_TEACHER") || r.getName().equalsIgnoreCase("TEACHER")))
            .count();
        response.setActiveTeachers(activeTeachers);
        
        response.setSystemUptime("99.9%");

        // Calculate Revenue (Current month)
        LocalDate now = LocalDate.now();
        double currentMonthRev = allOrders.stream()
            .filter(o -> o.getStatus() == OrderStatus.ACTIVE || o.getStatus() == OrderStatus.EXPIRED)
            .filter(o -> o.getCreatedAt() != null && o.getCreatedAt().getMonth() == now.getMonth() && o.getCreatedAt().getYear() == now.getYear())
            .filter(o -> o.getSubscriptionPackage() != null && o.getSubscriptionPackage().getPrice() != null)
            .mapToDouble(o -> o.getSubscriptionPackage().getPrice().doubleValue())
            .sum();
        response.setMonthlyRevenue(currentMonthRev);

        // 2. Charts (Last 6 months)
        List<AdminDashboardResponse.ChartData> revenueGrowth = new ArrayList<>();
        List<AdminDashboardResponse.ChartData> userGrowth = new ArrayList<>();
        
        DateTimeFormatter monthFormatter = DateTimeFormatter.ofPattern("MMM");
        
        for (int i = 5; i >= 0; i--) {
            LocalDate targetMonth = now.minusMonths(i);
            String monthName = targetMonth.format(monthFormatter);
            
            // Revenue for this month
            double rev = allOrders.stream()
                .filter(o -> (o.getStatus() == OrderStatus.ACTIVE || o.getStatus() == OrderStatus.EXPIRED))
                .filter(o -> o.getCreatedAt() != null && o.getCreatedAt().getMonth() == targetMonth.getMonth() && o.getCreatedAt().getYear() == targetMonth.getYear())
                .filter(o -> o.getSubscriptionPackage() != null && o.getSubscriptionPackage().getPrice() != null)
                .mapToDouble(o -> o.getSubscriptionPackage().getPrice().doubleValue())
                .sum();
                
            // Users joined this month
            long usersJoined = allUsers.stream()
                .filter(u -> u.getCreatedAt() != null && u.getCreatedAt().getMonth() == targetMonth.getMonth() && u.getCreatedAt().getYear() == targetMonth.getYear())
                .count();
                
            AdminDashboardResponse.ChartData chartRev = new AdminDashboardResponse.ChartData();
            chartRev.setMonth(monthName);
            chartRev.setRevenue(rev);
            revenueGrowth.add(chartRev);
            
            AdminDashboardResponse.ChartData chartUser = new AdminDashboardResponse.ChartData();
            chartUser.setMonth(monthName);
            chartUser.setUsers(usersJoined);
            userGrowth.add(chartUser);
        }
        
        response.setRevenueGrowth(revenueGrowth);
        response.setUserGrowth(userGrowth);

        // 3. Recent Users (Top 5)
        List<AdminDashboardResponse.RecentUserDTO> recentUsers = allUsers.stream()
            .sorted((u1, u2) -> {
                if (u1.getCreatedAt() == null) return 1;
                if (u2.getCreatedAt() == null) return -1;
                return u2.getCreatedAt().compareTo(u1.getCreatedAt());
            })
            .limit(5)
            .map(u -> {
                AdminDashboardResponse.RecentUserDTO dto = new AdminDashboardResponse.RecentUserDTO();
                dto.setId("U" + u.getUserId());
                dto.setName(u.getFullName() != null ? u.getFullName() : "No Name");
                dto.setEmail(u.getEmail());
                dto.setRole(u.getRoles() == null || u.getRoles().isEmpty() ? "USER" : u.getRoles().iterator().next().getName().replace("ROLE_", ""));
                dto.setStatus("Active");
                dto.setJoinDate(u.getCreatedAt() != null ? u.getCreatedAt().toLocalDate().toString() : "N/A");
                return dto;
            })
            .collect(Collectors.toList());
            
        response.setRecentUsers(recentUsers);

        return response;
    }
}
