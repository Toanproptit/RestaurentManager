package org.example.restaurant_manager.dto.request;

import java.util.List;

import org.example.restaurant_manager.enums.OrderStatus;

import lombok.Data;

@Data
public class UpdateOrderRequest {
    private OrderStatus status;
    private List<Long> diningTableIds;
}