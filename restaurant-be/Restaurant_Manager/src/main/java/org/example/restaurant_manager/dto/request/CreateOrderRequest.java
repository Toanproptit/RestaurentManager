package org.example.restaurant_manager.dto.request;

import java.util.List;

import lombok.Data;

@Data
public class CreateOrderRequest {
    private List<Long> diningTableIds;
}