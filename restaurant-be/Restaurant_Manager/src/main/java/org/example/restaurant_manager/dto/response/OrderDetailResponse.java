package org.example.restaurant_manager.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class OrderDetailResponse {
    private Long id;
    private Long orderId;
    private FoodResponse food;
    private Long quantity;
    private double price;
}
