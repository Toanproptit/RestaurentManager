package org.example.restaurant_manager.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class DashboardSummaryResponse {
    private Long totalOrders;
    private Double totalRevenue;
    private Long totalReservations;
}