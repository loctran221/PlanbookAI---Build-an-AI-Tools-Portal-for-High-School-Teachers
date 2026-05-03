package com.planbookai.dto.admin;

import lombok.Data;
import java.util.List;

@Data
public class AdminDashboardResponse {
    private long totalUsers;
    private double monthlyRevenue;
    private long activeTeachers;
    private String systemUptime; 

    private List<ChartData> revenueGrowth;
    private List<ChartData> userGrowth;
    private List<RecentUserDTO> recentUsers;

    @Data
    public static class ChartData {
        private String month;
        private double revenue;
        private long users;
    }

    @Data
    public static class RecentUserDTO {
        private String id;
        private String name;
        private String email;
        private String role;
        private String status;
        private String joinDate;
    }
}
