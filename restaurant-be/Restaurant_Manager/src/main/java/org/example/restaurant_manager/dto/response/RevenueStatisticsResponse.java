package org.example.restaurant_manager.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class RevenueStatisticsResponse {
    private Integer year;
    private Integer month;
    private Integer day;
    private Double revenue;

    public RevenueStatisticsResponse(Integer year, Integer month, Double revenue) {
        this.year = year;
        this.month = month;
        this.day = null;
        this.revenue = revenue;
    }

    public RevenueStatisticsResponse(Integer year, Double revenue) {
        this.year = year;
        this.month = null;
        this.day = null;
        this.revenue = revenue;
    }
}