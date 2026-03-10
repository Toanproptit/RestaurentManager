package org.example.restaurant_manager.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class TopSellingFoodResponse {
    private Long foodId;
    private String foodName;
    private Long totalQuantitySold;
    private Double totalRevenue;

    public TopSellingFoodResponse(Long foodId, String foodName, Number totalQuantitySold, Number totalRevenue) {
        this.foodId = foodId;
        this.foodName = foodName;
        this.totalQuantitySold = totalQuantitySold == null ? 0L : totalQuantitySold.longValue();
        this.totalRevenue = totalRevenue == null ? 0D : totalRevenue.doubleValue();
    }
}