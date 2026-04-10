package org.example.restaurant_manager.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class OrderCountByFoodResponse {
    private Long foodId;
    private String foodName;
    private Long orderCount;

    public OrderCountByFoodResponse(Long foodId, String foodName, Number orderCount) {
        this.foodId = foodId;
        this.foodName = foodName;
        this.orderCount = orderCount == null ? 0L : orderCount.longValue();
    }
}
