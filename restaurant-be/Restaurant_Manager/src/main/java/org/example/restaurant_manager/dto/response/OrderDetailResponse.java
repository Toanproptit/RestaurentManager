package org.example.restaurant_manager.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class OrderDetailResponse {
    private Long idOrder;
    private Long idFood;
    private Long quantity;
    private double price;
}
