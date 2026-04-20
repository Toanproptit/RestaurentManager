package org.example.restaurant_manager.dto.request;

import lombok.Data;

@Data
public class CreateOrderRequest {
    private Long diningTableId;
    private Long userId;
    private String username;
}